namespace Loca.API.DTOs;

public sealed class TrackResponseDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public int Duration { get; init; }
    public string LocationName { get; init; } = string.Empty;
    public Guid AlbumId { get; init; }
    public string? StreamUrl { get; init; }
    public bool IsLiked { get; init; }
    public string? Legend { get; init; }
}

