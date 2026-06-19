using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

public sealed record GetAllNotesQuery(string UserId) : IRequest<IReadOnlyList<NoteDto>>, IQuery;

public sealed class GetAllNotesHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<GetAllNotesQuery, IReadOnlyList<NoteDto>>
{
    public async Task<IReadOnlyList<NoteDto>> Handle(
        GetAllNotesQuery request, CancellationToken ct)
    {
        var notes = await uow.Notes.GetAllByUserAsync(request.UserId);
        var ordered = notes
            .OrderByDescending(n => n.IsPinned)
            .ThenByDescending(n => n.UpdatedAt)
            .ToList();
        return mapper.Map<List<NoteDto>>(ordered);
    }
}
