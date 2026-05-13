namespace Loca.API.DTOs;

public sealed class AlbumWithTracksResponseDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public IReadOnlyList<TrackResponseDto> Tracks { get; init; } = [];
}
