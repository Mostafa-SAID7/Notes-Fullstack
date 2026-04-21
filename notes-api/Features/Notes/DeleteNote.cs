using MediatR;
using NotesApi.Common;

namespace NotesApi.Features.Notes;

// ── Command ───────────────────────────────────────────────────────────────────

public sealed record DeleteNoteCommand(int Id) : IRequest<bool>;

// ── Handler ───────────────────────────────────────────────────────────────────

public sealed class DeleteNoteHandler(IUnitOfWork uow)
    : IRequestHandler<DeleteNoteCommand, bool>
{
    public async Task<bool> Handle(DeleteNoteCommand request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAsync(request.Id);
        if (note is null)
            return false;

        uow.Notes.Remove(note);
        await uow.SaveChangesAsync(ct);

        return true;
    }
}
