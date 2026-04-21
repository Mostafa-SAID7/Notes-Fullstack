# Architecture Refactor: Clean CQRS + MediatR + AutoMapper

## Overview

This document outlines the complete architectural refactor of the Notes API, implementing industry-standard patterns for maintainability, testability, and scalability.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Controllers (Thin)                         │
│  • Delegates all logic to MediatR                       │
│  • Returns IActionResult with DTOs                      │
│  • No business logic                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              MediatR Pipeline                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 1. ValidationBehavior (FluentValidation)         │   │
│  │    - Validates all commands/queries              │   │
│  │    - Throws ValidationException on failure       │   │
│  │                                                  │   │
│  │ 2. LoggingBehavior                               │   │
│  │    - Logs request start/completion               │   │
│  │    - Logs exceptions                             │   │
│  │                                                  │   │
│  │ 3. Handler Execution                             │   │
│  │    - Business logic                              │   │
│  │    - Data access via UoW                         │   │
│  │    - DTO mapping via AutoMapper                  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Command/Query Handlers                          │
│  • GetAllNotesHandler                                   │
│  • GetNoteByIdHandler                                   │
│  • CreateNoteHandler                                    │
│  • UpdateNoteHandler                                    │
│  • DeleteNoteHandler                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Unit of Work + Repositories                     │
│  • IUnitOfWork (transaction boundary)                   │
│  • INoteRepository (specific queries)                   │
│  • IRepository<T> (generic CRUD)                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Entity Framework Core                           │
│  • MyDbContext                                          │
│  • Database access & change tracking                    │
└─────────────────────────────────────────────────────────┘
```

---

## Design Patterns Implemented

### 1. **CQRS (Command Query Responsibility Segregation)**

Separates read and write operations into distinct command/query objects.

**Commands** (Write Operations):
- `CreateNoteCommand` → Creates a new note
- `UpdateNoteCommand` → Updates an existing note
- `DeleteNoteCommand` → Deletes a note

**Queries** (Read Operations):
- `GetAllNotesQuery` → Retrieves all notes
- `GetNoteByIdQuery` → Retrieves a single note

**Benefits:**
- Clear intent (command vs query)
- Easier to scale reads and writes independently
- Better for audit trails and event sourcing

### 2. **MediatR Pattern**

Implements the Mediator pattern for decoupled request handling.

```csharp
// Request
public sealed record CreateNoteCommand(string Title, string Desc) : IRequest<NoteDto>;

// Handler
public sealed class CreateNoteHandler(IUnitOfWork uow, IMapper mapper)
    : IRequestHandler<CreateNoteCommand, NoteDto>
{
    public async Task<NoteDto> Handle(CreateNoteCommand request, CancellationToken ct)
    {
        // Business logic here
    }
}

