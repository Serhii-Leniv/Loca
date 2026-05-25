namespace Loca.API.DTOs;

public class MemoryCarouselItemDto
{
    public Guid TrackId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public string Username { get; set; } = string.Empty;

    public Guid MemoryId { get; set; }
    public string MemoryContent { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
