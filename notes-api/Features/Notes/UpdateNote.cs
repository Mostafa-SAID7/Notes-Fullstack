using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

// ── Command ───────────────────────────────────────────────────────────────────

public sealed record UpdateNoteCommand(int Id, string Title, string Desc) : IRequest<NoteDto?>;

// ── Handler ───────────────────────────────────────────────────────────────────

public sealed class UpdateNoteHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<UpdateNoteCommand, NoteDto?>
{
    public async Task<NoteDto?> Handle(UpdateNoteCommand request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAsync(request.Id);
        if (note is null)
            return null;

        note.Title = request.Title;
        note.Desc = request.Desc;

        uow.Notes.Update(note);
        await uow.SaveChangesAsync(ct);

        return mapper.Map<NoteDto>(note);
    }
}