// Usage in Controller
var result = await mediator.Send(new CreateNoteCommand("Title", "Desc"));
```

**Benefits:**
- Decouples controllers from business logic
- Enables pipeline behaviors (validation, logging, etc.)
- Easier to test handlers in isolation
- Supports cross-cutting concerns

### 3. **Unit of Work Pattern**

Groups repositories under a single transaction boundary.

```csharp
public interface IUnitOfWork : IDisposable
{
    INoteRepository Notes { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
```

**Benefits:**
- Atomic transactions (all-or-nothing)
- Single `SaveChangesAsync()` call commits all changes
- Prevents partial updates
- Easier to manage database state

### 4. **Generic Repository Pattern**

Provides reusable CRUD operations for any entity.

```csharp
public interface IRepository<TEntity> where TEntity : class
{
    Task<IReadOnlyList<TEntity>> GetAllAsync();
    Task<TEntity?> GetByIdAsync(int id);
    Task AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Remove(TEntity entity);
}
```

**Benefits:**
- DRY (Don't Repeat Yourself)
- Consistent data access patterns
- Easy to swap implementations (e.g., for testing)

### 5. **AutoMapper for DTO Mapping**

Centralized, declarative mapping between domain models and DTOs.

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Note, NoteDto>();
        CreateMap<CreateNoteRequest, Note>();
        CreateMap<UpdateNoteRequest, Note>();
    }
}
```

**Benefits:**
- No manual mapping in handlers
- Consistent transformation logic
- Easy to maintain and test
- Reduces boilerplate code

### 6. **FluentValidation**

Declarative, fluent validation rules for commands.

```csharp
public class CreateNoteValidator : AbstractValidator<CreateNoteCommand>
{
    public CreateNoteValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");
    }
}
```

**Benefits:**
- Validation logic separated from handlers
- Reusable across multiple handlers
- Clear, readable validation rules
- Integrated with MediatR pipeline

### 7. **MediatR Pipeline Behaviors**

Cross-cutting concerns applied to all requests.

**ValidationBehavior:**
- Validates all commands/queries before handler execution
- Throws `ValidationException` on failure
- Logs validation errors

**LoggingBehavior:**
- Logs request start and completion
- Logs exceptions with context
- Useful for debugging and monitoring

**Benefits:**
- DRY (validation/logging applied everywhere)
- Consistent error handling
- Easy to add new behaviors (caching, authorization, etc.)

### 8. **Global Exception Handling Middleware**

Standardized error responses for all exceptions.

```csharp
public class ExceptionHandlingMiddleware
{
    // Catches all exceptions and returns standardized ErrorResponse
    // Handles ValidationException, KeyNotFoundException, etc.
}
```

**Benefits:**
- Consistent error format across API
- Prevents sensitive error details from leaking
- Centralized error logging
- Better client experience

---

## File Structure

```
notes-api/
├── Behaviors/
│   ├── ValidationBehavior.cs      # Validates all requests
│   └── LoggingBehavior.cs         # Logs all requests
├── Config/
│   ├── CorsConfig.cs
│   ├── DatabaseConfig.cs
│   ├── SwaggerConfig.cs
│   └── MappingProfile.cs          # AutoMapper profiles
├── Controllers/
│   └── NotesController.cs         # Thin controller using MediatR
├── Database/
│   ├── Models/
│   │   └── Note.cs
│   └── MyDbContext.cs
├── DTOs/
│   └── NoteDto.cs                 # Request/Response DTOs
├── Features/
│   └── Notes/
│       ├── CreateNote.cs          # Command + Handler
│       ├── CreateNoteValidator.cs
│       ├── GetAllNotes.cs         # Query + Handler
│       ├── GetNoteById.cs         # Query + Handler
│       ├── UpdateNote.cs          # Command + Handler
│       ├── UpdateNoteValidator.cs
│       ├── DeleteNote.cs          # Command + Handler
│       └── DeleteNoteValidator.cs
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs
├── Repositories/
│   ├── INoteRepository.cs
│   └── NoteRepository.cs
├── Common/
│   ├── IRepository.cs             # Generic repository interface
│   └── IUnitOfWork.cs
├── UnitOfWork/
│   └── UnitOfWork.cs
└── Program.cs                     # Service registration
```

---

## Service Registration (Program.cs)

```csharp
// MediatR - registers all handlers and behaviors
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

// AutoMapper - registers all profiles
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// FluentValidation - registers all validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
```

---

## Request Flow Example: Create Note

```
1. HTTP POST /api/notes
   {
     "title": "My Note",
     "desc": "Note description"
   }

2. NotesController.Create()
   → mediator.Send(new CreateNoteCommand("My Note", "Note description"))

3. MediatR Pipeline
   a) ValidationBehavior
      → CreateNoteValidator validates the command
      → If invalid, throws ValidationException
   
   b) LoggingBehavior
      → Logs: "Executing CreateNoteCommand"
   
   c) CreateNoteHandler.Handle()
      → Creates new Note entity
      → Calls uow.Notes.AddAsync(note)
      → Calls uow.SaveChangesAsync()
      → Maps Note → NoteDto using AutoMapper
      → Returns NoteDto

4. Response
   HTTP 201 Created
   Location: /api/notes/1
   {
     "id": 1,
     "title": "My Note",
     "desc": "Note description",
     "createdDate": "2024-04-21T10:30:00Z"
   }
```

---

## Error Handling Example

```
1. Invalid request
   POST /api/notes
   {
     "title": "",  // Empty title
     "desc": "Description"
   }

2. ValidationBehavior catches validation error
   → Throws ValidationException

3. ExceptionHandlingMiddleware catches it
   → Returns HTTP 400 Bad Request
   {
     "statusCode": 400,
     "message": "Validation failed",
     "errors": {
       "Title": [
         "Title is required.",
         "Title must not exceed 200 characters."
       ]
     },
     "timestamp": "2024-04-21T10:30:00Z"
   }
```

---

## Testing Strategy

### Unit Testing Handlers

```csharp
[Test]
public async Task CreateNoteHandler_WithValidCommand_ReturnsNoteDto()
{
    // Arrange
    var mockUow = new Mock<IUnitOfWork>();
    var mockMapper = new Mock<IMapper>();
    var handler = new CreateNoteHandler(mockUow.Object, mockMapper.Object);
    var command = new CreateNoteCommand("Title", "Desc");

    // Act
    var result = await handler.Handle(command, CancellationToken.None);

    // Assert
    Assert.NotNull(result);
    mockUow.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
}
```

### Integration Testing

```csharp
[Test]
public async Task CreateNote_WithValidRequest_Returns201Created()
{
    // Arrange
    var client = _factory.CreateClient();
    var request = new CreateNoteRequest("Title", "Desc");

    // Act
    var response = await client.PostAsJsonAsync("/api/notes", request);

    // Assert
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

---

## Future Enhancements

1. **Caching Behavior** - Add MediatR behavior for caching query results
2. **Authorization** - Add authorization checks in handlers or behaviors
3. **Audit Trail** - Log all mutations to an audit table
4. **Event Sourcing** - Store domain events instead of just state
5. **Soft Deletes** - Mark notes as deleted instead of removing them
6. **Pagination** - Add skip/take to GetAllNotesQuery
7. **Filtering** - Add search/filter capabilities to queries
8. **Notifications** - Publish domain events for external subscribers

---

## Key Takeaways

✅ **Separation of Concerns** - Each layer has a single responsibility
✅ **Testability** - Handlers can be tested in isolation
✅ **Maintainability** - Clear structure and patterns
✅ **Scalability** - Easy to add new features without modifying existing code
✅ **Consistency** - Validation, logging, and error handling applied uniformly
✅ **DRY** - No code duplication across handlers

This architecture provides a solid foundation for building scalable, maintainable APIs.
