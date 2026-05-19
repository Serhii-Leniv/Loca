using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Controllers
{
    [ApiController]
    [Route("api/playlists")]
    public sealed class PlaylistsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public PlaylistsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PlaylistResponseDto>> Create([FromBody] CreatePlaylistRequestDto req, CancellationToken ct = default)
        {
            var userIdValue = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(req.Name))
                return BadRequest(new { message = "Name is required" });

            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                Name = req.Name.Trim(),
                UserId = userId,
            };

            _db.Playlists.Add(playlist);
            await _db.SaveChangesAsync(ct);

            return CreatedAtAction(nameof(GetAllForUser), new { id = playlist.Id }, MapToDto(playlist));
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<PlaylistResponseDto>>> GetAllForUser([FromQuery] Guid? trackId, CancellationToken ct = default)
        {
            var userIdValue = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var playlists = await _db.Playlists
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync(ct);

            var result = new List<PlaylistResponseDto>();
            foreach (var p in playlists)
            {
                // Load first four cover image urls ordered by AddedAt
                var covers = await _db.PlaylistTracks
                    .AsNoTracking()
                    .Where(pt => pt.PlaylistId == p.Id && pt.Track != null)
                    .OrderBy(pt => pt.AddedAt)
                    .Select(pt => pt.Track!.CoverImageUrl)
                    .Where(url => !string.IsNullOrWhiteSpace(url))
                    .Take(4)
                    .ToListAsync(ct);

                var dto = MapToDto(p);
                dto.CoverImageUrls = covers!;
                dto.TrackCount = await _db.PlaylistTracks.CountAsync(pt => pt.PlaylistId == p.Id, ct);
                if (trackId.HasValue)
                {
                    dto.ContainsTrack = await _db.PlaylistTracks.AnyAsync(pt => pt.PlaylistId == p.Id && pt.TrackId == trackId.Value, ct);
                }
                result.Add(dto);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpPost("{playlistId:guid}/tracks/{trackId:guid}")]
        public async Task<IActionResult> AddTrack(Guid playlistId, Guid trackId, CancellationToken ct = default)
        {
            var userIdValue = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var playlist = await _db.Playlists.FindAsync(new object[] { playlistId }, ct);
            if (playlist is null || playlist.UserId != userId)
                return NotFound();

            var trackExists = await _db.Tracks.AsNoTracking().AnyAsync(t => t.Id == trackId, ct);
            if (!trackExists)
                return NotFound(new { message = "Track not found" });

            var existing = await _db.PlaylistTracks.FindAsync(new object[] { playlistId, trackId }, ct);
            if (existing is not null)
                return Conflict(new { message = "Track already in playlist" });

            _db.PlaylistTracks.Add(new PlaylistTrack
            {
                PlaylistId = playlistId,
                TrackId = trackId,
                AddedAt = DateTime.UtcNow,
            });

            await _db.SaveChangesAsync(ct);
            return Ok();
        }

        [Authorize]
        [HttpDelete("{playlistId:guid}/tracks/{trackId:guid}")]
        public async Task<IActionResult> RemoveTrack(Guid playlistId, Guid trackId, CancellationToken ct = default)
        {
            var userIdValue = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var playlist = await _db.Playlists.FindAsync(new object[] { playlistId }, ct);
            if (playlist is null || playlist.UserId != userId)
                return NotFound();

            var link = await _db.PlaylistTracks.FindAsync(new object[] { playlistId, trackId }, ct);
            if (link is null)
                return NotFound();

            _db.PlaylistTracks.Remove(link);
            await _db.SaveChangesAsync(ct);
            return NoContent();
        }

        private static PlaylistResponseDto MapToDto(Playlist p)
        {
            return new PlaylistResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                CreatedAt = p.CreatedAt,
            };
        }
    }
}
