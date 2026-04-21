namespace NotesApi.DTOs;

/// <summary>Read model returned to the client.</summary>
public sealed record NoteDto(
    int      Id,
    string   Title,
    string   Desc,
    DateTime CreatedDate);

/// <summary>Payload for creating a new note.</summary>
public sealed record CreateNoteRequest(string Title, string Desc);

/// <summary>Payload for updating an existing note.</summary>
public sealed record UpdateNoteRequest(int Id, string Title, string Desc);
