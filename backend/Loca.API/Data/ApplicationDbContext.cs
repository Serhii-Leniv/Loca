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
        public DbSet<Playlist> Playlists { get; set; } = null!;
        public DbSet<PlaylistTrack> PlaylistTracks { get; set; } = null!;
        public DbSet<UserLikedTrack> UserLikedTracks { get; set; } = null!;
        public DbSet<Memory> Memories { get; set; } = null!;

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

            modelBuilder.Entity<Memory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();

                entity.HasOne(e => e.Track)
                    .WithMany(t => t.Memories)
                    .HasForeignKey(e => e.TrackId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Memories)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Playlist>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Playlists)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PlaylistTrack>(entity =>
            {
                entity.HasKey(e => new { e.PlaylistId, e.TrackId });
                entity.ToTable("PlaylistTracks");

                entity.HasOne(e => e.Playlist)
                    .WithMany(p => p.PlaylistTracks)
                    .HasForeignKey(e => e.PlaylistId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Track)
                    .WithMany()
                    .HasForeignKey(e => e.TrackId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}