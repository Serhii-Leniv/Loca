using Microsoft.Extensions.Configuration;
using Minio;
using Minio.Exceptions;
using Minio.DataModel.Args;
using System;

namespace Loca.API.Services
{
    public class StorageService : IStorageService
    {
        private readonly IConfiguration _configuration;
        private readonly IMinioClient _minioClient;

        public StorageService(IConfiguration configuration)
        {
            _configuration = configuration;
            
            var endpoint = _configuration["MinIO:Endpoint"];
            var accessKey = _configuration["MinIO:AccessKey"];
            var secretKey = _configuration["MinIO:SecretKey"];
            var bucketName = _configuration["MinIO:BucketName"];
            
            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();
        }

        public async Task<string> GeneratePresignedUrl(string storageFileKey)
        {
            try
            {
                var bucketName = _configuration["MinIO:BucketName"];
                
                var presignedGetObjectArgs = new PresignedGetObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(storageFileKey)
                    .WithExpiry(3600);

                var presignedUrl = await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs);
                
                return presignedUrl;
            }
            catch (MinioException ex)
            {
                throw new Exception($"Failed to generate presigned URL for {storageFileKey}: {ex.Message}", ex);
            }
        }
    }
}
