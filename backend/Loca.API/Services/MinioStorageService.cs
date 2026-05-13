using Amazon.S3;
using Amazon.S3.Model;
using Loca.API.Interfaces;

namespace Loca.API.Services;

public sealed class MinioStorageService : Loca.API.Interfaces.IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly TimeSpan _uploadTtl;
    private readonly TimeSpan _downloadTtl;

    public MinioStorageService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["MinIO:BucketName"]
                      ?? throw new InvalidOperationException("MinIO:BucketName is not configured.");
        _uploadTtl = TimeSpan.FromMinutes(GetConfigValue(configuration, "MinIO:UploadUrlTtlMinutes", 15));
        _downloadTtl = TimeSpan.FromMinutes(GetConfigValue(configuration, "MinIO:DownloadUrlTtlMinutes", 60));
    }

    public async Task<string> GenerateUploadUrlAsync(string fileName, string contentType, CancellationToken ct = default)
    {
        var key = $"tracks/{Guid.NewGuid():N}_{SanitizeFileName(fileName)}";

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Verb = HttpVerb.PUT,
            Protocol = Amazon.S3.Protocol.HTTP,
            Expires = DateTime.UtcNow.Add(_uploadTtl),
            ContentType = contentType,
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public async Task<string> GenerateDownloadUrlAsync(string key, CancellationToken ct = default)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Verb = HttpVerb.GET,
            Protocol = Amazon.S3.Protocol.HTTP,
            Expires = DateTime.UtcNow.Add(_downloadTtl),
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public async Task<IReadOnlyList<string>> ListObjectKeysAsync(CancellationToken ct = default)
    {
        var keys = new List<string>();
        string? continuationToken = null;

        do
        {
            var response = await _s3Client.ListObjectsV2Async(new ListObjectsV2Request
            {
                BucketName = _bucketName,
                ContinuationToken = continuationToken,
            }, ct);

            keys.AddRange(response.S3Objects
                .Where(obj => !string.IsNullOrWhiteSpace(obj.Key))
                .Select(obj => obj.Key));

            continuationToken = response.IsTruncated == true ? response.NextContinuationToken : null;
        }
        while (!string.IsNullOrWhiteSpace(continuationToken));

        return keys;
    }

    public Task<string> GeneratePresignedUrl(string storageFileKey)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = storageFileKey,
            Verb = HttpVerb.GET,
            Protocol = Amazon.S3.Protocol.HTTP,
            Expires = DateTime.UtcNow.Add(_downloadTtl),
        };

        return Task.FromResult(_s3Client.GetPreSignedURL(request));
    }

    public async Task<(Stream Stream, string? ContentType, long? ContentLength)> GetObjectStreamAsync(string key, CancellationToken ct = default)
    {
        var response = await _s3Client.GetObjectAsync(new GetObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
        }, ct);

        return (response.ResponseStream, response.Headers.ContentType, response.Headers.ContentLength);
    }

    public async Task<bool> ObjectExistsAsync(string key, CancellationToken ct = default)
    {
        try
        {
            await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
            {
                BucketName = _bucketName,
                Key = key,
            }, ct);
            return true;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode is System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }

    public async Task DeleteObjectAsync(string key, CancellationToken ct = default)
    {
        await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
        }, ct);
    }

    private static string SanitizeFileName(string fileName)
    {
        var invalidChars = Path.GetInvalidFileNameChars()
            .Concat(new[] { ' ', '(', ')', '[', ']', '{', '}', '#', '&', '?', '+', '=' })
            .ToHashSet();

        return new string(fileName.Select(c => invalidChars.Contains(c) ? '_' : c).ToArray());
    }

    private static int GetConfigValue(IConfiguration configuration, string key, int defaultValue)
    {
        var value = configuration[key];
        return !string.IsNullOrWhiteSpace(value) && int.TryParse(value, out var parsed) ? parsed : defaultValue;
    }
}
