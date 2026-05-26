using Loca.API.Data;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/moderation")]
[Authorize(Roles = "Moderator")]
public sealed class ModerationController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IStorageService _storageService;

    public ModerationController(ApplicationDbContext db, IStorageService storageService)
    {
        _db = db;
        _storageService = storageService;
    }

    [HttpGet("tracks/pending")]
    public async Task<IActionResult> GetPendingTracks(CancellationToken ct = default)
    {
        var pendingTracks = await _db.Tracks
            .AsNoTracking()
            .Where(t => t.Status == TrackStatus.Pending)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync(ct);

        var result = new List<object>();
        foreach (var track in pendingTracks)
        {
            string? streamUrl = null;
            try
            {
                streamUrl = await _storageService.GenerateDownloadUrlAsync(track.StorageFileKey, ct);
            }
            catch
            {
            }

            result.Add(new
            {
                track.Id,
                track.Title,
                track.ArtistName,
                track.CreatedAt,
                StreamUrl = streamUrl
            });
        }

        return Ok(result);
    }

    [HttpPost("tracks/{id:guid}/approve")]
    public async Task<IActionResult> ApproveTrack(Guid id, CancellationToken ct = default)
    {
        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == id, ct);

        if (track is null)
            return NotFound(new { message = "Track not found." });

        if (track.Status == TrackStatus.Approved)
            return BadRequest(new { message = "Track is already approved." });

        track.Status = TrackStatus.Approved;
        await _db.SaveChangesAsync(ct);

        return Ok(new { message = "Track approved successfully!" });
    }

    [HttpPost("tracks/{id:guid}/reject")]
    public async Task<IActionResult> RejectTrack(Guid id, CancellationToken ct = default)
    {
        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == id, ct);

        if (track is null)
            return NotFound(new { message = "Track not found." });

        if (!string.IsNullOrWhiteSpace(track.StorageFileKey))
        {
            try
            {
                await _storageService.DeleteObjectAsync(track.StorageFileKey, ct);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete file from storage: {ex.Message}");
            }
        }

        _db.Tracks.Remove(track);
        await _db.SaveChangesAsync(ct);

        return Ok(new { message = "Track rejected and deleted successfully." });
    }
}