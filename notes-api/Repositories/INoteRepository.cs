using NotesApi.Common;
using NotesApi.Database.Models;

namespace NotesApi.Repositories;

/// <summary>
/// Note-specific repository — extends the generic contract with
/// any note-specific queries that go beyond basic CRUD.
/// </summary>
public interface INoteRepository : IRepository<Note>
{
    Task<IReadOnlyList<Note>> GetAllByUserAsync(string userId);
    Task<Note?> GetByIdAndUserAsync(int id, string userId);
}
