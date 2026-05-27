using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TagLib;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/tracks")]
public sealed class TracksController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IStorageService _storageService;
    private const string SyncAlbumTitle = "Synced Tracks";
    private const string SyncAlbumArtist = "Loca Import";
    private const string SyncLocationName = "Synced";

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

        HashSet<Guid>? likedIds = null;
        var requestingUserId = GetRequestingUserId();
        if (requestingUserId.HasValue)
        {
            likedIds = await LoadLikedTrackIdsAsync(requestingUserId.Value, ct);
        }

        var dtos = new List<TrackResponseDto>();
        foreach (var track in tracks)
        {
            dtos.Add(await MapToDtoAsync(track, ct, likedIds?.Contains(track.Id) ?? false));
        }

        return Ok(dtos);
    }

    [Authorize]
    [HttpGet("feed")]
    public async Task<ActionResult<TrackFeedResponseDto>> GetFeed(
        [FromQuery] int limit = 10,
        [FromQuery] int skip = 0,
        CancellationToken ct = default)
    {
        var userId = GetRequestingUserId();
        if (userId is null)
            return Unauthorized();

        if (limit <= 0) limit = 10;
        if (limit > 50) limit = 50;
        if (skip < 0) skip = 0;

        var city = await _db.Users.AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => u.City)
            .FirstOrDefaultAsync(ct);

        var query = _db.Tracks.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(city))
        {
            var normalized = city.Trim().ToLower();
            query = query.Where(t => t.LocationName.ToLower() == normalized);
        }

        var total = await query.CountAsync(ct);

        var page = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip(skip)
            .Take(limit)
            .ToListAsync(ct);

        var likedIds = await LoadLikedTrackIdsAsync(userId.Value, ct);

        var dtos = new List<TrackResponseDto>(page.Count);
        foreach (var track in page)
            dtos.Add(await MapToDtoAsync(track, ct, likedIds.Contains(track.Id)));

        return Ok(new TrackFeedResponseDto
        {
            Tracks = dtos,
            City = city,
            HasMore = skip + page.Count < total,
        });
    }

    [HttpGet("legends/featured")]
    public async Task<ActionResult<IReadOnlyList<TrackResponseDto>>> GetFeaturedLegends(CancellationToken ct = default)
    {
        var tracks = await _db.Tracks
            .AsNoTracking()
            .Where(t => t.Legend != null && t.Legend != "")
            .OrderByDescending(t => t.CreatedAt)
            .Take(10)
            .ToListAsync(ct);

        var dtos = new List<TrackResponseDto>();
        foreach (var track in tracks)
        {
            dtos.Add(await MapToDtoAsync(track, ct, isLiked: false));
        }

        return Ok(dtos);
    }


    [Authorize]
    [HttpGet("liked")]
    public async Task<ActionResult<LikedTracksResponseDto>> GetLiked(CancellationToken ct = default)
    {
        var userIdValue = User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var tracks = await _db.UserLikedTracks
            .AsNoTracking()
            .Where(ult => ult.UserId == userId)
            .OrderByDescending(ult => ult.Track!.CreatedAt)
            .Select(ult => ult.Track!)
            .ToListAsync(ct);

        var dtos = new List<TrackResponseDto>();
        foreach (var track in tracks)
        {
            dtos.Add(await MapToDtoAsync(track, ct, isLiked: true));
        }

        return Ok(new LikedTracksResponseDto
        {
            Tracks = dtos,
            TotalDurationSeconds = tracks.Sum(track => track.Duration),
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TrackResponseDto>> GetById(Guid id, CancellationToken ct = default)
    {
        var track = await _db.Tracks
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id, ct);

        if (track is null)
            return NotFound();

        HashSet<Guid>? likedIds = null;
        var requestingUserId = GetRequestingUserId();
        if (requestingUserId.HasValue)
        {
            likedIds = await LoadLikedTrackIdsAsync(requestingUserId.Value, ct);
        }

        return Ok(await MapToDtoAsync(track, ct, likedIds?.Contains(track.Id) ?? false));
    }

    [HttpGet("random")]
    public async Task<ActionResult<TrackResponseDto>> GetRandom(CancellationToken ct = default)
    {
        var track = await _db.Tracks
            .AsNoTracking()
            .OrderBy(_ => EF.Functions.Random())
            .FirstOrDefaultAsync(ct);

        if (track is null)
        {
            return NotFound();
        }

        HashSet<Guid>? likedIds = null;
        var requestingUserId = GetRequestingUserId();
        if (requestingUserId.HasValue)
        {
            likedIds = await LoadLikedTrackIdsAsync(requestingUserId.Value, ct);
        }

        return Ok(await MapToDtoAsync(track, ct, likedIds?.Contains(track.Id) ?? false));
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

        return CreatedAtAction(nameof(GetById), new { id = track.Id }, await MapToDtoAsync(track, ct, isLiked: false));
    }

    [HttpPost("sync")]
    public async Task<ActionResult<TrackSyncResponseDto>> SyncFromStorage(CancellationToken ct = default)
    {
        var objectKeys = await _storageService.ListObjectKeysAsync(ct);
        var audioKeys = objectKeys
            .Where(IsMp3File)
            .OrderBy(key => key, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var existingTracks = await _db.Tracks
            .Where(track => audioKeys.Contains(track.StorageFileKey))
            .ToListAsync(ct);
        var existingTracksByKey = existingTracks.ToDictionary(track => track.StorageFileKey, StringComparer.OrdinalIgnoreCase);
        var imageKeysByBaseName = BuildImageLookup(objectKeys);
        var syncAlbum = await GetOrCreateSyncAlbumAsync(ct);

        var createdTracks = new List<TrackSyncResultDto>();
        var updatedTrackCount = 0;

        foreach (var audioKey in audioKeys)
        {
            if (existingTracksByKey.TryGetValue(audioKey, out var existingTrack))
            {
                var needsUpdate = false;
                var existingBaseName = Path.GetFileNameWithoutExtension(audioKey);
                var existingCoverImageKey = imageKeysByBaseName.TryGetValue(existingBaseName, out var existingImageKey)
                    ? existingImageKey
                    : null;

                if (string.IsNullOrWhiteSpace(existingTrack.ArtistName))
                {
                    var extractedArtistName = await ExtractArtistFromAudioAsync(audioKey, ct);
                    existingTrack.ArtistName = string.IsNullOrWhiteSpace(extractedArtistName) ? "Unknown Artist" : extractedArtistName;
                    needsUpdate = true;
                }

                if (string.IsNullOrWhiteSpace(existingTrack.Title))
                {
                    var extractedTitle = await ExtractTitleFromAudioAsync(audioKey, ct);
                    existingTrack.Title = string.IsNullOrWhiteSpace(extractedTitle) ? ParseTitleFromFilename(existingBaseName) : extractedTitle;
                    needsUpdate = true;
                }

                if (string.IsNullOrWhiteSpace(existingTrack.CoverImageUrl) && !string.IsNullOrWhiteSpace(existingCoverImageKey))
                {
                    existingTrack.CoverImageUrl = existingCoverImageKey;
                    needsUpdate = true;
                }

                if (string.IsNullOrWhiteSpace(existingTrack.AlbumName) ||
                    string.Equals(existingTrack.AlbumName, "Unknown Album", StringComparison.OrdinalIgnoreCase))
                {
                    existingTrack.AlbumName = await ResolveAlbumNameAsync(audioKey, existingTrack.ArtistName, existingCoverImageKey, ct);
                    needsUpdate = true;
                }

                if (existingTrack.Duration <= 0)
                {
                    existingTrack.Duration = await ExtractDurationFromAudioAsync(audioKey, ct);
                    needsUpdate = true;
                }

                if (needsUpdate)
                {
                    updatedTrackCount++;
                }

                continue;
            }

            var newBaseName = Path.GetFileNameWithoutExtension(audioKey);
            var newCoverImageKey = imageKeysByBaseName.TryGetValue(newBaseName, out var newImageKey)
                ? newImageKey
                : null;

            var artistName = await ExtractArtistFromAudioAsync(audioKey, ct);
            if (string.IsNullOrWhiteSpace(artistName))
            {
                artistName = "Unknown Artist";
            }

            var title = await ExtractTitleFromAudioAsync(audioKey, ct);
            if (string.IsNullOrWhiteSpace(title))
            {
                title = ParseTitleFromFilename(newBaseName);
            }

            var albumName = await ResolveAlbumNameAsync(audioKey, artistName, newCoverImageKey, ct);
            var duration = await ExtractDurationFromAudioAsync(audioKey, ct);

            var track = new Track
            {
                Id = Guid.NewGuid(),
                Title = title,
                ArtistName = artistName,
                StorageFileKey = audioKey,
                CoverImageUrl = newCoverImageKey,
                Duration = duration,
                LocationName = SyncLocationName,
                AlbumId = syncAlbum.Id,
                AlbumName = albumName,
            };

            _db.Tracks.Add(track);
            createdTracks.Add(new TrackSyncResultDto
            {
                Id = track.Id,
                Title = track.Title,
                ArtistName = track.ArtistName,
                StorageFileKey = track.StorageFileKey,
                CoverImageUrl = track.CoverImageUrl,
                AlbumId = track.AlbumId,
            });
        }

        if (createdTracks.Count > 0 || updatedTrackCount > 0)
        {
            await _db.SaveChangesAsync(ct);
        }

        var response = new TrackSyncResponseDto
        {
            AudioFilesScanned = audioKeys.Count,
            NewTracksCreated = createdTracks.Count,
            ExistingTracksUpdated = updatedTrackCount,
            ExistingTracksSkipped = audioKeys.Count - createdTracks.Count - updatedTrackCount,
            Tracks = createdTracks,
        };

        return Ok(response);
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
    public async Task<ActionResult<TrackLikeToggleResponseDto>> ToggleLike([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userIdValue = User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var trackExists = await _db.Tracks.AsNoTracking().AnyAsync(t => t.Id == id, ct);
        if (!trackExists)
            return NotFound();

        var link = await _db.UserLikedTracks.FindAsync(new object[] { userId, id }, ct);
        if (link is not null)
        {
            _db.UserLikedTracks.Remove(link);
            await _db.SaveChangesAsync(ct);
            return Ok(new TrackLikeToggleResponseDto { IsLiked = false });
        }

        _db.UserLikedTracks.Add(new UserLikedTrack
        {
            UserId = userId,
            TrackId = id,
        });
        await _db.SaveChangesAsync(ct);
        return Ok(new TrackLikeToggleResponseDto { IsLiked = true });
    }

    private async Task<TrackResponseDto> MapToDtoAsync(Track track, CancellationToken ct, bool isLiked = false)
    {
        string? streamUrl = null;
        string? coverImageUrl = null;

        if (!string.IsNullOrWhiteSpace(track.StorageFileKey))
        {
            try
            {
                streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct);
            }
            catch
            {
                streamUrl = null;
            }
        }

        if (!string.IsNullOrWhiteSpace(track.CoverImageUrl))
        {
            try
            {
                coverImageUrl = await _storageService.GenerateDownloadUrlAsync(track.CoverImageUrl, ct);
            }
            catch
            {
                coverImageUrl = null;
            }
        }

        return new TrackResponseDto
        {
            Id = track.Id,
            Title = track.Title,
            ArtistName = track.ArtistName,
            CoverImageUrl = coverImageUrl,
            Duration = track.Duration,
            LocationName = track.LocationName,
            AlbumId = track.AlbumId,
            StreamUrl = streamUrl,
            IsLiked = isLiked,
            Legend = track.Legend,
        };
    }

    private Guid? GetRequestingUserId()
    {
        var value = HttpContext?.User?.FindFirst("userId")?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
    }

    private async Task<HashSet<Guid>> LoadLikedTrackIdsAsync(Guid userId, CancellationToken ct) =>
        await _db.UserLikedTracks.AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => x.TrackId)
            .ToHashSetAsync(ct);

    private async Task<Album> GetOrCreateSyncAlbumAsync(CancellationToken ct)
    {
        var album = await _db.Albums.FirstOrDefaultAsync(a => a.Title == SyncAlbumTitle && a.ArtistName == SyncAlbumArtist, ct);
        if (album is not null)
        {
            return album;
        }

        album = new Album
        {
            Id = Guid.NewGuid(),
            Title = SyncAlbumTitle,
            ArtistName = SyncAlbumArtist,
            CoverImageUrl = null,
        };

        _db.Albums.Add(album);
        await _db.SaveChangesAsync(ct);
        return album;
    }

    private static Dictionary<string, string> BuildImageLookup(IEnumerable<string> keys)
    {
        var imageExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".bmp",
            ".avif",
        };

        return keys
            .Where(key => imageExtensions.Contains(Path.GetExtension(key)))
            .GroupBy(key => Path.GetFileNameWithoutExtension(key), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.OrderBy(key => key, StringComparer.OrdinalIgnoreCase).First(), StringComparer.OrdinalIgnoreCase);
    }

    private static bool IsMp3File(string key)
        => string.Equals(Path.GetExtension(key), ".mp3", StringComparison.OrdinalIgnoreCase);

    private async Task<string> ResolveAlbumNameAsync(string audioKey, string? artistName, string? coverImageKey, CancellationToken ct)
    {
        var extractedAlbumName = await ExtractAlbumFromAudioAsync(audioKey, ct);
        if (!string.IsNullOrWhiteSpace(extractedAlbumName))
        {
            return extractedAlbumName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(coverImageKey))
        {
            var coverImageBaseName = Path.GetFileNameWithoutExtension(coverImageKey);
            if (!string.IsNullOrWhiteSpace(coverImageBaseName))
            {
                return coverImageBaseName.Trim();
            }
        }

        var artistLabel = string.IsNullOrWhiteSpace(artistName) ? "Unknown" : artistName.Trim();
        return $"Unknown Album - {artistLabel}";
    }

    private async Task<string> ExtractArtistFromAudioAsync(string audioKey, CancellationToken ct)
    {
        try
        {
            var (stream, _, _) = await _storageService.GetObjectStreamAsync(audioKey, ct);
            
            if (stream == null || !stream.CanRead)
                return "Unknown Artist";

            try
            {
                // Read stream into memory for TagLib processing
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream, ct);
                    memoryStream.Position = 0;

                    // Create a TagLib file abstraction from the memory stream
                    var file = TagLib.File.Create(new StreamFileAbstraction(Path.GetFileName(audioKey), memoryStream, memoryStream));

                    if (file?.Tag == null)
                        return "Unknown Artist";

                    // Try to get the first performer
                    if (!string.IsNullOrWhiteSpace(file.Tag.FirstPerformer))
                        return file.Tag.FirstPerformer.Trim();

                    // Try to get all performers joined
                    if (file.Tag.Performers != null && file.Tag.Performers.Length > 0)
                    {
                        var artists = string.Join(", ", file.Tag.Performers
                            .Where(p => !string.IsNullOrWhiteSpace(p))
                            .Select(p => p.Trim()));

                        if (!string.IsNullOrWhiteSpace(artists))
                            return artists;
                    }

                    return "Unknown Artist";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting ID3 tags from {audioKey}: {ex.Message}");
                return "Unknown Artist";
            }
            finally
            {
                stream?.Dispose();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving audio file {audioKey}: {ex.Message}");
            return "Unknown Artist";
        }
    }

    private async Task<string> ExtractTitleFromAudioAsync(string audioKey, CancellationToken ct)
    {
        try
        {
            var (stream, _, _) = await _storageService.GetObjectStreamAsync(audioKey, ct);
            
            if (stream == null || !stream.CanRead)
                return string.Empty;

            try
            {
                // Read stream into memory for TagLib processing
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream, ct);
                    memoryStream.Position = 0;

                    // Create a TagLib file abstraction from the memory stream
                    var file = TagLib.File.Create(new StreamFileAbstraction(Path.GetFileName(audioKey), memoryStream, memoryStream));

                    if (file?.Tag == null)
                        return string.Empty;

                    // Try to get the title
                    if (!string.IsNullOrWhiteSpace(file.Tag.Title))
                        return file.Tag.Title.Trim();

                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting title from {audioKey}: {ex.Message}");
                return string.Empty;
            }
            finally
            {
                stream?.Dispose();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving audio file {audioKey}: {ex.Message}");
            return string.Empty;
        }
    }

    private async Task<string> ExtractAlbumFromAudioAsync(string audioKey, CancellationToken ct)
    {
        try
        {
            var (stream, _, _) = await _storageService.GetObjectStreamAsync(audioKey, ct);
            
            if (stream == null || !stream.CanRead)
                return string.Empty;

            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream, ct);
                    memoryStream.Position = 0;

                    var file = TagLib.File.Create(new StreamFileAbstraction(Path.GetFileName(audioKey), memoryStream, memoryStream));

                    if (file?.Tag == null)
                        return string.Empty;

                    if (!string.IsNullOrWhiteSpace(file.Tag.Album))
                        return file.Tag.Album.Trim();

                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting album from {audioKey}: {ex.Message}");
                return string.Empty;
            }
            finally
            {
                stream?.Dispose();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving audio file {audioKey}: {ex.Message}");
            return string.Empty;
        }
    }

    private async Task<int> ExtractDurationFromAudioAsync(string audioKey, CancellationToken ct)
    {
        try
        {
            var (stream, _, _) = await _storageService.GetObjectStreamAsync(audioKey, ct);

            if (stream == null || !stream.CanRead)
                return 0;

            try
            {
                using var memoryStream = new MemoryStream();
                await stream.CopyToAsync(memoryStream, ct);
                memoryStream.Position = 0;

                using var file = TagLib.File.Create(new StreamFileAbstraction(Path.GetFileName(audioKey), memoryStream, memoryStream));
                var durationSeconds = (int)Math.Round(file.Properties.Duration.TotalSeconds, MidpointRounding.AwayFromZero);
                return Math.Max(0, durationSeconds);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting duration from {audioKey}: {ex.Message}");
                return 0;
            }
            finally
            {
                stream?.Dispose();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving audio file {audioKey}: {ex.Message}");
            return 0;
        }
    }

    private static string ParseTitleFromFilename(string baseName)
    {
        if (string.IsNullOrWhiteSpace(baseName))
            return "Unknown Title";

        // Try to parse "Artist - Title" format
        const string separator = " - ";
        var separatorIndex = baseName.IndexOf(separator, StringComparison.OrdinalIgnoreCase);
        
        if (separatorIndex > 0)
        {
            var title = baseName.Substring(separatorIndex + separator.Length).Trim();
            if (!string.IsNullOrWhiteSpace(title))
                return title;
        }

        // Fallback to the entire base filename
        return baseName.Trim();
    }

    private class StreamFileAbstraction : TagLib.File.IFileAbstraction
    {
        private readonly string _name;
        private readonly Stream _stream;

        public string Name => _name;

        public StreamFileAbstraction(string name, Stream readStream, Stream writeStream)
        {
            _name = name;
            _stream = readStream;
        }

        public Stream ReadStream => _stream;

        public Stream WriteStream => _stream;

        public void CloseStream(Stream stream)
        {
            // No-op for streams we don't own
        }
    }

    private static string BuildStreamProxyUrl(string key)
        => $"/api/storage/stream?key={Uri.EscapeDataString(key)}";
}
