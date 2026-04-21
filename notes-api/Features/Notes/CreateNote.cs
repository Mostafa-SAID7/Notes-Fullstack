using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.Database.Models;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

// ── Command ───────────────────────────────────────────────────────────────────

public sealed record CreateNoteCommand(string Title, string Desc) : IRequest<NoteDto>;

// ── Handler ───────────────────────────────────────────────────────────────────

public sealed class CreateNoteHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<CreateNoteCommand, NoteDto>
{
    public async Task<NoteDto> Handle(CreateNoteCommand request, CancellationToken ct)
    {
        var note = new Note
        {
            Title       = request.Title,
            Desc        = request.Desc,
            CreatedDate = DateTime.UtcNow,
        };

        await uow.Notes.AddAsync(note);
        await uow.SaveChangesAsync(ct);

        return mapper.Map<NoteDto>(note);
    }
}
