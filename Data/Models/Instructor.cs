using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    public class Instructor
    {
        [Key, ForeignKey("User")] // Dùng chung khóa chính với User
        public int UserId { get; set; }

        [MaxLength(500)]
        public string? Specialization { get; set; }

        [MaxLength(2000)]
        public string? Bio { get; set; }

        public User User { get; set; } = null!;
    }
}
