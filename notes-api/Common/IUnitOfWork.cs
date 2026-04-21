using NotesApi.Repositories;

namespace NotesApi.Common;

/// <summary>
/// Unit of Work — groups repositories under a single transaction boundary.
/// Call <see cref="SaveChangesAsync"/> once after all mutations are done.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    INoteRepository Notes { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
