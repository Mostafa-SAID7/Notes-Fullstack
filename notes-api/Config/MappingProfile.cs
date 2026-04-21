using AutoMapper;
using NotesApi.Database.Models;
using NotesApi.DTOs;

namespace NotesApi.Config;

/// <summary>
/// AutoMapper profile for mapping between domain models and DTOs.
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Note → NoteDto
        CreateMap<Note, NoteDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Desc, opt => opt.MapFrom(src => src.Desc))
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate));

        // CreateNoteRequest → Note
        CreateMap<CreateNoteRequest, Note>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Desc, opt => opt.MapFrom(src => src.Desc))
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore());

        // UpdateNoteRequest → Note
        CreateMap<UpdateNoteRequest, Note>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Desc, opt => opt.MapFrom(src => src.Desc))
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore());
    }
}
