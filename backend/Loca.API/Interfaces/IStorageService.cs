namespace Loca.API.Interfaces;

public interface IStorageService
{
    Task<string> GenerateUploadUrlAsync(string fileName, string contentType, CancellationToken ct = default);
    Task<string> GenerateDownloadUrlAsync(string key, CancellationToken ct = default);
    Task<bool> ObjectExistsAsync(string key, CancellationToken ct = default);
    Task DeleteObjectAsync(string key, CancellationToken ct = default);
}
