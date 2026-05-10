using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/albums")]
public sealed class AlbumsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AlbumsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AlbumResponseDto>>> GetAll(CancellationToken ct = default)
    {
        var albums = await _db.Albums
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AlbumResponseDto
            {
                Id = a.Id,
                Title = a.Title,
                ArtistName = a.ArtistName,
                CoverImageUrl = a.CoverImageUrl,
                CreatedAt = a.CreatedAt,
                TrackCount = a.Tracks.Count,
            })
            .ToListAsync(ct);

        return Ok(albums);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AlbumWithTracksResponseDto>> GetById(Guid id, CancellationToken ct = default)
    {
        var album = await _db.Albums
            .AsNoTracking()
            .Include(a => a.Tracks)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        if (album is null)
            return NotFound();

        return Ok(new AlbumWithTracksResponseDto
        {
            Id = album.Id,
            Title = album.Title,
            ArtistName = album.ArtistName,
            CoverImageUrl = album.CoverImageUrl,
            CreatedAt = album.CreatedAt,
            Tracks = album.Tracks
                .OrderBy(t => t.CreatedAt)
                .Select(t => new TrackResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    ArtistName = t.ArtistName,
                    CoverImageUrl = t.CoverImageUrl,
                    Duration = t.Duration,
                    LocationName = t.LocationName,
                    AlbumId = t.AlbumId,
                    StreamUrl = null,
                })
                .ToList(),
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AlbumResponseDto>> Create(
        [FromBody] CreateAlbumRequestDto request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.ArtistName))
            return BadRequest(new { message = "Title and ArtistName are required." });

        var album = new Album
        {
            Title = request.Title.Trim(),
            ArtistName = request.ArtistName.Trim(),
            CoverImageUrl = request.CoverImageUrl,
        };

        _db.Albums.Add(album);
        await _db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetById), new { id = album.Id }, new AlbumResponseDto
        {
            Id = album.Id,
            Title = album.Title,
            ArtistName = album.ArtistName,
            CoverImageUrl = album.CoverImageUrl,
            CreatedAt = album.CreatedAt,
            TrackCount = 0,
        });
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] CreateAlbumRequestDto request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.ArtistName))
            return BadRequest(new { message = "Title and ArtistName are required." });

        var album = await _db.Albums.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (album is null)
            return NotFound();

        album.Title = request.Title.Trim();
        album.ArtistName = request.ArtistName.Trim();
        album.CoverImageUrl = request.CoverImageUrl;

        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        var album = await _db.Albums.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (album is null)
            return NotFound();

        _db.Albums.Remove(album);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
