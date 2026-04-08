using System.Security.Claims;
using Loca.API.Data;
using Loca.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/tracks")]
public sealed class TracksController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public TracksController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("nearby")]
    public async Task<ActionResult<IReadOnlyList<TrackResponseDto>>> GetNearby(
        [FromQuery] string? locationName,
        CancellationToken cancellationToken)
    {
        var query = _db.Tracks.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(locationName))
        {
            var trimmed = locationName.Trim();
            query = query.Where(t => t.LocationName == trimmed);
        }

        var tracks = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TrackResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                ArtistName = t.ArtistName,
                CoverImageUrl = t.CoverImageUrl,
                Duration = t.Duration,
                LocationName = t.LocationName,
                StreamUrl = null,
            })
            .ToListAsync(cancellationToken);

        return Ok(tracks);
    }

    [Authorize]
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> LikeTrack([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (track is null)
        {
            return NotFound();
        }

        var user = await _db.Users
            .Include(u => u.LikedTracks)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            return Unauthorized();
        }

        var alreadyLiked = user.LikedTracks.Any(t => t.Id == id);
        if (!alreadyLiked)
        {
            user.LikedTracks.Add(track);
            await _db.SaveChangesAsync(cancellationToken);
        }

        return Ok();
    }
}

