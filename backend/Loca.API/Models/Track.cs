namespace Loca.API.Models;

public class Track
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }

    public int Duration { get; set; }
    public string LocationName { get; set; } = string.Empty;

    public string StorageFileKey { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid AlbumId { get; set; }
    public Album? Album { get; set; }

    public ICollection<User> LikedByUsers { get; set; } = new List<User>();
}

