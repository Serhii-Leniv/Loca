using Loca.API.DTOs;
using Loca.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Loca.API.Controllers;

[ApiController]
[Route("api/storage")]
[Authorize]
public sealed class StorageController : ControllerBase
{
    private readonly IStorageService _storageService;

    public StorageController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("upload-url")]
    public async Task<ActionResult<UploadUrlResponseDto>> GenerateUploadUrl(
        [FromQuery] string fileName,
        [FromQuery] string contentType,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return BadRequest(new { message = "fileName is required." });
        }

        if (string.IsNullOrWhiteSpace(contentType))
        {
            return BadRequest(new { message = "contentType is required." });
        }

        var allowedTypes = new[]
        {
            "audio/mpeg", "audio/wav", "audio/x-wav",
            "audio/x-m4a", "audio/mp4", "audio/aac",
            "audio/flac", "audio/ogg", "audio/webm",
        };

        if (!allowedTypes.Contains(contentType, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = $"Unsupported content type. Allowed: {string.Join(", ", allowedTypes)}." });
        }

        var uploadUrl = await _storageService.GenerateUploadUrlAsync(fileName, contentType, ct);
        var uri = new Uri(uploadUrl);
        var pathSegments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
        var key = pathSegments.Length switch
        {
            0 => string.Empty,
            1 => pathSegments[0],
            _ => string.Join('/', pathSegments[1..]),
        };

        return Ok(new UploadUrlResponseDto
        {
            UploadUrl = uploadUrl,
            Key = key,
        });
    }

    [HttpGet("download-url")]
    public async Task<ActionResult<DownloadUrlResponseDto>> GenerateDownloadUrl(
        [FromQuery] string key,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return BadRequest(new { message = "key is required." });
        }

        var exists = await _storageService.ObjectExistsAsync(key, ct);
        if (!exists)
        {
            return NotFound(new { message = "Object not found." });
        }

        var downloadUrl = await _storageService.GenerateDownloadUrlAsync(key, ct);
        return Ok(new DownloadUrlResponseDto { DownloadUrl = downloadUrl });
    }

    [AllowAnonymous]
    [HttpGet("stream")]
    public async Task<IActionResult> Stream(
        [FromQuery] string key,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return BadRequest(new { message = "key is required." });
        }

        var exists = await _storageService.ObjectExistsAsync(key, ct);
        if (!exists)
        {
            return NotFound(new { message = "Object not found." });
        }

        var (stream, contentType, contentLength) = await _storageService.GetObjectStreamAsync(key, ct);
        var result = File(stream, contentType ?? "audio/mpeg", enableRangeProcessing: true);
        if (contentLength.HasValue)
        {
            Response.ContentLength = contentLength.Value;
        }

        return result;
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> DeleteObject(
        [FromRoute] string key,
        CancellationToken ct = default)
    {
        await _storageService.DeleteObjectAsync(key, ct);
        return NoContent();
    }
}

