using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Loca.API.Models;
using BCrypt.Net;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthController(
        ApplicationDbContext db,
        ITokenService tokenService,
        IPasswordHasher<User> passwordHasher)
    {
        _db = db;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] UserRegisterRequestDto request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await _db.Users.AnyAsync(u => u.Email == email, ct);
        if (exists)
            return BadRequest(new { message = "Email already exists." });

        var user = new User
        {
            Email = email,
            Username = string.IsNullOrWhiteSpace(request.Name) ? null : request.Name.Trim(),
            CreatedAt = DateTime.UtcNow,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        var token = _tokenService.GenerateToken(user);
        return Created(string.Empty, new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] UserLoginRequestDto request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
        if (user is null)
            return Unauthorized(new { message = "Invalid credentials." });

        if (!VerifyPassword(user, request.Password))
            return Unauthorized(new { message = "Invalid credentials." });

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token });
    }

    private bool VerifyPassword(User user, string password)
    {
        try
        {
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result != PasswordVerificationResult.Failed)
                return true;
        }
        catch (FormatException)
        {
        }

        return user.PasswordHash.StartsWith("$2", StringComparison.Ordinal) && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }
}
