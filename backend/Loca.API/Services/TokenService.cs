using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace Loca.API.Services;

public sealed class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var secretKey = _configuration["Jwt:SecretKey"];
        var expirationMinutesValue = _configuration["Jwt:ExpirationMinutes"];

        if (string.IsNullOrWhiteSpace(issuer) ||
            string.IsNullOrWhiteSpace(audience) ||
            string.IsNullOrWhiteSpace(secretKey))
        {
            throw new InvalidOperationException("JWT configuration is missing (Jwt:Issuer, Jwt:Audience, Jwt:SecretKey).");
        }

        var expirationMinutes = 60;
        if (!string.IsNullOrWhiteSpace(expirationMinutesValue) &&
            int.TryParse(expirationMinutesValue, out var parsedMinutes) &&
            parsedMinutes > 0)
        {
            expirationMinutes = parsedMinutes;
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("name", user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

