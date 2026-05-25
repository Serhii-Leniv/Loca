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

public sealed class MemoriesControllerTests
{
    private readonly Mock<IStorageService> _mockStorage;

    public MemoriesControllerTests()
    {
        _mockStorage = new Mock<IStorageService>();
        _mockStorage.Setup(x => x.GenerateDownloadUrlAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((string key, CancellationToken _) => $"http://minio:9000/test-bucket/{key}?signature=abc");
    }

    [Fact]
    public async Task GetCarousel_ShouldReturnDownloadUrlForCoverImage()
    {
        await using var db = CreateDbContext();
        var userId = Guid.NewGuid();
        var trackId = Guid.NewGuid();
        var user = new User { Id = userId, Email = "user@example.com", Username = "User", PasswordHash = "hash" };
        var track = new Track
        {
            Id = trackId,
            Title = "Track",
            ArtistName = "Artist",
            Duration = 180,
            LocationName = "Kyiv",
            StorageFileKey = "tracks/test.mp3",
            CoverImageUrl = "covers/test.jpg",
        };
        var memory = new Memory
        {
            TrackId = trackId,
            UserId = userId,
            Content = "Great song",
            CreatedAt = DateTime.UtcNow,
        };

        db.Users.Add(user);
        db.Tracks.Add(track);
        db.Memories.Add(memory);
        await db.SaveChangesAsync();

        var controller = CreateController(db);

        var result = await controller.GetCarousel();

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        var items = ok.Value.Should().BeAssignableTo<IReadOnlyList<MemoryCarouselItemDto>>().Subject;

        items.Should().ContainSingle();
        items.Single().CoverImageUrl.Should().Be("http://minio:9000/test-bucket/covers/test.jpg?signature=abc");
    }

    private MemoriesController CreateController(ApplicationDbContext db) => new(db, _mockStorage.Object);

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }
}