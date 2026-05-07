using System.Security.Claims;
using FluentAssertions;
using Loca.API.Controllers;
using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Loca.API.Tests.Controllers;

public sealed class TracksControllerTests
{
    private readonly Mock<IStorageService> _mockStorage;

    public TracksControllerTests()
    {
        _mockStorage = new Mock<IStorageService>();
        _mockStorage.Setup(x => x.GenerateDownloadUrlAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync("http://minio:9000/test-bucket/tracks/test.mp3?signature=abc");
    }

    [Fact]
    public async Task GetNearby_ShouldReturnTracksOrderedByCreatedAtDescending()
    {
        await using var db = CreateDbContext();
        db.Tracks.AddRange(
            new Track { Title = "Older", ArtistName = "A", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/1.mp3", CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new Track { Title = "Newer", ArtistName = "B", Duration = 12, LocationName = "Kyiv", StorageFileKey = "tracks/2.mp3", CreatedAt = DateTime.UtcNow.AddDays(-1) });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        var result = await controller.GetNearby(null);

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var tracks = ok.Value.Should().BeAssignableTo<IReadOnlyList<TrackResponseDto>>().Subject;
        tracks.Select(t => t.Title).Should().ContainInOrder("Newer", "Older");
        tracks.Should().AllSatisfy(t => t.StreamUrl.Should().NotBeNull());
    }

    [Fact]
    public async Task GetNearby_ShouldFilterByTrimmedLocationName()
    {
        await using var db = CreateDbContext();
        db.Tracks.AddRange(
            new Track { Title = "One", ArtistName = "A", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/1.mp3" },
            new Track { Title = "Two", ArtistName = "B", Duration = 12, LocationName = "Lviv", StorageFileKey = "tracks/2.mp3" });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        var result = await controller.GetNearby(" Kyiv ");

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var tracks = ok.Value.Should().BeAssignableTo<IReadOnlyList<TrackResponseDto>>().Subject;
        tracks.Should().HaveCount(1);
        tracks.Single().Title.Should().Be("One");
    }

    [Fact]
    public async Task LikeTrack_ShouldReturnUnauthorized_WhenUserClaimIsInvalid()
    {
        await using var db = CreateDbContext();
        var controller = CreateController(db);
        controller.ControllerContext = BuildControllerContext("not-a-guid");

        var result = await controller.LikeTrack(Guid.NewGuid());

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public async Task LikeTrack_ShouldReturnNotFound_WhenTrackDoesNotExist()
    {
        await using var db = CreateDbContext();
        var user = new User { Email = "user@example.com", Username = "User", PasswordHash = "hash" };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        controller.ControllerContext = BuildControllerContext(user.Id.ToString());

        var result = await controller.LikeTrack(Guid.NewGuid());

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task LikeTrack_ShouldBeIdempotent_WhenCalledTwice()
    {
        await using var db = CreateDbContext();
        var user = new User { Email = "user@example.com", Username = "User", PasswordHash = "hash" };
        var track = new Track { Title = "Track", ArtistName = "Artist", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/test.mp3" };
        db.Users.Add(user);
        db.Tracks.Add(track);
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        controller.ControllerContext = BuildControllerContext(user.Id.ToString());

        var first = await controller.LikeTrack(track.Id);
        var second = await controller.LikeTrack(track.Id);

        first.Should().BeOfType<OkResult>();
        second.Should().BeOfType<OkResult>();

        var reloaded = await db.Users.Include(u => u.LikedTracks).SingleAsync(u => u.Id == user.Id);
        reloaded.LikedTracks.Should().HaveCount(1);
        reloaded.LikedTracks.Single().Id.Should().Be(track.Id);
    }

    private TracksController CreateController(ApplicationDbContext db) =>
        new(db, _mockStorage.Object);

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static ControllerContext BuildControllerContext(string? userIdClaim)
    {
        var claims = new List<Claim>();
        if (userIdClaim is not null)
        {
            claims.Add(new Claim("userId", userIdClaim));
        }

        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal,
            },
        };
    }
}
