using NotesApi.Common;
using NotesApi.Database;
using NotesApi.Repositories;

namespace NotesApi.UnitOfWork;

/// <summary>
/// Wraps <see cref="MyDbContext"/> and exposes all repositories.
/// A single <c>SaveChangesAsync</c> call commits every pending change atomically.
/// </summary>
public sealed class UnitOfWork(MyDbContext db) : IUnitOfWork
{
    // Lazy-initialise each repository so we only allocate what is used.
    private INoteRepository? _notes;

    public INoteRepository Notes => _notes ??= new NoteRepository(db);

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => db.SaveChangesAsync(ct);

    public void Dispose() => db.Dispose();
}
