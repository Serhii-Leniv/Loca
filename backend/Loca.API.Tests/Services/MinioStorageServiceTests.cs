using Amazon.S3;
using Amazon.S3.Model;
using FluentAssertions;
using Loca.API.Services;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Loca.API.Tests.Services;

public sealed class MinioStorageServiceTests
{
    private readonly Mock<IAmazonS3> _mockS3;
    private readonly IConfiguration _configuration;

    public MinioStorageServiceTests()
    {
        _mockS3 = new Mock<IAmazonS3>();

        var configValues = new Dictionary<string, string?>
        {
            ["MinIO:BucketName"] = "test-bucket",
            ["MinIO:UploadUrlTtlMinutes"] = "15",
            ["MinIO:DownloadUrlTtlMinutes"] = "60",
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();
    }

    [Fact]
    public void Constructor_ShouldThrow_WhenBucketNameMissing()
    {
        var emptyConfig = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var action = () => new MinioStorageService(_mockS3.Object, emptyConfig);

        action.Should().Throw<InvalidOperationException>()
            .WithMessage("*BucketName*");
    }

    [Fact]
    public void Constructor_ShouldUseDefaultTtl_WhenNotConfigured()
    {
        var minimalConfig = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["MinIO:BucketName"] = "test-bucket",
            })
            .Build();

        var action = () => new MinioStorageService(_mockS3.Object, minimalConfig);

        action.Should().NotThrow();
    }

    [Fact]
    public async Task GenerateUploadUrlAsync_ShouldReturnUrlContainingKey()
    {
        var service = CreateService();

        var url = await service.GenerateUploadUrlAsync("track.mp3", "audio/mpeg");

        url.Should().NotBeNull();
        url.Should().Contain("test-bucket");
        url.Should().Contain("tracks/");
        url.Should().Contain("track.mp3");
    }

    [Fact]
    public async Task GenerateUploadUrlAsync_ShouldSanitizeFileName()
    {
        var service = CreateService();

        var url = await service.GenerateUploadUrlAsync("my track (1).mp3", "audio/mpeg");

        url.Should().Contain("my_track__1_.mp3");
    }

    [Fact]
    public async Task GenerateDownloadUrlAsync_ShouldReturnUrlForKey()
    {
        var service = CreateService();
        var key = "tracks/some-guid_track.mp3";

        var url = await service.GenerateDownloadUrlAsync(key);

        url.Should().NotBeNull();
        url.Should().Contain(key);
    }

    [Fact]
    public async Task ObjectExistsAsync_ShouldReturnTrue_WhenObjectFound()
    {
        _mockS3.Setup(x => x.GetObjectMetadataAsync(
                It.IsAny<GetObjectMetadataRequest>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetObjectMetadataResponse());

        var service = CreateService();

        var result = await service.ObjectExistsAsync("tracks/existing.mp3");

        result.Should().BeTrue();
    }

    [Fact]
    public async Task ObjectExistsAsync_ShouldReturnFalse_WhenNotFound()
    {
        _mockS3.Setup(x => x.GetObjectMetadataAsync(
                It.IsAny<GetObjectMetadataRequest>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new AmazonS3Exception("Not Found")
            {
                StatusCode = System.Net.HttpStatusCode.NotFound,
            });

        var service = CreateService();

        var result = await service.ObjectExistsAsync("tracks/missing.mp3");

        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteObjectAsync_ShouldCallS3Delete()
    {
        _mockS3.Setup(x => x.DeleteObjectAsync(
                It.IsAny<DeleteObjectRequest>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DeleteObjectResponse());

        var service = CreateService();

        await service.DeleteObjectAsync("tracks/to-delete.mp3");

        _mockS3.Verify(x => x.DeleteObjectAsync(
            It.Is<DeleteObjectRequest>(r => r.Key == "tracks/to-delete.mp3"),
            It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private MinioStorageService CreateService() => new(_mockS3.Object, _configuration);
}
