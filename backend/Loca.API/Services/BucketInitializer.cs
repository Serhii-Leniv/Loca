using Amazon.S3;
using Amazon.S3.Model;

namespace Loca.API.Services;

public static class BucketInitializer
{
    public static async Task EnsureBucketExistsAsync(IServiceProvider serviceProvider)
    {
        await using var scope = serviceProvider.CreateAsyncScope();
        var s3Client = scope.ServiceProvider.GetRequiredService<IAmazonS3>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var bucketName = configuration["MinIO:BucketName"]
                         ?? throw new InvalidOperationException("MinIO:BucketName is not configured.");

        var bucketExists = await CheckBucketExistsAsync(s3Client, bucketName);
        if (!bucketExists)
        {
            await s3Client.PutBucketAsync(new PutBucketRequest
            {
                BucketName = bucketName,
                UseClientRegion = true,
            });
        }
    }

    private static async Task<bool> CheckBucketExistsAsync(IAmazonS3 s3Client, string bucketName)
    {
        var response = await s3Client.ListBucketsAsync();
        return response.Buckets.Any(b => string.Equals(b.BucketName, bucketName, StringComparison.OrdinalIgnoreCase));
    }
}
