namespace Loca.API.Services
{
    public interface IStorageService
    {
        Task<string> GeneratePresignedUrl(string storageFileKey);
    }
}
