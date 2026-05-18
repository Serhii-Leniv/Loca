namespace Loca.API.DTOs;

public class MemoryResponseDto
{
    public Guid Id { get; set; }
    public Guid TrackId { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
