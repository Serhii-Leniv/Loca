using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Loca.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAlbumNameToTrack : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlbumName",
                table: "Tracks",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlbumName",
                table: "Tracks");
        }
    }
}
