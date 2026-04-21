using FluentAssertions;
using Moq;
using NotesApi.Common;
using NotesApi.Database;
using NotesApi.DTOs;
using NotesApi.Features.Notes;
using NotesApi.Repositories;
using Xunit;

namespace NotesApi.Tests.Unit.Features.Notes;

public class CreateNoteHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<INoteRepository> _mockNoteRepository;
    private readonly CreateNoteHandler _handler;

    public CreateNoteHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockNoteRepository = new Mock<INoteRepository>();
        _mockUnitOfWork.Setup(u => u.Notes).Returns(_mockNoteRepository.Object);
        _handler = new CreateNoteHandler(_mockUnitOfWork.Object);
    }

    [Fact]
    public async Task Handle_WithValidCommand_CreatesNoteAndReturnsDto()
    {
        // Arrange
        var command = new CreateNoteCommand { Title = "Test Note", Description = "Test Description" };
        var createdNote = new Note { Id = 1, Title = "Test Note", Desc = "Test Description", CreatedDate = DateTime.UtcNow };

        _mockNoteRepository.Setup(r => r.AddAsync(It.IsAny<Note>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(createdNote);
        _mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Test Note");
        result.Desc.Should().Be("Test Description");
        _mockNoteRepository.Verify(r => r.AddAsync(It.IsAny<Note>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithEmptyTitle_ThrowsValidationException()
    {
        // Arrange
        var command = new CreateNoteCommand { Title = "", Description = "Test Description" };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));
    }
}
