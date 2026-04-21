using FluentAssertions;
using Moq;
using NotesApi.Common;
using NotesApi.Database.Models;
using NotesApi.DTOs;
using NotesApi.Features.Notes;
using NotesApi.Repositories;
using AutoMapper;
using Xunit;

namespace NotesApi.Tests.Unit.Features.Notes;

public class CreateNoteHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<INoteRepository> _mockNoteRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly CreateNoteHandler _handler;

    public CreateNoteHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockNoteRepository = new Mock<INoteRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockUnitOfWork.Setup(u => u.Notes).Returns(_mockNoteRepository.Object);
        _handler = new CreateNoteHandler(_mockUnitOfWork.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task Handle_WithValidCommand_CreatesNoteAndReturnsDto()
    {
        // Arrange
        var command = new CreateNoteCommand("Test Note", "Test Description");
        var createdNote = new Note { Id = 1, Title = "Test Note", Desc = "Test Description", CreatedDate = DateTime.UtcNow };
        var expectedDto = new NoteDto(1, "Test Note", "Test Description", DateTime.UtcNow);

        _mockNoteRepository.Setup(r => r.AddAsync(It.IsAny<Note>()))
            .Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        _mockMapper.Setup(m => m.Map<NoteDto>(It.IsAny<Note>()))
            .Returns(expectedDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Test Note");
        result.Desc.Should().Be("Test Description");
        _mockNoteRepository.Verify(r => r.AddAsync(It.IsAny<Note>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithValidCommand_CallsRepositoryAndSavesChanges()
    {
        // Arrange
        var command = new CreateNoteCommand("Valid Title", "Test Description");
        var createdNote = new Note { Id = 1, Title = "Valid Title", Desc = "Test Description", CreatedDate = DateTime.UtcNow };
        var expectedDto = new NoteDto(1, "Valid Title", "Test Description", DateTime.UtcNow);

        _mockNoteRepository.Setup(r => r.AddAsync(It.IsAny<Note>()))
            .Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        _mockMapper.Setup(m => m.Map<NoteDto>(It.IsAny<Note>()))
            .Returns(expectedDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Valid Title");
        _mockNoteRepository.Verify(r => r.AddAsync(It.IsAny<Note>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
