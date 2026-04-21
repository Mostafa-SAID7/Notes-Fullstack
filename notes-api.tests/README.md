# Backend Tests

This directory contains all backend tests organized by type.

## Structure

- `Unit/` - Unit tests for individual services, repositories, and handlers
- `Integration/` - Integration tests using WebApplicationFactory
- `Fixtures/` - Test fixtures and mock data

## Running Tests

```bash
# Run all tests
dotnet test

# Run tests with verbose output
dotnet test --verbosity detailed

# Run specific test class
dotnet test --filter "ClassName"

# Run with code coverage
dotnet test /p:CollectCoverage=true
```

## Test Frameworks

- **xUnit** - Test framework
- **Moq** - Mocking library
- **FluentAssertions** - Assertion library
- **WebApplicationFactory** - Integration testing
