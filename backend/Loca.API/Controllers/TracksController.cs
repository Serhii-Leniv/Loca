using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Loca.API.Data;
using Loca.API.Services;

namespace Loca.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TracksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IStorageService _storageService;

        public TracksController(ApplicationDbContext context, IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
        }

        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyTracks()
        {
            var tracks = await _context.Tracks.ToListAsync();
            
            // Map tracks to DTOs with streamUrl
            var trackDtos = new List<object>();
            foreach (var track in tracks)
            {
                trackDtos.Add(new 
                {
                    track.Id,
                    track.Title,
                    track.ArtistName,
                    track.CoverImageUrl,
                    track.Duration,
                    track.LocationName,
                    track.CreatedAt,
                    track.AlbumId,
                    StreamUrl = await _storageService.GeneratePresignedUrl(track.StorageFileKey)
                });
            }
            
            return Ok(trackDtos);
        }

        [HttpPost("{id}/like")]
        public IActionResult LikeTrack(Guid id)
        {
            // Placeholder logic for liking a track
            return Ok(new { message = $"Track {id} liked successfully." });
        }
    }
}
