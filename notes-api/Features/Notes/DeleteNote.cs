using MediatR;
using NotesApi.Common;

namespace NotesApi.Features.Notes;

public sealed record DeleteNoteCommand(string UserId, int Id) : IRequest<bool>;

public sealed class DeleteNoteHandler(IUnitOfWork uow)
    : IRequestHandler<DeleteNoteCommand, bool>
{
    public async Task<bool> Handle(DeleteNoteCommand request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAndUserAsync(request.Id, request.UserId);
        if (note is null) return false;

        uow.Notes.Remove(note);
        await uow.SaveChangesAsync(ct);

        return true;
    }
}
