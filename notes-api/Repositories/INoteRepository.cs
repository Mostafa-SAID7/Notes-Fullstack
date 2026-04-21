using NotesApi.Common;
using NotesApi.Database.Models;

namespace NotesApi.Repositories;

/// <summary>
/// Note-specific repository — extends the generic contract with
/// any note-specific queries that go beyond basic CRUD.
/// </summary>
public interface INoteRepository : IRepository<Note>
{
    // Add note-specific query methods here as the app grows.
    // e.g.: Task<IReadOnlyList<Note>> SearchAsync(string term);
}
