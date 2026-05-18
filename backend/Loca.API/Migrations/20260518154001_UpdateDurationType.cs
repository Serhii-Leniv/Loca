using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Loca.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDurationType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Albums",
                newName: "ReleaseDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReleaseDate",
                table: "Albums",
                newName: "CreatedAt");
        }
    }
}
