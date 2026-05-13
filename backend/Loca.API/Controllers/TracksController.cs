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
        [FromQuery] string? q,
        CancellationToken ct = default)
    {
        var query = _db.Tracks.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(locationName))
        {
            var trimmed = locationName.Trim();
            query = query.Where(t => t.LocationName == trimmed);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                t.ArtistName.ToLower().Contains(term));
        }

        var tracks = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        var dtos = new List<TrackResponseDto>();
        foreach (var track in tracks)
        {
            var streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct);
            dtos.Add(MapToDto(track, streamUrl));
        }

        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TrackResponseDto>> GetById(Guid id, CancellationToken ct = default)
    {
        var track = await _db.Tracks
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id, ct);

        if (track is null)
            return NotFound();

        var streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct);
        return Ok(MapToDto(track, streamUrl));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TrackResponseDto>> Create(
        [FromBody] CreateTrackRequestDto request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.ArtistName))
            return BadRequest(new { message = "Title and ArtistName are required." });

        if (string.IsNullOrWhiteSpace(request.StorageFileKey))
            return BadRequest(new { message = "StorageFileKey is required." });

        if (request.Duration <= 0)
            return BadRequest(new { message = "Duration must be positive." });

        var albumExists = await _db.Albums.AnyAsync(a => a.Id == request.AlbumId, ct);
        if (!albumExists)
            return BadRequest(new { message = "Album not found." });

        var track = new Track
        {
            Title = request.Title.Trim(),
            ArtistName = request.ArtistName.Trim(),
            StorageFileKey = request.StorageFileKey,
            AlbumId = request.AlbumId,
            Duration = request.Duration,
            LocationName = request.LocationName.Trim(),
            CoverImageUrl = request.CoverImageUrl,
        };

        _db.Tracks.Add(track);
        await _db.SaveChangesAsync(ct);

        var streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct);
        return CreatedAtAction(nameof(GetById), new { id = track.Id }, MapToDto(track, streamUrl));
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (track is null)
            return NotFound();

        _db.Tracks.Remove(track);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [Authorize]
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> LikeTrack([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userIdValue = User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (track is null)
            return NotFound();

        var user = await _db.Users
            .Include(u => u.LikedTracks)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
            return Unauthorized();

        if (!user.LikedTracks.Any(t => t.Id == id))
        {
            user.LikedTracks.Add(track);
            await _db.SaveChangesAsync(ct);
        }

        return Ok();
    }

    [Authorize]
    [HttpDelete("{id:guid}/like")]
    public async Task<IActionResult> UnlikeTrack([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userIdValue = User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var user = await _db.Users
            .Include(u => u.LikedTracks)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
            return Unauthorized();

        var track = user.LikedTracks.FirstOrDefault(t => t.Id == id);
        if (track is not null)
        {
            user.LikedTracks.Remove(track);
            await _db.SaveChangesAsync(ct);
        }

        return NoContent();
    }

    private static TrackResponseDto MapToDto(Track track, string? streamUrl) => new()
    {
        Id = track.Id,
        Title = track.Title,
        ArtistName = track.ArtistName,
        CoverImageUrl = track.CoverImageUrl,
        Duration = track.Duration,
        LocationName = track.LocationName,
        AlbumId = track.AlbumId,
        StreamUrl = streamUrl,
    };
}
