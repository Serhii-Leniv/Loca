namespace Loca.API.DTOs;

public sealed class TrackResponseDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public int Duration { get; init; }
    public string LocationName { get; init; } = string.Empty;
    public string? StreamUrl { get; init; }
}

