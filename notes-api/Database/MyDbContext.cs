using NotesApi.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace NotesApi.Database
{
    public class MyDbContext : DbContext
    {
        protected readonly IConfiguration _configuration;

        public MyDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString("PostgresSqlConnection"));
        }

        public DbSet<Note> Notes { get; set; }
    }
}
