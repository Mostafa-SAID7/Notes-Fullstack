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
    }
}
