namespace Loca.API.Models
{
    public class Album
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ArtistName { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }

        public ICollection<Track> Tracks { get; set; } = new List<Track>();
    }
}
