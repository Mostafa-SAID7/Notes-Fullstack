using Microsoft.EntityFrameworkCore;
using NotesApi.Database.Models;

namespace NotesApi.Database;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
    public DbSet<Note> Notes => Set<Note>();
}
