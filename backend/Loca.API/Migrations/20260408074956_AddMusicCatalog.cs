using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Loca.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMusicCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Albums",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ArtistName = table.Column<string>(type: "text", nullable: false),
                    CoverImageUrl = table.Column<string>(type: "text", nullable: false),
                    ReleaseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Albums", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tracks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ArtistName = table.Column<string>(type: "text", nullable: false),
                    CoverImageUrl = table.Column<string>(type: "text", nullable: false),
                    StorageFileKey = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: false),
                    LocationName = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AlbumId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tracks_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrackUser",
                columns: table => new
                {
                    LikedByUsersId = table.Column<Guid>(type: "uuid", nullable: false),
                    LikedTracksId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackUser", x => new { x.LikedByUsersId, x.LikedTracksId });
                    table.ForeignKey(
                        name: "FK_TrackUser_Tracks_LikedTracksId",
                        column: x => x.LikedTracksId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackUser_Users_LikedByUsersId",
                        column: x => x.LikedByUsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_AlbumId",
                table: "Tracks",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackUser_LikedTracksId",
                table: "TrackUser",
                column: "LikedTracksId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrackUser");

            migrationBuilder.DropTable(
                name: "Tracks");

            migrationBuilder.DropTable(
                name: "Albums");
        }
    }
}
