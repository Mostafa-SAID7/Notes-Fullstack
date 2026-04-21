using Microsoft.EntityFrameworkCore;
using NotesApi.Common;
using NotesApi.Database;
using NotesApi.Database.Models;

namespace NotesApi.Repositories;

/// <summary>EF Core implementation of <see cref="INoteRepository"/>.</summary>
public sealed class NoteRepository(MyDbContext db)
    : IRepository<Note>, INoteRepository
{
    public async Task<IReadOnlyList<Note>> GetAllAsync()
        => await db.Notes.AsNoTracking().ToListAsync();

    public async Task<Note?> GetByIdAsync(int id)
        => await db.Notes.FindAsync(id);

    public async Task AddAsync(Note entity)
        => await db.Notes.AddAsync(entity);

    public void Update(Note entity)
        => db.Notes.Update(entity);

    public void Remove(Note entity)
        => db.Notes.Remove(entity);
}
