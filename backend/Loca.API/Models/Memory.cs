namespace Loca.API.Models;

public class Memory
{
    public Guid Id { get; set; }

    public Guid TrackId { get; set; }
    public Track? Track { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
