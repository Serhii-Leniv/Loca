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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Track>(entity =>
            {
                // Видалено HasConversion, оскільки властивість Duration вже є типом int
                entity.Property(e => e.Duration)
                    .IsRequired();
            });

            modelBuilder.Entity<Track>()
                .HasMany(track => track.LikedByUsers)
                .WithMany(user => user.LikedTracks)
                .UsingEntity<Dictionary<string, object>>(
                    "UserLikedTracks",
                    right => right.HasOne<User>()
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade),
                    left => left.HasOne<Track>()
                        .WithMany()
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.Cascade),
                    join =>
                    {
                        join.HasKey("UserId", "TrackId");
                        join.ToTable("UserLikedTracks");
                    });
        }
    }
}