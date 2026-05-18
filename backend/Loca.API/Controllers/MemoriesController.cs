using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Models;

namespace Loca.API.Controllers;

[ApiController]
[Route("api")]
public class MemoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MemoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("tracks/{trackId:guid}/memories")]
    [Authorize]
    public async Task<IActionResult> CreateMemory([FromRoute] Guid trackId, [FromBody] CreateMemoryRequestDto req)
    {
        var userIdClaim = HttpContext.User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Forbid();
        }

        var trackExists = await _db.Tracks.AnyAsync(t => t.Id == trackId);
        if (!trackExists)
        {
            return NotFound();
        }

        var memory = new Memory
        {
            Id = Guid.NewGuid(),
            TrackId = trackId,
            UserId = userId,
            Content = req.Content ?? string.Empty,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Memories.Add(memory);
        await _db.SaveChangesAsync();

        var username = await _db.Users.Where(u => u.Id == userId).Select(u => u.Username).FirstOrDefaultAsync() ?? string.Empty;

        var dto = new MemoryResponseDto
        {
            Id = memory.Id,
            TrackId = memory.TrackId,
            UserId = memory.UserId,
            Username = username,
            Content = memory.Content,
            CreatedAt = memory.CreatedAt,
        };

        return CreatedAtAction(nameof(GetRandomMemoryForTrack), new { trackId = trackId }, dto);
    }

    [HttpGet("tracks/{trackId:guid}/memories/random")]
    public async Task<IActionResult> GetRandomMemoryForTrack([FromRoute] Guid trackId)
    {
        var query = _db.Memories.Where(m => m.TrackId == trackId);
        var count = await query.CountAsync();
        if (count == 0)
        {
            return NoContent();
        }

        var idx = new Random().Next(count);
        var memory = await query.Skip(idx).FirstOrDefaultAsync();

        if (memory == null)
        {
            return NoContent();
        }

        var username = await _db.Users.Where(u => u.Id == memory.UserId).Select(u => u.Username).FirstOrDefaultAsync() ?? string.Empty;

        var dto = new MemoryResponseDto
        {
            Id = memory.Id,
            TrackId = memory.TrackId,
            UserId = memory.UserId,
            Username = username,
            Content = memory.Content,
            CreatedAt = memory.CreatedAt,
        };

        return Ok(dto);
    }

    [HttpGet("tracks/{trackId:guid}/memories/mine")]
    [Authorize]
    public async Task<IActionResult> GetMyMemoryForTrack([FromRoute] Guid trackId)
    {
        var userIdClaim = HttpContext.User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Forbid();
        }

        var memory = await _db.Memories.FirstOrDefaultAsync(m => m.TrackId == trackId && m.UserId == userId);
        if (memory == null) return NoContent();

        var username = await _db.Users.Where(u => u.Id == memory.UserId).Select(u => u.Username).FirstOrDefaultAsync() ?? string.Empty;

        var dto = new MemoryResponseDto
        {
            Id = memory.Id,
            TrackId = memory.TrackId,
            UserId = memory.UserId,
            Username = username,
            Content = memory.Content,
            CreatedAt = memory.CreatedAt,
        };

        return Ok(dto);
    }

    [HttpGet("memories/carousel")]
    public async Task<IActionResult> GetCarousel([FromQuery] int limit = 20)
    {
        // Get distinct track ids that have memories
        var trackIds = await _db.Memories.Select(m => m.TrackId).Distinct().ToListAsync();
        if (trackIds.Count == 0)
        {
            return Ok(new List<MemoryCarouselItemDto>());
        }

        // Shuffle track ids and take up to limit
        var rng = new Random();
        var shuffled = trackIds.OrderBy(_ => rng.Next()).Take(limit).ToList();

        var result = new List<MemoryCarouselItemDto>();

        foreach (var tid in shuffled)
        {
            var q = _db.Memories.Where(m => m.TrackId == tid).Include(m => m.Track).Include(m => m.User);
            var c = await q.CountAsync();
            if (c == 0) continue;
            var idx = rng.Next(c);
            var memory = await q.Skip(idx).FirstOrDefaultAsync();
            if (memory == null || memory.Track == null) continue;

            result.Add(new MemoryCarouselItemDto
            {
                TrackId = memory.TrackId,
                Title = memory.Track.Title,
                ArtistName = memory.Track.ArtistName,
                CoverImageUrl = memory.Track.CoverImageUrl,
                Username = memory.User?.Username ?? string.Empty,
                MemoryId = memory.Id,
                MemoryContent = memory.Content,
                CreatedAt = memory.CreatedAt,
            });
        }

        return Ok(result);
    }

    [HttpGet("tracks/{trackId:guid}/memories")]
    public async Task<IActionResult> GetAllMemoriesForTrack([FromRoute] Guid trackId)
    {
        var memories = await _db.Memories
            .Where(m => m.TrackId == trackId)
            .Include(m => m.User)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new MemoryResponseDto
            {
                Id = m.Id,
                TrackId = m.TrackId,
                UserId = m.UserId,
                Username = m.User != null ? m.User.Username ?? string.Empty : string.Empty,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
            })
            .ToListAsync();

        return Ok(memories);
    }
}

public class CreateMemoryRequestDto
{
    public string? Content { get; set; }
}
