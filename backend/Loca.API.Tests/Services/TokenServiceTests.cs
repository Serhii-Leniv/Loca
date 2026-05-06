using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FluentAssertions;
using Loca.API.Models;
using Loca.API.Services;
using Microsoft.Extensions.Configuration;

namespace Loca.API.Tests.Services;

public sealed class TokenServiceTests
{
    [Fact]
    public void GenerateToken_ShouldThrow_WhenRequiredConfigurationIsMissing()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();
        var sut = new TokenService(configuration);

        var action = () => sut.GenerateToken(CreateUser());

        action.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void GenerateToken_ShouldIncludeExpectedClaims_WhenConfigurationIsValid()
    {
        var configValues = new Dictionary<string, string?>
        {
            ["Jwt:Issuer"] = "loca-tests",
            ["Jwt:Audience"] = "loca-clients",
            ["Jwt:SecretKey"] = "a_very_long_test_secret_key_123456789",
            ["Jwt:ExpirationMinutes"] = "120",
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();
        var sut = new TokenService(configuration);
        var user = CreateUser();

        var token = sut.GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == user.Id.ToString());
        jwt.Claims.Should().Contain(c => c.Type == ClaimTypes.NameIdentifier && c.Value == user.Id.ToString());
        jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Email && c.Value == user.Email);
        jwt.Claims.Should().Contain(c => c.Type == "name" && c.Value == user.Username);
    }

    private static User CreateUser() => new()
    {
        Id = Guid.NewGuid(),
        Email = "user@example.com",
        Username = "User",
        PasswordHash = "hash",
    };
}
