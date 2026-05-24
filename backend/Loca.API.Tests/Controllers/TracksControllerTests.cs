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
            new Track { Title = "Older", ArtistName = "A", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/1.mp3", CreatedAt = DateTime.UtcNow.AddDays(-2), Status = Loca.API.Models.TrackStatus.Approved },
            new Track { Title = "Newer", ArtistName = "B", Duration = 12, LocationName = "Kyiv", StorageFileKey = "tracks/2.mp3", CreatedAt = DateTime.UtcNow.AddDays(-1), Status = Loca.API.Models.TrackStatus.Approved });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        var result = await controller.GetNearby(null, null);

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
            new Track { Title = "One", ArtistName = "A", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/1.mp3", Status = Loca.API.Models.TrackStatus.Approved },
            new Track { Title = "Two", ArtistName = "B", Duration = 12, LocationName = "Lviv", StorageFileKey = "tracks/2.mp3", Status = Loca.API.Models.TrackStatus.Approved });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        var result = await controller.GetNearby(" Kyiv ", null);

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var tracks = ok.Value.Should().BeAssignableTo<IReadOnlyList<TrackResponseDto>>().Subject;
        tracks.Should().HaveCount(1);
        tracks.Single().Title.Should().Be("One");
    }

    [Fact]
    public async Task GetLiked_ShouldReturnTracksAndTotalDuration()
    {
        await using var db = CreateDbContext();
        var user = new User { Email = "user@example.com", Username = "User", PasswordHash = "hash" };
        var firstTrack = new Track { Title = "One", ArtistName = "A", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/1.mp3", CreatedAt = DateTime.UtcNow.AddDays(-2), Status = Loca.API.Models.TrackStatus.Approved };
        var secondTrack = new Track { Title = "Two", ArtistName = "B", Duration = 12, LocationName = "Lviv", StorageFileKey = "tracks/2.mp3", CreatedAt = DateTime.UtcNow.AddDays(-1), Status = Loca.API.Models.TrackStatus.Approved };

        db.Users.Add(user);
        db.Tracks.AddRange(firstTrack, secondTrack);
        db.UserLikedTracks.AddRange(
            new UserLikedTrack { UserId = user.Id, TrackId = firstTrack.Id },
            new UserLikedTrack { UserId = user.Id, TrackId = secondTrack.Id });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        controller.ControllerContext = BuildControllerContext(user.Id.ToString());

        var result = await controller.GetLiked();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var payload = ok.Value.Should().BeOfType<LikedTracksResponseDto>().Subject;
        payload.Tracks.Should().HaveCount(2);
        payload.TotalDurationSeconds.Should().Be(22);
    }

    [Fact]
    public async Task LikeTrack_ShouldReturnUnauthorized_WhenUserClaimIsInvalid()
    {
        await using var db = CreateDbContext();
        var controller = CreateController(db);
        controller.ControllerContext = BuildControllerContext("not-a-guid");

        var result = await controller.ToggleLike(Guid.NewGuid());

        result.Result.Should().BeOfType<UnauthorizedResult>();
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

        var result = await controller.ToggleLike(Guid.NewGuid());

        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task ToggleLike_ShouldAddAndRemove_WhenCalledTwice()
    {
        await using var db = CreateDbContext();
        var user = new User { Email = "user@example.com", Username = "User", PasswordHash = "hash" };
        var track = new Track { Title = "Track", ArtistName = "Artist", Duration = 10, LocationName = "Kyiv", StorageFileKey = "tracks/test.mp3", Status = Loca.API.Models.TrackStatus.Approved };
        db.Users.Add(user);
        db.Tracks.Add(track);
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        controller.ControllerContext = BuildControllerContext(user.Id.ToString());

        var first = await controller.ToggleLike(track.Id);
        var second = await controller.ToggleLike(track.Id);

        var ok1 = first.Result.Should().BeOfType<OkObjectResult>().Subject;
        var ok2 = second.Result.Should().BeOfType<OkObjectResult>().Subject;

        ok1.Value.Should().BeOfType<TrackLikeToggleResponseDto>().Which.IsLiked.Should().BeTrue();
        ok2.Value.Should().BeOfType<TrackLikeToggleResponseDto>().Which.IsLiked.Should().BeFalse();

        var count = await db.UserLikedTracks.CountAsync(x => x.UserId == user.Id && x.TrackId == track.Id);
        count.Should().Be(0);
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
