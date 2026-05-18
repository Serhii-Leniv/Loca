using Microsoft.EntityFrameworkCore;
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
        var env = scope.ServiceProvider.GetService<Microsoft.AspNetCore.Hosting.IWebHostEnvironment>();
        var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
        var logger = loggerFactory.CreateLogger("BucketInitializer");
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

        // Seed sample data into MinIO + database when running in Development or when explicit flag is set.
        var shouldSeed = (env != null && env.IsDevelopment()) || string.Equals(configuration["SeedOnStartup"], "true", StringComparison.OrdinalIgnoreCase);
        if (!shouldSeed)
        {
            logger.LogDebug("Seeding skipped (not development and SeedOnStartup != true).");
            return;
        }

        // Resolve DbContext and seed folder
        var db = scope.ServiceProvider.GetRequiredService<Loca.API.Data.ApplicationDbContext>();
        if (await db.Tracks.AnyAsync())
        {
            logger.LogInformation("Database already contains tracks - skipping seed.");
            return;
        }

        var contentRoot = env?.ContentRootPath ?? AppContext.BaseDirectory;
        var seedPath = System.IO.Path.Combine(contentRoot, "SeedData");
        if (!System.IO.Directory.Exists(seedPath))
        {
            logger.LogWarning("SeedData directory not found at {SeedPath}", seedPath);
            return;
        }

        try
        {
            var audioFiles = System.IO.Directory.GetFiles(seedPath, "*.mp3");
            logger.LogInformation("Seeding {Count} audio files from {SeedPath}", audioFiles.Length, seedPath);

            foreach (var audioFile in audioFiles)
            {
                var baseName = System.IO.Path.GetFileNameWithoutExtension(audioFile);

                // Read audio into memory
                await using var audioStream = System.IO.File.OpenRead(audioFile);
                var memory = new MemoryStream();
                await audioStream.CopyToAsync(memory);
                memory.Position = 0;

                // Extract metadata via TagLib
                string title = baseName, artist = "Unknown Artist", albumName = "Unknown Album";
                int durationSeconds = 0;
                try
                {
                    using var tagFile = TagLib.File.Create(new StreamFileAbstraction(System.IO.Path.GetFileName(audioFile), memory, memory));
                    title = string.IsNullOrWhiteSpace(tagFile.Tag.Title) ? title : tagFile.Tag.Title;
                    artist = tagFile.Tag.FirstPerformer ?? artist;
                    albumName = string.IsNullOrWhiteSpace(tagFile.Tag.Album) ? albumName : tagFile.Tag.Album;
                    durationSeconds = (int)tagFile.Properties.Duration.TotalSeconds;
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to read tags for {Audio}", audioFile);
                }

                // Upload audio object
                memory.Position = 0;
                var trackKey = $"tracks/{Guid.NewGuid():N}_{System.IO.Path.GetFileName(audioFile)}";
                var putReq = new PutObjectRequest
                {
                    BucketName = bucketName,
                    Key = trackKey,
                    InputStream = memory,
                    ContentType = "audio/mpeg",
                };
                await s3Client.PutObjectAsync(putReq);

                // Upload cover image if exists
                string? coverKey = null;
                var jpgPath = System.IO.Path.Combine(seedPath, baseName + ".jpg");
                if (System.IO.File.Exists(jpgPath))
                {
                    await using var imgStream = System.IO.File.OpenRead(jpgPath);
                    var coverMemory = new MemoryStream();
                    await imgStream.CopyToAsync(coverMemory);
                    coverMemory.Position = 0;
                    coverKey = $"covers/{Guid.NewGuid():N}_{System.IO.Path.GetFileName(jpgPath)}";
                    var coverReq = new PutObjectRequest
                    {
                        BucketName = bucketName,
                        Key = coverKey,
                        InputStream = coverMemory,
                        ContentType = "image/jpeg",
                    };
                    await s3Client.PutObjectAsync(coverReq);
                }

                // Ensure album exists
                var album = await db.Albums.Where(a => a.Title == albumName && a.ArtistName == artist).FirstOrDefaultAsync();
                if (album == null)
                {
                    album = new Loca.API.Models.Album
                    {
                        Id = Guid.NewGuid(),
                        Title = albumName,
                        ArtistName = artist,
                        CoverImageUrl = coverKey,
                    };
                    db.Albums.Add(album);
                }

                // Create track entity
                var track = new Loca.API.Models.Track
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    ArtistName = artist,
                    AlbumName = albumName,
                    Duration = durationSeconds,
                    StorageFileKey = trackKey,
                    CoverImageUrl = coverKey,
                    LocationName = "LocalSeed",
                    Album = album,
                };
                db.Tracks.Add(track);
            }

            await db.SaveChangesAsync();
            logger.LogInformation("Seeding complete: {Tracks} tracks added.", await db.Tracks.CountAsync());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while seeding data");
        }
    }

    private class StreamFileAbstraction : TagLib.File.IFileAbstraction
    {
        private readonly string _name;
        private readonly Stream _stream;

        public StreamFileAbstraction(string name, Stream readStream, Stream writeStream)
        {
            _name = name;
            _stream = readStream;
        }

        public string Name => _name;

        public Stream ReadStream => _stream;

        public Stream WriteStream => _stream;

        public void CloseStream(Stream stream)
        {
            // no-op
        }
    }

    private static async Task<bool> CheckBucketExistsAsync(IAmazonS3 s3Client, string bucketName)
    {
        var response = await s3Client.ListBucketsAsync();
        return response.Buckets != null && response.Buckets.Any(b => string.Equals(b.BucketName, bucketName, StringComparison.OrdinalIgnoreCase));
    }
}
