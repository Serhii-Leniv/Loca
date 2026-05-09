using FluentAssertions;
using Loca.API.Controllers;
using Loca.API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Loca.API.Tests.Controllers;

public sealed class StorageControllerTests
{
    private readonly Mock<IStorageService> _mockStorage;
    private readonly StorageController _controller;

    public StorageControllerTests()
    {
        _mockStorage = new Mock<IStorageService>();
        _controller = new StorageController(_mockStorage.Object);
    }

    [Fact]
    public async Task GenerateUploadUrl_ShouldReturnBadRequest_WhenFileNameMissing()
    {
        var result = await _controller.GenerateUploadUrl("", "audio/mpeg");

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GenerateUploadUrl_ShouldReturnBadRequest_WhenContentTypeMissing()
    {
        var result = await _controller.GenerateUploadUrl("track.mp3", "");

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Theory]
    [InlineData("audio/mpeg")]
    [InlineData("audio/wav")]
    [InlineData("audio/x-wav")]
    [InlineData("audio/x-m4a")]
    [InlineData("audio/mp4")]
    [InlineData("audio/aac")]
    [InlineData("audio/flac")]
    [InlineData("audio/ogg")]
    [InlineData("audio/webm")]
    public async Task GenerateUploadUrl_ShouldAccept_WhenContentTypeAllowed(string contentType)
    {
        _mockStorage.Setup(x => x.GenerateUploadUrlAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync("http://minio:9000/test-bucket/tracks/key?signature=abc");

        var result = await _controller.GenerateUploadUrl("track.mp3", contentType);

        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GenerateUploadUrl_ShouldReturnBadRequest_WhenContentTypeNotAllowed()
    {
        var result = await _controller.GenerateUploadUrl("track.exe", "application/octet-stream");

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GenerateUploadUrl_ShouldReturnUploadUrlAndKey()
    {
        var uploadUrl = "http://minio:9000/test-bucket/tracks/abc123_track.mp3?X-Amz-Signature=xyz";
        _mockStorage.Setup(x => x.GenerateUploadUrlAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(uploadUrl);

        var result = await _controller.GenerateUploadUrl("track.mp3", "audio/mpeg");

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var response = ok.Value.Should().BeAssignableTo<UploadUrlResponseDto>().Subject;
        response.UploadUrl.Should().Be(uploadUrl);
        response.Key.Should().Be("abc123_track.mp3");
    }

    [Fact]
    public async Task GenerateDownloadUrl_ShouldReturnBadRequest_WhenKeyMissing()
    {
        var result = await _controller.GenerateDownloadUrl("");

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GenerateDownloadUrl_ShouldReturnNotFound_WhenObjectDoesNotExist()
    {
        _mockStorage.Setup(x => x.ObjectExistsAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var result = await _controller.GenerateDownloadUrl("tracks/missing.mp3");

        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GenerateDownloadUrl_ShouldReturnUrl_WhenObjectExists()
    {
        var downloadUrl = "http://minio:9000/test-bucket/tracks/key?X-Amz-Signature=xyz";
        _mockStorage.Setup(x => x.ObjectExistsAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _mockStorage.Setup(x => x.GenerateDownloadUrlAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(downloadUrl);

        var result = await _controller.GenerateDownloadUrl("tracks/existing.mp3");

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var response = ok.Value.Should().BeAssignableTo<DownloadUrlResponseDto>().Subject;
        response.DownloadUrl.Should().Be(downloadUrl);
    }

    [Fact]
    public async Task DeleteObject_ShouldReturnNoContent()
    {
        _mockStorage.Setup(x => x.DeleteObjectAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var result = await _controller.DeleteObject("tracks/to-delete.mp3");

        result.Should().BeOfType<NoContentResult>();
    }
}
