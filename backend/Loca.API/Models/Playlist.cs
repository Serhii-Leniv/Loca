namespace Loca.API.Models
{
    public class Playlist
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<PlaylistTrack> PlaylistTracks { get; set; } = new List<PlaylistTrack>();
    }
}
