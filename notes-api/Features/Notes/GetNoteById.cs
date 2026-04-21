using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

// ── Query ─────────────────────────────────────────────────────────────────────

public sealed record GetNoteByIdQuery(int Id) : IRequest<NoteDto?>, IQuery;

// ── Handler ───────────────────────────────────────────────────────────────────

public sealed class GetNoteByIdHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<GetNoteByIdQuery, NoteDto?>
{
    public async Task<NoteDto?> Handle(GetNoteByIdQuery request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAsync(request.Id);
        return note is null ? null : mapper.Map<NoteDto>(note);
    }
}
