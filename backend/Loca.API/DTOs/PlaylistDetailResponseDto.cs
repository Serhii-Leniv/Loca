using System.Collections.Generic;

namespace Loca.API.DTOs
{
    public class PlaylistDetailResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TrackCount { get; set; }
        public List<string> CoverImageUrls { get; set; } = new List<string>();
        public List<TrackDto> Tracks { get; set; } = new List<TrackDto>();
    }

    public class TrackDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ArtistName { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string CoverImageUrl { get; set; } = string.Empty;
    }
}
