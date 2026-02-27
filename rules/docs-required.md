# Docs Required

JSDoc/docstrings on public APIs, README updates, and inline documentation standards.

## The Rule

If someone can call it from outside the file, it must be documented.
No exceptions for "obvious" functions — what seems obvious to you is not obvious to future you.

## JSDoc (JavaScript/TypeScript)

All exported functions, classes, types, and constants require JSDoc.

```typescript
/**
 * Calculates the final price after applying the user's discount tier.
 *
 * @param price - The base price in the smallest currency unit (e.g. cents)
 * @param user - The user object. Must have a valid `tier` field.
 * @returns The discounted price in the same unit as `price`.
 * @throws {RangeError} If `price` is negative.
 *
 * @example
 * const total = applyDiscount(1000, { tier: 'premium' })
 * // Returns 850 (15% discount)
 */
export function applyDiscount(price: number, user: User): number {
  if (price < 0) throw new RangeError('price must be non-negative')
  const rate = DISCOUNT_RATES[user.tier] ?? 0
  return Math.round(price * (1 - rate))
}
```

## Python Docstrings

Use Google-style docstrings for all public functions, classes, and modules.

```python
def send_notification(user_id: str, message: str, channel: str = "email") -> bool:
    """Send a notification to a user via the specified channel.

    Args:
        user_id: The unique identifier of the target user.
        message: The notification body text. Max 500 characters.
        channel: Delivery channel. One of "email", "sms", or "push".
            Defaults to "email".

    Returns:
        True if the notification was delivered, False if it was queued
        for retry due to a transient error.

    Raises:
        ValueError: If channel is not one of the allowed values.
        UserNotFoundError: If no user exists with the given user_id.
    """
```

## README Updates (Mandatory)

Update the README whenever:
- A new command or CLI flag is added
- A new environment variable is required
- The installation process changes
- A breaking change is made

README must always contain:
1. What this project does (1-2 sentences)
2. Prerequisites
3. Installation steps that actually work
4. Usage examples with real commands
5. Environment variables table (name, required, description, default)
6. How to run tests

## Inline Comments

Use inline comments sparingly — for the WHY, not the WHAT.

```typescript
// WRONG — describes what the code does, visible from reading it
const result = items.filter(x => x.active) // filter active items

// CORRECT — explains a non-obvious decision
// Use 15 minutes instead of the standard 30 to reduce session hijack window
const SESSION_TIMEOUT_MS = 15 * 60 * 1000
```

## Changelog

Maintain a `CHANGELOG.md` following Keep a Changelog format:

```markdown
## [1.2.0] - 2026-02-27

### Added
- `--dry-run` flag for safe execution without side effects

### Changed
- Rate limit increased from 100 to 500 requests per minute

### Fixed
- Crash when `config.json` is missing on first run
```

## What Does NOT Need Docs

- Private/internal helpers (prefixed with `_` in Python, unexported in JS)
- Test helper functions inside test files
- One-liner utilities where the name is completely self-explanatory

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| `// TODO: add docs` | Write the docs now |
| Docs that restate the function name | Explain intent and behaviour |
| Outdated examples that don't run | Test examples in CI |
| Missing `@throws` / `Raises` | Document all exceptions |
| README with hardcoded version numbers | Use version placeholders |
| No environment variables table | Always document required env vars |
