using Loca.API.Data;
using Loca.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public sealed class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public UsersController(ApplicationDbContext db)
    {
        _db = db;
    }

    private Guid? GetUserId()
    {
        var value = User.FindFirst("userId")?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMe(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var user = await _db.Users
            .AsNoTracking()
            .Include(u => u.LikedTracks)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
            return Unauthorized();

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            LikedTracksCount = user.LikedTracks.Count,
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(
        [FromBody] UpdateProfileRequestDto request,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        var email = request.Email.Trim().ToLowerInvariant();

        var emailTaken = await _db.Users.AnyAsync(u => u.Email == email && u.Id != userId, ct);
        if (emailTaken)
            return Conflict(new { message = "Email already taken." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null)
            return Unauthorized();

        user.Email = email;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequestDto request,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "CurrentPassword and NewPassword are required." });

        if (request.NewPassword.Length < 6)
            return BadRequest(new { message = "New password must be at least 6 characters." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null)
            return Unauthorized();

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpGet("me/liked-tracks")]
    public async Task<ActionResult<IReadOnlyList<TrackResponseDto>>> GetLikedTracks(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var user = await _db.Users
            .AsNoTracking()
            .Include(u => u.LikedTracks)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
            return Unauthorized();

        var dtos = user.LikedTracks
            .OrderByDescending(t => t.CreatedAt)
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
            .ToList();

        return Ok(dtos);
    }
}
