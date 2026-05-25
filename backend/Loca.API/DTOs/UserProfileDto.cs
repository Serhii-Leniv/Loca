namespace Loca.API.DTOs;

public sealed class UserProfileDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public int LikedTracksCount { get; init; }
}
