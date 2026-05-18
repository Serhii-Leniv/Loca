namespace Loca.API.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Username { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<UserLikedTrack> UserLikedTracks { get; set; } = new List<UserLikedTrack>();
        public ICollection<Memory> Memories { get; set; } = new List<Memory>();
    }
}