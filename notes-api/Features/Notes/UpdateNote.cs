using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

public sealed record UpdateNoteCommand(
    string UserId,
    int Id,
    string Title,
    string Desc,
    string Color,
    List<string> Tags) : IRequest<NoteDto?>;

public sealed class UpdateNoteHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<UpdateNoteCommand, NoteDto?>
{
    public async Task<NoteDto?> Handle(UpdateNoteCommand request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAndUserAsync(request.Id, request.UserId);
        if (note is null) return null;

        note.Title     = request.Title;
        note.Desc      = request.Desc;
        note.Color     = request.Color;
        note.Tags      = string.Join(",", request.Tags ?? []);
        note.UpdatedAt = DateTime.UtcNow;

        uow.Notes.Update(note);
        await uow.SaveChangesAsync(ct);

        return mapper.Map<NoteDto>(note);
    }
}
