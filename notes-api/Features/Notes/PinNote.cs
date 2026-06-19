using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

public sealed record PinNoteCommand(string UserId, int Id, bool IsPinned) : IRequest<NoteDto?>;

public sealed class PinNoteHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<PinNoteCommand, NoteDto?>
{
    public async Task<NoteDto?> Handle(PinNoteCommand request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAndUserAsync(request.Id, request.UserId);
        if (note is null) return null;

        note.IsPinned  = request.IsPinned;
        note.UpdatedAt = DateTime.UtcNow;

        uow.Notes.Update(note);
        await uow.SaveChangesAsync(ct);

        return mapper.Map<NoteDto>(note);
    }
}
