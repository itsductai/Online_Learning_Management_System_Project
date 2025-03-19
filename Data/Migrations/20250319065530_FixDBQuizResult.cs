using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class FixDBQuizResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizResults_Quizzes_QuizId",
                table: "QuizResults");

            migrationBuilder.RenameColumn(
                name: "QuizId",
                table: "QuizResults",
                newName: "LessonId");

            migrationBuilder.RenameIndex(
                name: "IX_QuizResults_QuizId",
                table: "QuizResults",
                newName: "IX_QuizResults_LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizResults_Lessons_LessonId",
                table: "QuizResults",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "LessonId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizResults_Lessons_LessonId",
                table: "QuizResults");

            migrationBuilder.RenameColumn(
                name: "LessonId",
                table: "QuizResults",
                newName: "QuizId");

            migrationBuilder.RenameIndex(
                name: "IX_QuizResults_LessonId",
                table: "QuizResults",
                newName: "IX_QuizResults_QuizId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizResults_Quizzes_QuizId",
                table: "QuizResults",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
