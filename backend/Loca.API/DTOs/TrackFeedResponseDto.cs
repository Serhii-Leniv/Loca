namespace Loca.API.DTOs;

public sealed class TrackFeedResponseDto
{
    public IReadOnlyList<TrackResponseDto> Tracks { get; init; } = [];
    public string? NextCursor { get; init; }
    public string? City { get; init; }
}
