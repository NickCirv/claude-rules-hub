# TDD Workflow

Test-first development, red/green/refactor cycle, and coverage requirements.

## The Cycle (MANDATORY)

Every feature and bug fix follows this exact sequence:

```
RED   → Write a failing test that defines the desired behaviour
GREEN → Write the minimum code to make the test pass
REFACTOR → Clean up without breaking tests
```

Never write production code without a failing test first. No exceptions.

## Test File Conventions

- Test files live next to the code they test: `user.ts` → `user.test.ts`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`
- One `describe` block per module/class
- Group related tests in nested `describe` blocks

## Naming Tests

Use the format: `it('should <expected behaviour> when <condition>')`

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should return the created user when valid data is provided', async () => { ... })
    it('should throw ValidationError when email is missing', async () => { ... })
    it('should throw ConflictError when email already exists', async () => { ... })
  })
})
```

## What to Test

- **Happy path** — valid input produces expected output
- **Edge cases** — empty arrays, zero values, very large inputs, boundary values
- **Error paths** — invalid input, network failure, missing dependencies
- **Side effects** — database writes, external API calls, event emissions

## Coverage Requirements

- Minimum 80% line coverage for all new code
- 100% coverage for utility functions and pure business logic
- Never disable coverage requirements — fix the gaps instead

```bash
# Run with coverage (vitest)
vitest run --coverage

# Run with coverage (jest)
jest --coverage --coverageThreshold='{"global":{"lines":80}}'
```

## Test Isolation

- Each test must be independent — no shared mutable state between tests
- Use `beforeEach` to reset state, not `before`/`after` for setup that could leak
- Mock external dependencies (databases, APIs, file system) in unit tests
- Never hit real external services in unit or integration tests

```typescript
// Mock external service
vi.mock('./emailService', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}))
```

## Arrange-Act-Assert

Structure every test with clear AAA sections:

```typescript
it('should calculate discount correctly for premium users', () => {
  // Arrange
  const user = createUser({ tier: 'premium' })
  const cart = createCart({ subtotal: 100 })

  // Act
  const total = calculateTotal(cart, user)

  // Assert
  expect(total).toBe(85) // 15% premium discount
})
```

## Avoiding Test Smells

- No `sleep` or `setTimeout` in tests — use fake timers or await promises properly
- No tests that depend on execution order
- No assertions on implementation details — test behaviour, not internals
- No overly specific mocks that break when implementation changes

## Red Phase Discipline

When writing the failing test:
1. Run it — confirm it fails for the RIGHT reason (not a syntax error)
2. The failure message should clearly describe what is missing
3. Do not write more than one failing test at a time

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| Write code then tests | Write failing test first |
| Test implementation details | Test observable behaviour |
| Skip tests that are hard to write | Refactor code to be testable |
| `it.skip` without a TODO | Fix or delete the test |
| Assertions without messages | Add `.toThrow('specific message')` |
| One massive test | Many small focused tests |
