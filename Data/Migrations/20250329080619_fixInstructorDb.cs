using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class fixInstructorDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GioiThieu",
                table: "Instructors",
                newName: "Bio");

            migrationBuilder.RenameColumn(
                name: "ChuyenMon",
                table: "Instructors",
                newName: "Specialization");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Specialization",
                table: "Instructors",
                newName: "ChuyenMon");

            migrationBuilder.RenameColumn(
                name: "Bio",
                table: "Instructors",
                newName: "GioiThieu");
        }
    }
}
