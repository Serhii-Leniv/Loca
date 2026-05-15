namespace Loca.API.DTOs;

public sealed class TrackSyncResponseDto
{
    public int AudioFilesScanned { get; init; }
    public int NewTracksCreated { get; init; }
    public int ExistingTracksUpdated { get; init; }
    public int ExistingTracksSkipped { get; init; }
    public IReadOnlyList<TrackSyncResultDto> Tracks { get; init; } = Array.Empty<TrackSyncResultDto>();
}