namespace Loca.API.DTOs;

public sealed class AlbumMapDto
{
    public Guid    Id            { get; init; }
    public string  Title         { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public int     TrackCount    { get; init; }
}

public sealed class ArtistMapEntryDto
{
    public string            ArtistName   { get; init; } = string.Empty;
    public string            LocationName { get; init; } = string.Empty;
    public int               TrackCount   { get; init; }
    public List<AlbumMapDto> Albums       { get; init; } = [];
}
