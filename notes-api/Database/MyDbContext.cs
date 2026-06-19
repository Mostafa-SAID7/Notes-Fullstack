using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NotesApi.Database.Models;

namespace NotesApi.Database;

public class MyDbContext(DbContextOptions<MyDbContext> options)
    : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Note> Notes => Set<Note>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Note>()
            .Property(n => n.Color)
            .HasDefaultValue("default");
    }
}
