# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Loca** — music streaming service for local/regional artists. Monorepo with:
- `backend/` — ASP.NET Core Web API (`.NET 10`), PostgreSQL, MinIO, JWT auth
- `frontend/` — React + Vite web app (Figma Make export, shadcn/ui + Radix + Tailwind v4)

## Commands

### Infrastructure
```bash
# From backend/
docker compose up -d    # PostgreSQL (5432) + MinIO (API 9000, console 9001)
docker compose down
```

### Backend
```bash
cd backend

# Build / test (CI order)
dotnet restore Loca.Backend.slnx
dotnet build Loca.Backend.slnx --no-restore
dotnet test Loca.Backend.slnx --no-build

# Run single test
dotnet test Loca.API.Tests --filter "FullyQualifiedName~YourTestName"

# Run API (Swagger at /swagger)
dotnet run --project Loca.API
```

### Backend migrations (run from `backend/`)
```bash
# dotnet and dotnet-ef tools live in ~/.dotnet — add to PATH first:
export PATH="$PATH:$HOME/.dotnet:$HOME/.dotnet/tools"

dotnet ef migrations add <Name> --project Loca.API
dotnet ef database update --project Loca.API
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev     # http://localhost:5173
pnpm build
```

## Architecture

### Backend

```
backend/
├── docker-compose.yml
├── Loca.Backend.slnx
├── Loca.API/
│   ├── Program.cs              # DI, auth, CORS, Swagger, bucket init
│   ├── Controllers/            # Thin, sealed; query EF Core directly (no repository layer)
│   │   ├── AuthController      # Register/Login — BCrypt + JWT generation
│   │   ├── TracksController    # Nearby tracks (presigned StreamUrl), likes toggle
│   │   └── StorageController   # Presigned PUT/GET/DELETE URLs [Authorize]
│   ├── Services/
│   │   ├── MinioStorageService # IStorageService — AWSSDK.S3, ForcePathStyle=true
│   │   └── BucketInitializer   # Auto-creates `loca-audio-files` bucket on startup
│   ├── Interfaces/IStorageService.cs
│   ├── Data/ApplicationDbContext.cs
│   ├── Models/                 # User, Track, Album
│   ├── DTOs/
│   └── Migrations/
└── Loca.API.Tests/             # xUnit + FluentAssertions + Moq + InMemory DB
    ├── Controllers/
    └── Services/
```

**Auth**: JWT config reads `JwtSettings` section first, falls back to `Jwt` section. Claims: `sub` (userId), `userId` (string), `username`. Read userId via `"userId"` claim — not `ClaimTypes.NameIdentifier`.

**Storage upload flow**: client calls `POST /api/storage/upload-url?fileName=&contentType=` → receives presigned PUT URL → uploads directly to MinIO → creates Track record with the returned key. Key format: `tracks/{Guid:N}_{fileName}`.

**Domain**: `Track` → `Album` (required FK, cascade delete). `User` ↔ `Track` many-to-many via `UserLikedTracks` join table (no join entity class, configured in `OnModelCreating`).

**CORS**: `FrontendDevServer` policy allows `http://localhost:5173`.

**Conventions**: Ukrainian comments in code. Nullable reference types + implicit usings enabled. `CancellationToken ct = default` on async controller methods.

### Frontend

```
frontend/
├── src/
│   ├── main.tsx                # Entry — mounts AuthProvider + RouterProvider
│   ├── app/
│   │   ├── routes.tsx          # All routes; privateRoute wraps ProtectedRoute, publicRoute wraps PublicOnlyRoute
│   │   ├── context/AuthContext.tsx   # JWT decode, token in localStorage (`loca.authToken`)
│   │   ├── services/api.ts     # apiRequest<T>(), ApiError class, token helpers
│   │   ├── services/auth.ts    # login/register API calls
│   │   ├── components/ui/      # shadcn/ui components (Radix primitives)
│   │   └── [Page].tsx          # One file per route/screen
│   └── styles/theme.css        # CSS variables for design tokens
└── vite.config.ts              # @-alias → src/, figma:asset/ resolver
```

**API client**: `apiRequest<T>` in `services/api.ts` auto-attaches Bearer token from localStorage. Throws `ApiError` (with `.status` and `.details.errors` for validation) on non-2xx. Backend URL via `VITE_API_BASE_URL` env var (default `http://localhost:5115`).

**Auth state**: `AuthContext` decodes JWT client-side (no refresh token). `useAuth()` hook exposes `{ user, isAuthenticated, signIn, logout }`. Token expiry checked on mount and on `storage` events (multi-tab sync).

**Routing**: All app routes are protected by default via `privateRoute`. Auth pages (`/`, `/login`) use `publicRoute` (redirect if already authenticated).

## Configuration

Override secrets via User Secrets (preferred for local dev):
```bash
cd backend/Loca.API
dotnet user-secrets set "Jwt:SecretKey" "<your-secret>"
```

Default `appsettings.json` targets Docker Compose services:
- PostgreSQL: `loca_admin` / `loca_password` / `loca_db` on port 5432
- MinIO: endpoint `localhost:9000`, bucket `loca-audio-files` (auto-created)
- Upload URL TTL: 15 min (`MinIO:UploadUrlTtlMinutes`)
- Download URL TTL: 60 min (`MinIO:DownloadUrlTtlMinutes`)

## CI

`.github/workflows/ci.yml` — triggers on push to `main` and PRs: restore → build → test.
