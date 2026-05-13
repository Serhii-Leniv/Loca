namespace Loca.API.DTOs;

public sealed class CreateAlbumRequestDto
{
    public string Title { get; init; } = string.Empty;
    public string ArtistName { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
}
