namespace Loca.API.DTOs;

public sealed class TrackFeedResponseDto
{
    public IReadOnlyList<TrackResponseDto> Tracks { get; init; } = [];
    public string? City { get; init; }
    public bool HasMore { get; init; }
}
