using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

// ── Query ─────────────────────────────────────────────────────────────────────

public sealed record GetAllNotesQuery : IRequest<IReadOnlyList<NoteDto>>, IQuery;

// ── Handler ───────────────────────────────────────────────────────────────────

public sealed class GetAllNotesHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<GetAllNotesQuery, IReadOnlyList<NoteDto>>
{
    public async Task<IReadOnlyList<NoteDto>> Handle(
        GetAllNotesQuery request, CancellationToken ct)
    {
        var notes = await uow.Notes.GetAllAsync();
        return mapper.Map<List<NoteDto>>(notes);
    }
}
