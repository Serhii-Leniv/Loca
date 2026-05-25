using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Models;
using Loca.API.Interfaces;
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
        private readonly IStorageService _storageService;

        public PlaylistsController(ApplicationDbContext db, IStorageService storageService)
        {
            _db = db;
            _storageService = storageService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PlaylistResponseDto>> Create([FromBody] CreatePlaylistRequestDto req, CancellationToken ct = default)
        {
            var userIdValue = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var userExists = await _db.Users.AnyAsync(u => u.Id == userId, ct);
            if (!userExists)
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
                // Load first four cover image keys ordered by AddedAt
                var coverKeys = await _db.PlaylistTracks
                    .AsNoTracking()
                    .Where(pt => pt.PlaylistId == p.Id && pt.Track != null)
                    .OrderBy(pt => pt.AddedAt)
                    .Select(pt => pt.Track!.CoverImageUrl)
                    .Where(url => !string.IsNullOrWhiteSpace(url))
                    .Take(4)
                    .ToListAsync(ct);

                // Generate presigned URLs for covers
                var covers = new List<string>();
                foreach (var key in coverKeys)
                {
                    if (!string.IsNullOrWhiteSpace(key))
                    {
                        try
                        {
                            var presignedUrl = await _storageService.GenerateDownloadUrlAsync(key, ct);
                            covers.Add(presignedUrl);
                        }
                        catch
                        {
                            // If presigned URL generation fails, skip this cover
                        }
                    }
                }

                var dto = MapToDto(p);
                dto.CoverImageUrls = covers;
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
        [HttpGet("{playlistId:guid}")]
        public async Task<ActionResult<PlaylistDetailResponseDto>> GetById(Guid playlistId, CancellationToken ct = default)
        {
            var userIdValue = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var playlist = await _db.Playlists
                .AsNoTracking()
                .Where(p => p.Id == playlistId && p.UserId == userId)
                .FirstOrDefaultAsync(ct);

            if (playlist is null)
                return NotFound();

            var tracks = await _db.PlaylistTracks
                .AsNoTracking()
                .Where(pt => pt.PlaylistId == playlistId)
                .OrderBy(pt => pt.AddedAt)
                .Select(pt => new { pt.Track!.Id, pt.Track.Title, pt.Track.ArtistName, pt.Track.Duration, pt.Track.CoverImageUrl })
                .ToListAsync(ct);

            var trackDtos = new List<TrackDto>();
            foreach (var track in tracks)
            {
                var coverUrl = track.CoverImageUrl;
                if (!string.IsNullOrWhiteSpace(coverUrl))
                {
                    try
                    {
                        coverUrl = await _storageService.GenerateDownloadUrlAsync(coverUrl, ct);
                    }
                    catch
                    {
                        coverUrl = "";
                    }
                }

                trackDtos.Add(new TrackDto
                {
                    Id = track.Id,
                    Title = track.Title,
                    ArtistName = track.ArtistName,
                    Duration = track.Duration,
                    CoverImageUrl = coverUrl ?? "",
                });
            }

            var coverKeys = await _db.PlaylistTracks
                .AsNoTracking()
                .Where(pt => pt.PlaylistId == playlistId && pt.Track != null && !string.IsNullOrWhiteSpace(pt.Track.CoverImageUrl))
                .OrderBy(pt => pt.AddedAt)
                .Select(pt => pt.Track!.CoverImageUrl!)
                .Take(4)
                .ToListAsync(ct);

            var covers = new List<string>();
            foreach (var key in coverKeys)
            {
                if (!string.IsNullOrWhiteSpace(key))
                {
                    try
                    {
                        var presignedUrl = await _storageService.GenerateDownloadUrlAsync(key, ct);
                        covers.Add(presignedUrl);
                    }
                    catch
                    {
                        // якщо не вдалос€ згенерувати посиланн€ - пропускаЇмо
                    }
                }
            }

            var dto = new PlaylistDetailResponseDto
            {
                Id = playlist.Id,
                Name = playlist.Name,
                CreatedAt = playlist.CreatedAt,
                CoverImageUrls = covers,
                TrackCount = trackDtos.Count,
                Tracks = trackDtos,
            };

            return Ok(dto);
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