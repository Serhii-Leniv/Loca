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
        public DbSet<UserLikedTrack> UserLikedTracks { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Track>(entity =>
            {
                // Видалено HasConversion, оскільки властивість Duration вже є типом int
                entity.Property(e => e.Duration)
                    .IsRequired();
            });

            modelBuilder.Entity<UserLikedTrack>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.TrackId });
                entity.ToTable("UserLikedTracks");
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserLikedTracks)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Track)
                    .WithMany(t => t.UserLikedTracks)
                    .HasForeignKey(e => e.TrackId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}