namespace Loca.API.DTOs;

public sealed class CreateTrackRequestDto
{
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string StorageFileKey { get; init; } = string.Empty;
    public Guid AlbumId { get; init; }
    public int Duration { get; init; }
    public string LocationName { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
}
