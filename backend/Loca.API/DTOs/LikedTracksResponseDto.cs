namespace Loca.API.DTOs;

public sealed class LikedTracksResponseDto
{
    public IReadOnlyList<TrackResponseDto> Tracks { get; init; } = [];
    public int TotalDurationSeconds { get; init; }
}