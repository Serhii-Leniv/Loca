using Microsoft.EntityFrameworkCore;
using Loca.API.Models;

namespace Loca.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Track> Tracks { get; set; } = null!;

        public DbSet<Album> Albums { get; set; } = null!;
    }
}