namespace Loca.API.DTOs;

public sealed class TrackSyncResultDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string StorageFileKey { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public Guid AlbumId { get; init; }
}