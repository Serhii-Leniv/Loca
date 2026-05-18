using FluentAssertions;
using Loca.API.Controllers;
using Loca.API.Data;
using Loca.API.DTOs;
using Loca.API.Interfaces;
using Loca.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Loca.API.Tests.Controllers;

public sealed class AlbumsControllerTests
{
    private readonly Mock<IStorageService> _mockStorage;

    public AlbumsControllerTests()
    {
        _mockStorage = new Mock<IStorageService>();
        _mockStorage.Setup(x => x.GenerateDownloadUrlAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("http://minio:9000/test-bucket/object?signature=abc");
    }

    [Fact]
    public async Task GetAll_ShouldIncludeTotalDurationSeconds()
    {
        await using var db = CreateDbContext();
        db.Tracks.AddRange(
            new Track { Title = "One", ArtistName = "Artist", AlbumName = "Album", Duration = 11, StorageFileKey = "tracks/1.mp3", CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new Track { Title = "Two", ArtistName = "Artist", AlbumName = "Album", Duration = 13, StorageFileKey = "tracks/2.mp3", CreatedAt = DateTime.UtcNow.AddDays(-1) });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        var result = await controller.GetAll();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var albums = ok.Value.Should().BeAssignableTo<IReadOnlyList<AlbumResponseDto>>().Subject;

        albums.Should().ContainSingle();
        albums.Single().TotalDurationSeconds.Should().Be(24);
        albums.Single().TrackCount.Should().Be(2);
    }

    [Fact]
    public async Task GetAlbumTracks_ShouldIncludeTotalDurationSeconds()
    {
        await using var db = CreateDbContext();
        var albumId = Guid.NewGuid();
        db.Tracks.AddRange(
            new Track { Title = "One", ArtistName = "Artist", AlbumName = "Album", Duration = 11, StorageFileKey = "tracks/1.mp3", AlbumId = albumId, CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new Track { Title = "Two", ArtistName = "Artist", AlbumName = "Album", Duration = 13, StorageFileKey = "tracks/2.mp3", AlbumId = albumId, CreatedAt = DateTime.UtcNow.AddDays(-1) });
        await db.SaveChangesAsync();

        var controller = CreateController(db);
        var result = await controller.GetAlbumTracks("Album");

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var album = ok.Value.Should().BeOfType<AlbumWithTracksResponseDto>().Subject;

        album.TotalDurationSeconds.Should().Be(24);
        album.Tracks.Should().HaveCount(2);
    }

    private AlbumsController CreateController(ApplicationDbContext db) => new(db, _mockStorage.Object);

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }
}