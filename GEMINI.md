# 🎧 Loca Project Instructions

Loca is an innovative music streaming service concept focused on supporting local artists and regional music communities.

## 🏗 Project Overview

The project is a monorepo consisting of:
- **Backend**: ASP.NET Core Web API (`.NET 10`)
  - **Database**: PostgreSQL with PostGIS for geospatial queries.
  - **Storage**: MinIO (S3-compatible) for audio files.
  - **Auth**: JWT-based authentication with BCrypt password hashing.
  - **Real-time**: SignalR for synchronous streaming rooms.
- **Frontend**: React + Vite web application
  - **Styling**: Tailwind CSS v4, shadcn/ui (Radix primitives).
  - **State**: React Context for Auth.

## 🛠 Building and Running

### Infrastructure
Local infrastructure runs via Docker Compose in the `backend/` directory:
```bash
cd backend
docker compose up -d    # Starts PostgreSQL (5432) and MinIO (9000/9001)
```

### Backend
```bash
cd backend
dotnet restore Loca.Backend.slnx
dotnet run --project Loca.API          # API runs with Swagger at /swagger
dotnet test Loca.Backend.slnx          # Runs all tests (xUnit)
```

**Database Migrations**:
```bash
cd backend/Loca.API
dotnet ef migrations add <Name>
dotnet ef database update
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev     # Runs at http://localhost:5173
pnpm build
```

## 📐 Architecture & Conventions

### Backend Conventions
- **Controllers**: Keep them thin and `sealed`. Query EF Core `ApplicationDbContext` directly (repository pattern is avoided).
- **Language**: Code comments are in **Ukrainian**.
- **Modern C#**: Use nullable reference types and implicit usings.
- **Async**: Always include `CancellationToken ct = default` in async controller methods.
- **Authentication**:
  - Use the `"userId"` claim to retrieve the current user ID, **not** `ClaimTypes.NameIdentifier`.
  - JWT configuration reads from `JwtSettings` or `Jwt` sections in `appsettings.json`.
- **Storage**: Use `IStorageService` (MinioStorageService) for generating presigned URLs. Client uploads directly to MinIO.

### Frontend Conventions
- **API Client**: Use the `apiRequest<T>` wrapper in `src/app/services/api.ts`. It handles tokens and throws `ApiError`.
- **Auth**: Managed by `AuthContext`. Token is stored in `localStorage` as `loca.authToken`.
- **Routing**: Routes are defined in `src/app/routes.tsx`. Use `privateRoute` for authenticated pages.
- **Paths**: Use the `@` alias for the `src/` directory.

### Engineering Standards
- **Surgical Updates**: Prefer targeted edits with `replace` over complete file rewrites.
- **Testing**: Backend tests use xUnit, FluentAssertions, and Moq. Always verify changes with tests.
- **Validation**: Before finishing a task, ensure the project builds and tests pass.
