namespace Loca.API.Interfaces;

public interface IStorageService
{
    Task<(string Url, string Key)> GenerateUploadUrlAsync(string fileName, string contentType, CancellationToken ct = default);
    Task<string> GenerateDownloadUrlAsync(string key, CancellationToken ct = default);
    Task<(Stream Stream, string? ContentType, long? ContentLength)> GetObjectStreamAsync(string key, CancellationToken ct = default);
    Task<bool> ObjectExistsAsync(string key, CancellationToken ct = default);
    Task<IReadOnlyList<string>> ListObjectKeysAsync(CancellationToken ct = default);
    Task DeleteObjectAsync(string key, CancellationToken ct = default);
}
