# AGENTS.md — Loca Backend

## Project Overview
**Loca** — music streaming service for local artists. Backend is ASP.NET Core Web API (`.NET 10`) with JWT auth, PostgreSQL, MinIO for audio storage (presigned URLs), SignalR for real-time sync rooms.

## Key Commands

```bash
cd backend

# Restore, build, test (CI order)
dotnet restore Loca.Backend.slnx
dotnet build Loca.Backend.slnx --no-restore
dotnet test Loca.Backend.slnx --no-build

# Run API (dev server with Swagger at /swagger)
dotnet run --project Loca.API

# Single test
dotnet test Loca.API.Tests --filter "FullyQualifiedName~YourTestName"
```

## Infrastructure Setup

```bash
# Start PostgreSQL + MinIO (docker-compose in backend/)
docker compose up -d
```

- **PostgreSQL**: `localhost:5432`, db=`loca_db`, user=`loca_admin`, pass=`loca_password`
- **MinIO**: API `localhost:9000`, console `localhost:9001`
- Bucket `loca-audio-files` is auto-created on startup
- JWT `SecretKey` in `appsettings.json` must be changed for production

## Architecture

```
backend/
├── Loca.API/
│   ├── Program.cs              # Entry point — DI, auth, Swagger, bucket init
│   ├── Controllers/
│   │   ├── AuthController      # Login/Register (BCrypt, generates JWT)
│   │   ├── TracksController    # Nearby tracks (with presigned StreamUrl), likes
│   │   └── StorageController   # Presigned upload/download URLs [Authorize]
│   ├── Services/
│   │   ├── MinioStorageService # IStorageService — presigned URLs via AWSSDK.S3
│   │   └── BucketInitializer   # Auto-creates MinIO bucket on startup
│   ├── Interfaces/
│   │   ├── IStorageService     # Storage contract
│   │   └── ITokenService       # (legacy interface, not used by AuthController)
│   ├── Data/
│   │   └── ApplicationDbContext
│   ├── Models/                 # User, Track, Album
│   ├── DTOs/                   # TrackResponseDto, UploadUrlResponseDto, etc.
│   └── Migrations/
├── Loca.API.Tests/
│   ├── Controllers/            # Auth, Tracks, Storage tests
│   └── Services/               # MinioStorageService tests
├── ApplicationDbContext.cs     # Solution-level (for tests)
├── User.cs                     # Solution-level (legacy)
└── docker-compose.yml
```

## Auth

- **AuthController** uses `BCrypt.Net` for password hashing and generates JWT tokens directly
- JWT claims: `sub` (userId), `userId` (string), `username`, `jti`, `iat`
- Config section: `JwtSettings` (falls back to `Jwt` section)
- Default issuer: `LocaAPI`, audience: `LocaAPIUsers`
- **Do not** use `ClaimTypes.NameIdentifier` to read userId — use `"userId"` claim instead

## MinIO/S3 Storage

- Uses `AWSSDK.S3` for presigned URL generation (not the `Minio` client SDK)
- `ForcePathStyle = true` required for MinIO compatibility
- Upload flow: client requests presigned PUT URL → uploads directly to MinIO → creates Track record
- Key format: `tracks/{Guid:N}_{fileName}`
- Allowed audio types: mp3, wav, m4a, aac, flac, ogg, webm
- Upload URL TTL: 15 min (configurable via `MinIO:UploadUrlTtlMinutes`)
- Download URL TTL: 60 min (configurable via `MinIO:DownloadUrlTtlMinutes`)

## Important Notes

- **Target framework**: `net10.0`
- **Solution file**: `Loca.Backend.slnx` (XML format)
- **Tests**: xUnit + FluentAssertions + Moq + InMemory DB
- **Migrations**: run from `backend/Loca.API/`:
  ```bash
  dotnet ef migrations add Name --project Loca.API
  dotnet ef database update --project Loca.API
  ```
- **Swagger**: dev environment only at `/swagger`
- Bucket is created automatically on app start via `BucketInitializer`

## CI Workflow

`.github/workflows/ci.yml` — on push to `main` and PRs:
1. `dotnet restore`
2. `dotnet build --no-restore`
3. `dotnet test --no-build`

## Conventions

- Ukrainian comments in code
- Nullable reference types enabled
- Implicit usings enabled
- `CancellationToken` with default value on async controller methods
