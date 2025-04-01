using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeyLessonProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "LessonProgress",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LessonProgress_CourseId",
                table: "LessonProgress",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonProgress_Courses_CourseId",
                table: "LessonProgress",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonProgress_Courses_CourseId",
                table: "LessonProgress");

            migrationBuilder.DropIndex(
                name: "IX_LessonProgress_CourseId",
                table: "LessonProgress");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "LessonProgress");
        }
    }
}
