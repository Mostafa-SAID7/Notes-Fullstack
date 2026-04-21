# Frontend Tests

This directory contains all frontend tests organized by type.

## Structure

- `unit/` - Unit tests for individual components, hooks, and utilities
- `integration/` - Integration tests for features and workflows
- `e2e/` - End-to-end tests using Playwright

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui
```

## Test Frameworks

- **Jest + React Testing Library** - Unit and integration tests
- **Playwright** - End-to-end tests
- **Vitest** - Test runner (Jest-compatible)
