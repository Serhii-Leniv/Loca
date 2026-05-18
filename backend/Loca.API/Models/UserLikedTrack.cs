namespace Loca.API.Models;

/// <summary>
/// Зв'язок багато-до-багатьох між користувачем і вподобаним треком.
/// </summary>
public class UserLikedTrack
{
    public Guid UserId { get; set; }
    public Guid TrackId { get; set; }

    public User User { get; set; } = null!;
    public Track Track { get; set; } = null!;
}
