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
            migrationBuilder.Sql(
                "ALTER TABLE \"Albums\" ADD COLUMN IF NOT EXISTS \"ReleaseDate\" timestamp with time zone NOT NULL DEFAULT now();");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Albums"
            );
        }
    }
}
