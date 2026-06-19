using AutoMapper;
using NotesApi.Database.Models;
using NotesApi.DTOs;

namespace NotesApi.Config;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Note, NoteDto>()
            .ForCtorParam("tags", opt => opt.MapFrom(src =>
                string.IsNullOrWhiteSpace(src.Tags)
                    ? new List<string>()
                    : src.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                              .Select(t => t.Trim())
                              .Where(t => !string.IsNullOrWhiteSpace(t))
                              .ToList()));
    }
}
