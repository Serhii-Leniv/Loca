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

        // Bucket-level CORS configuration via S3 API is not supported in local MinIO deployments.
        // Rely on server-level CORS (MINIO_API_CORS_ALLOW_ORIGIN) instead.
    }

    private static async Task<bool> CheckBucketExistsAsync(IAmazonS3 s3Client, string bucketName)
    {
        var response = await s3Client.ListBucketsAsync();
        return response.Buckets != null && response.Buckets.Any(b => string.Equals(b.BucketName, bucketName, StringComparison.OrdinalIgnoreCase));
    }
}
