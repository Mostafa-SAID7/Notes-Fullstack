using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using NotesApi.DTOs;
using Xunit;

namespace NotesApi.Tests.Integration;

public class NotesControllerIntegrationTests : IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private HttpClient? _client;

    public NotesControllerIntegrationTests()
    {
        _factory = new WebApplicationFactory<Program>();
    }

    public async Task InitializeAsync()
    {
        _client = _factory.CreateClient();
        // Initialize database if needed
        await Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
        await Task.CompletedTask;
    }

    [Fact]
    public async Task GetAllNotes_ReturnsOkWithNotes()
    {
        // Act
        var response = await _client!.GetAsync("/api/notes");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var notes = await response.Content.ReadFromJsonAsync<List<NoteDto>>();
        notes.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateNote_WithValidData_ReturnsCreatedAtAction()
    {
        // Arrange
        var createRequest = new CreateNoteRequest("Integration Test Note", "Test Description");

        // Act
        var response = await _client!.PostAsJsonAsync("/api/notes", createRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdNote = await response.Content.ReadFromJsonAsync<NoteDto>();
        createdNote.Should().NotBeNull();
        createdNote.Title.Should().Be("Integration Test Note");
    }

    [Fact]
    public async Task CreateNote_WithEmptyTitle_ReturnsBadRequest()
    {
        // Arrange
        var createRequest = new CreateNoteRequest("", "Test Description");

        // Act
        var response = await _client!.PostAsJsonAsync("/api/notes", createRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateNote_WithValidData_ReturnsOk()
    {
        // Arrange - Create a note first
        var createRequest = new CreateNoteRequest("Original Title", "Original Description");
        var createResponse = await _client!.PostAsJsonAsync("/api/notes", createRequest);
        var createdNote = await createResponse.Content.ReadFromJsonAsync<NoteDto>();

        var updateRequest = new UpdateNoteRequest(createdNote!.Id, "Updated Title", "Updated Description");

        // Act
        var response = await _client.PutAsJsonAsync("/api/notes", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedNote = await response.Content.ReadFromJsonAsync<NoteDto>();
        updatedNote!.Title.Should().Be("Updated Title");
    }

    [Fact]
    public async Task DeleteNote_WithValidId_ReturnsNoContent()
    {
        // Arrange - Create a note first
        var createRequest = new CreateNoteRequest("Note to Delete", "Description");
        var createResponse = await _client!.PostAsJsonAsync("/api/notes", createRequest);
        var createdNote = await createResponse.Content.ReadFromJsonAsync<NoteDto>();

        // Act
        var response = await _client.DeleteAsync($"/api/notes/{createdNote!.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task GetNoteById_WithValidId_ReturnsOk()
    {
        // Arrange - Create a note first
        var createRequest = new CreateNoteRequest("Test Note", "Description");
        var createResponse = await _client!.PostAsJsonAsync("/api/notes", createRequest);
        var createdNote = await createResponse.Content.ReadFromJsonAsync<NoteDto>();

        // Act
        var response = await _client.GetAsync($"/api/notes/{createdNote!.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var note = await response.Content.ReadFromJsonAsync<NoteDto>();
        note!.Id.Should().Be(createdNote.Id);
    }
}
