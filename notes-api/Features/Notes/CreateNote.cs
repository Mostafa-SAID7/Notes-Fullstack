using AutoMapper;
using MediatR;
using NotesApi.Common;
using NotesApi.Database.Models;
using NotesApi.DTOs;

namespace NotesApi.Features.Notes;

public sealed record CreateNoteCommand(
    string UserId,
    string Title,
    string Desc,
    string Color,
    List<string> Tags) : IRequest<NoteDto>;

public sealed class CreateNoteHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<CreateNoteCommand, NoteDto>
{
    public async Task<NoteDto> Handle(CreateNoteCommand request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var note = new Note
        {
            UserId      = request.UserId,
            Title       = request.Title,
            Desc        = request.Desc,
            Color       = request.Color,
            Tags        = string.Join(",", request.Tags ?? []),
            CreatedDate = now,
            UpdatedAt   = now,
            IsPinned    = false,
        };

        await uow.Notes.AddAsync(note);
        await uow.SaveChangesAsync(ct);

        return mapper.Map<NoteDto>(note);
    }
}
