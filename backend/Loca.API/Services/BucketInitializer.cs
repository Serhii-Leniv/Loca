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

            var testUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var testUser = await db.Users.FirstOrDefaultAsync(u => u.Id == testUserId);
            if (testUser == null)
            {
                testUser = new Loca.API.Models.User
                {
                    Id = testUserId,
                    Email = "listener@loca.fm",
                    Username = "LocaListener",
                    PasswordHash = "$2a$11$0wT1Z3z1Z3z1Z3z1Z3z1Z.0wT1Z3z1Z3z1Z3z1Z3z1Z3z1Z3z1Z3z", // dummy hash
                    CreatedAt = DateTime.UtcNow
                };
                db.Users.Add(testUser);
            }

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
                string? legend = null;
                if (title.Equals("Heat", StringComparison.OrdinalIgnoreCase) || artist.Contains("Gas No Light")) {
                    legend = "Цю пісню я написав пізньої ночі, коли вимкнули світло. Місто було таким тихим, а в мене був лише гул акустичної гітари та тепло однієї свічки.";
                } else if (title.Equals("Closeness", StringComparison.OrdinalIgnoreCase) || artist.Contains("Eyeliner")) {
                    legend = "Цей трек про те відчуття, коли людина за тисячі кілометрів, але ти все одно відчуваєш її поруч. Я записував вокал у маленькій комірчині, щоб спіймати цю близькість.";
                } else {
                    legend = "Іноді мелодія пишеться сама собою. Я сидів на балконі, дивився на дощ, і ці акорди просто прийшли до мене, а далі — вже історія.";
                }

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
                    Legend = legend,
                };
                db.Tracks.Add(track);

                // Seed Listener Memories
                string mem1Content = "Ця пісня крутиться в голові вже кілька тижнів! Не можу перестати слухати.";
                string mem2Content = "Повертає мене в ту літню подорож. Незабутня атмосфера.";

                if (title.Equals("Heat", StringComparison.OrdinalIgnoreCase) && artist.Contains("Gas No Light", StringComparison.OrdinalIgnoreCase))
                {
                    mem1Content = "Повертає мене до тієї літньої поїздки вздовж узбережжя.";
                    mem2Content = "Ідеальна енергія для моїх ранкових тренувань.";
                }
                else if (title.Equals("Hooked", StringComparison.OrdinalIgnoreCase) && artist.Contains("Gas No Light", StringComparison.OrdinalIgnoreCase))
                {
                    mem1Content = "Почув це наживо в маленькому підпільному клубі. Незабутньо.";
                    mem2Content = "Ця специфічна партія баса застрягла в голові на тижні.";
                }
                else if (title.Equals("Closeness", StringComparison.OrdinalIgnoreCase) && artist.Contains("Eyeliner", StringComparison.OrdinalIgnoreCase))
                {
                    mem1Content = "Слухав це на повторі під час довгого перельоту додому.";
                    mem2Content = "Нагадує мені нічні поїздки під дощем.";
                }

                var memory1 = new Loca.API.Models.Memory
                {
                    Id = Guid.NewGuid(),
                    TrackId = track.Id,
                    UserId = testUserId,
                    Content = mem1Content,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                };
                var memory2 = new Loca.API.Models.Memory
                {
                    Id = Guid.NewGuid(),
                    TrackId = track.Id,
                    UserId = testUserId,
                    Content = mem2Content,
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                };
                db.Memories.Add(memory1);
                db.Memories.Add(memory2);
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
