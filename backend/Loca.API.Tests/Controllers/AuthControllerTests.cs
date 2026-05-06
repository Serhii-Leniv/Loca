using FluentAssertions;
using Loca.API.Controllers;
using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loca.API.Tests.Controllers;

public sealed class AuthControllerTests
{
    [Fact]
    public async Task Register_ShouldCreateUserAndReturnToken()
    {
        await using var db = CreateDbContext();
        var passwordHasher = new PasswordHasher<User>();
        var controller = new AuthController(db, new FakeTokenService(), passwordHasher);

        var request = new UserRegisterRequestDto
        {
            Email = "  USER@Example.com ",
            Name = "  Alice  ",
            Password = "Password123!",
        };

        var result = await controller.Register(request, CancellationToken.None);

        var created = result.Should().BeOfType<CreatedResult>().Subject;
        ExtractToken(created.Value).Should().Be("test-token");
        created.StatusCode.Should().Be(201);

        var user = await db.Users.SingleAsync();
        user.Email.Should().Be("user@example.com");
        user.Username.Should().Be("Alice");
        user.PasswordHash.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenEmailAlreadyExists()
    {
        await using var db = CreateDbContext();
        db.Users.Add(new User
        {
            Email = "user@example.com",
            Username = "Existing",
            PasswordHash = "hash",
        });
        await db.SaveChangesAsync();

        var controller = new AuthController(db, new FakeTokenService(), new PasswordHasher<User>());
        var request = new UserRegisterRequestDto
        {
            Email = " USER@EXAMPLE.COM ",
            Name = "Another",
            Password = "Password123!",
        };

        var result = await controller.Register(request, CancellationToken.None);

        result.Should().BeOfType<BadRequestObjectResult>();
        db.Users.Should().HaveCount(1);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenUserDoesNotExist()
    {
        await using var db = CreateDbContext();
        var controller = new AuthController(db, new FakeTokenService(), new PasswordHasher<User>());

        var request = new UserLoginRequestDto
        {
            Email = "missing@example.com",
            Password = "Password123!",
        };

        var result = await controller.Login(request, CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenPasswordIsInvalid()
    {
        await using var db = CreateDbContext();
        var passwordHasher = new PasswordHasher<User>();
        var user = new User
        {
            Email = "user@example.com",
            Username = "User",
        };
        user.PasswordHash = passwordHasher.HashPassword(user, "CorrectPassword123!");
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = new AuthController(db, new FakeTokenService(), passwordHasher);
        var request = new UserLoginRequestDto
        {
            Email = " user@example.com ",
            Password = "WrongPassword123!",
        };

        var result = await controller.Login(request, CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task Login_ShouldReturnToken_WhenCredentialsAreValid()
    {
        await using var db = CreateDbContext();
        var passwordHasher = new PasswordHasher<User>();
        var user = new User
        {
            Email = "user@example.com",
            Username = "User",
        };
        user.PasswordHash = passwordHasher.HashPassword(user, "Password123!");
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = new AuthController(db, new FakeTokenService(), passwordHasher);
        var request = new UserLoginRequestDto
        {
            Email = " USER@example.com ",
            Password = "Password123!",
        };

        var result = await controller.Login(request, CancellationToken.None);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ExtractToken(ok.Value).Should().Be("test-token");
    }

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static string? ExtractToken(object? payload)
        => payload?.GetType().GetProperty("token")?.GetValue(payload)?.ToString();

    private sealed class FakeTokenService : ITokenService
    {
        public string GenerateToken(User user) => "test-token";
    }
}
