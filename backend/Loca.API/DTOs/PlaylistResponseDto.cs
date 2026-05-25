using System.Collections.Generic;

namespace Loca.API.DTOs
{
    public class PlaylistResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TrackCount { get; set; }
        public List<string> CoverImageUrls { get; set; } = new List<string>();
        public bool? ContainsTrack { get; set; }
    }
}
