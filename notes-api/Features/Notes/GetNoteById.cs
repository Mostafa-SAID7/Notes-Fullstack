using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

public sealed record GetNoteByIdQuery(string UserId, int Id) : IRequest<NoteDto?>, IQuery;

public sealed class GetNoteByIdHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<GetNoteByIdQuery, NoteDto?>
{
    public async Task<NoteDto?> Handle(GetNoteByIdQuery request, CancellationToken ct)
    {
        var note = await uow.Notes.GetByIdAndUserAsync(request.Id, request.UserId);
        return note is null ? null : mapper.Map<NoteDto>(note);
    }
}
