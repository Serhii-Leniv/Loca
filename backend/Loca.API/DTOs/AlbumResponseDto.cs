namespace Loca.API.DTOs;

public sealed class AlbumResponseDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public int TrackCount { get; init; }
    public int TotalDurationSeconds { get; init; }
}
