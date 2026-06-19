using System.ComponentModel.DataAnnotations;

namespace NotesApi.Database.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Desc { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsPinned { get; set; } = false;
        public string Color { get; set; } = "default";
        public string Tags { get; set; } = "";
        public string? UserId { get; set; }
    }
}
