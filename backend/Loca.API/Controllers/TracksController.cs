using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/tracks")]
public sealed class TracksController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IStorageService _storageService;

    public TracksController(ApplicationDbContext db, IStorageService storageService)
    {
        _db = db;
        _storageService = storageService;
    }

    [HttpGet("nearby")]
    public async Task<ActionResult<IReadOnlyList<TrackResponseDto>>> GetNearby(
        [FromQuery] string? locationName,
        CancellationToken ct = default)
    {
        var query = _db.Tracks.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(locationName))
        {
            var trimmed = locationName.Trim();
            query = query.Where(t => t.LocationName == trimmed);
        }

        var tracks = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        var dtos = new List<TrackResponseDto>();
        foreach (var track in tracks)
        {
            var streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct);
            dtos.Add(new TrackResponseDto
            {
                Id = track.Id,
                Title = track.Title,
                ArtistName = track.ArtistName,
                CoverImageUrl = track.CoverImageUrl,
                Duration = track.Duration,
                LocationName = track.LocationName,
                StreamUrl = streamUrl,
            });
        }

        return Ok(dtos);
    }

    [Authorize]
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> LikeTrack([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userIdValue = User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (track is null)
        {
            return NotFound();
        }

        var user = await _db.Users
            .Include(u => u.LikedTracks)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
        {
            return Unauthorized();
        }

        var alreadyLiked = user.LikedTracks.Any(t => t.Id == id);
        if (!alreadyLiked)
        {
            user.LikedTracks.Add(track);
            await _db.SaveChangesAsync(ct);
        }

        return Ok();
    }
}
