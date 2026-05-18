using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/albums")]
public sealed class AlbumsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IStorageService _storageService;

    public AlbumsController(ApplicationDbContext db, IStorageService storageService)
    {
        _db = db;
        _storageService = storageService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AlbumResponseDto>>> GetAll(CancellationToken ct = default)
    {
        var tracks = await _db.Tracks
            .AsNoTracking()
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        var albums = tracks
            .GroupBy(track => NormalizeAlbumName(track.AlbumName), StringComparer.OrdinalIgnoreCase)
            .OrderByDescending(group => group.Max(track => track.CreatedAt));

        var results = new List<AlbumResponseDto>();

        foreach (var group in albums)
        {
            var albumName = group.Key;
            var first = group.OrderByDescending(t => t.CreatedAt).FirstOrDefault();
            var artistName = first?.ArtistName ?? string.Empty;
            string? coverUrl = null;

            var coverSource = group.FirstOrDefault(track => !string.IsNullOrWhiteSpace(track.CoverImageUrl))?.CoverImageUrl;
            if (!string.IsNullOrWhiteSpace(coverSource))
            {
                try
                {
                    coverUrl = await _storageService.GenerateDownloadUrlAsync(coverSource, ct);
                }
                catch
                {
                    coverUrl = null;
                }
            }

            results.Add(new AlbumResponseDto
            {
                Id = CreateAlbumId(albumName),
                Title = albumName,
                ArtistName = artistName,
                CoverImageUrl = coverUrl,
                CreatedAt = first?.CreatedAt ?? DateTime.UtcNow,
                TrackCount = group.Count(),
                TotalDurationSeconds = group.Sum(track => track.Duration),
            });
        }

        return Ok(results);
    }

    [HttpGet("{albumName}/tracks")]
    public async Task<ActionResult<AlbumWithTracksResponseDto>> GetAlbumTracks(string albumName, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(albumName))
            return BadRequest(new { message = "Album name is required." });

        var normalized = NormalizeAlbumName(Uri.UnescapeDataString(albumName));

        var tracks = await _db.Tracks
            .AsNoTracking()
            .ToListAsync(ct);

        tracks = tracks
            .Where(t => string.Equals(NormalizeAlbumName(t.AlbumName), normalized, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(t => t.CreatedAt)
            .ToList();

        if (!tracks.Any())
        {
            return NotFound();
        }

        HashSet<Guid>? likedIds = null;
        var userIdValue = HttpContext.User.FindFirst("userId")?.Value;
        if (Guid.TryParse(userIdValue, out var uid))
        {
            likedIds = await _db.UserLikedTracks.AsNoTracking()
                .Where(x => x.UserId == uid)
                .Select(x => x.TrackId)
                .ToHashSetAsync(ct);
        }

        var dtos = new List<TrackResponseDto>();
        foreach (var track in tracks)
        {
            string? streamUrl = null;
            string? coverImageUrl = null;

            if (!string.IsNullOrWhiteSpace(track.StorageFileKey))
            {
                try { streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct); } catch { streamUrl = null; }
            }

            if (!string.IsNullOrWhiteSpace(track.CoverImageUrl))
            {
                try { coverImageUrl = await _storageService.GenerateDownloadUrlAsync(track.CoverImageUrl, ct); } catch { coverImageUrl = null; }
            }

            dtos.Add(new TrackResponseDto
            {
                Id = track.Id,
                Title = track.Title,
                ArtistName = track.ArtistName,
                CoverImageUrl = coverImageUrl,
                Duration = track.Duration,
                LocationName = track.LocationName,
                AlbumId = track.AlbumId,
                StreamUrl = streamUrl,
                IsLiked = likedIds?.Contains(track.Id) ?? false,
            });
        }

        var first = tracks.First();
        var result = new AlbumWithTracksResponseDto
        {
            Id = CreateAlbumId(normalized),
            Title = first.AlbumName ?? "Unknown Album",
            ArtistName = first.ArtistName,
            CoverImageUrl = dtos.FirstOrDefault()?.CoverImageUrl,
            CreatedAt = first.CreatedAt,
            TotalDurationSeconds = tracks.Sum(track => track.Duration),
            Tracks = dtos,
        };

        return Ok(result);
    }

    [HttpGet("map-data")]
    public async Task<ActionResult<IReadOnlyList<ArtistMapEntryDto>>> GetMapData(CancellationToken ct = default)
    {
        // Завантажуємо всі треки з непорожньою локацією
        var tracks = await _db.Tracks
            .AsNoTracking()
            .Where(t => t.LocationName != null && t.LocationName != "")
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        var artistGroups = tracks.GroupBy(t => t.ArtistName, StringComparer.OrdinalIgnoreCase);
        var result = new List<ArtistMapEntryDto>();

        foreach (var artistGroup in artistGroups)
        {
            // Найпоширеніше місто для цього артиста
            var locationName = artistGroup
                .GroupBy(t => t.LocationName!)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();

            if (string.IsNullOrWhiteSpace(locationName)) continue;

            // Альбоми артиста (та сама логіка що в GetAll)
            var albumGroups = artistGroup
                .GroupBy(t => NormalizeAlbumName(t.AlbumName), StringComparer.OrdinalIgnoreCase);

            var albums = new List<AlbumMapDto>();
            foreach (var albumGroup in albumGroups)
            {
                var coverSource = albumGroup
                    .FirstOrDefault(t => !string.IsNullOrWhiteSpace(t.CoverImageUrl))?.CoverImageUrl;
                string? coverUrl = null;
                if (!string.IsNullOrWhiteSpace(coverSource))
                {
                    try { coverUrl = await _storageService.GenerateDownloadUrlAsync(coverSource, ct); }
                    catch { coverUrl = null; }
                }

                albums.Add(new AlbumMapDto
                {
                    Id            = CreateAlbumId(albumGroup.Key),
                    Title         = albumGroup.Key,
                    CoverImageUrl = coverUrl,
                    TrackCount    = albumGroup.Count(),
                });
            }

            result.Add(new ArtistMapEntryDto
            {
                ArtistName   = artistGroup.Key,
                LocationName = locationName,
                TrackCount   = artistGroup.Count(),
                Albums       = albums,
            });
        }

        return Ok(result);
    }

    private static string NormalizeAlbumName(string? albumName)
        => string.IsNullOrWhiteSpace(albumName) ? "Unknown Album" : albumName.Trim();

    private static Guid CreateAlbumId(string albumName)
    {
        var bytes = Encoding.UTF8.GetBytes(albumName);
        var hash = MD5.HashData(bytes);
        return new Guid(hash);
    }
}
