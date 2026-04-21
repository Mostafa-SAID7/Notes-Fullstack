using NotesApi.Database;
using NotesApi.DTOs;

namespace NotesApi.Tests.Fixtures;

public static class NoteTestData
{
    public static Note CreateTestNote(int id = 1, string title = "Test Note", string description = "Test Description")
    {
        return new Note
        {
            Id = id,
            Title = title,
            Desc = description,
            CreatedDate = DateTime.UtcNow,
        };
    }

    public static NoteDto CreateTestNoteDto(int id = 1, string title = "Test Note", string description = "Test Description")
    {
        return new NoteDto
        {
            Id = id,
            Title = title,
            Desc = description,
            CreatedDate = DateTime.UtcNow.ToString("O"),
        };
    }

    public static List<Note> CreateTestNotes(int count = 3)
    {
        var notes = new List<Note>();
        for (int i = 1; i <= count; i++)
        {
            notes.Add(CreateTestNote(i, $"Note {i}", $"Description {i}"));
        }
        return notes;
    }

    public static List<NoteDto> CreateTestNoteDtos(int count = 3)
    {
        var notes = new List<NoteDto>();
        for (int i = 1; i <= count; i++)
        {
            notes.Add(CreateTestNoteDto(i, $"Note {i}", $"Description {i}"));
        }
        return notes;
    }
}
