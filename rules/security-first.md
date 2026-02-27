# Security First

OWASP top 10 rules, input validation, secret handling, and injection prevention.

## Secret Handling (CRITICAL)

- **NEVER** hardcode secrets, API keys, passwords, or tokens in code
- **NEVER** log secrets or include them in error messages
- **NEVER** commit `.env` files — add to `.gitignore` immediately
- Load secrets from environment variables or a secrets manager only

```typescript
// WRONG
const apiKey = 'sk-abc123...'
const db = new DB({ password: 'hunter2' })

// CORRECT
const apiKey = process.env.API_KEY
if (!apiKey) throw new Error('API_KEY environment variable is required')
const db = new DB({ password: process.env.DB_PASSWORD })
```

## Input Validation

- Validate ALL external input at the boundary — API requests, CLI args, file uploads, webhooks
- Whitelist allowed values — never blacklist
- Use a schema validation library (Zod, Joi, Yup) — never hand-roll validators
- Reject input that fails validation immediately — do not attempt to sanitize and proceed

```typescript
import { z } from 'zod'

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(13).max(120),
  role: z.enum(['user', 'admin']),
})

export function createUser(input: unknown) {
  const data = CreateUserSchema.parse(input) // throws ZodError if invalid
  // ...
}
```

## SQL Injection Prevention

- **NEVER** concatenate user input into SQL strings
- Always use parameterized queries or an ORM
- Never expose raw database errors to clients

```typescript
// WRONG
const query = `SELECT * FROM users WHERE email = '${email}'`

// CORRECT
const query = 'SELECT * FROM users WHERE email = $1'
const result = await db.query(query, [email])
```

## Authentication & Authorization

- Hash passwords with bcrypt, Argon2, or scrypt — never MD5, SHA1, or plain SHA256
- Use short-lived JWTs (15-60 min access tokens, refresh tokens separately)
- Validate authorization on EVERY request — never trust client-side roles
- Implement rate limiting on auth endpoints

## HTTP Security Headers

Set these headers on all responses:
- `Content-Security-Policy` — restrict script/style sources
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HTTPS only)
- `Referrer-Policy: strict-origin-when-cross-origin`

## Error Messages

- Never expose stack traces, file paths, or database errors to clients
- Return generic messages to users: "Something went wrong"
- Log full details server-side with a correlation ID

```typescript
// WRONG
res.status(500).json({ error: err.stack })

// CORRECT
const correlationId = crypto.randomUUID()
logger.error({ correlationId, error: err }, 'Request failed')
res.status(500).json({ error: 'Request failed', correlationId })
```

## Dependency Security

- Run `npm audit` / `pip audit` / `cargo audit` in CI
- Pin dependency versions in lockfiles
- Review third-party packages before installing — check download count, maintainer, last update
- Never install a package just because a tutorial says to

## File Upload Security

- Validate file type by magic bytes, not extension
- Store uploads outside the web root
- Scan uploads for malware in sensitive contexts
- Set a maximum file size

## Code Execution Prevention

- Never dynamically execute strings as code (e.g. using runtime code evaluation functions)
- Use JSON.parse() for data, never string-based code evaluation
- Sanitize any user input that might reach template engines or expression parsers

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| Hardcoded secrets | Environment variables |
| String-built SQL | Parameterized queries |
| Dynamic code execution on user input | JSON.parse() or a proper parser |
| Disabled CORS (`*`) in production | Explicit origin allowlist |
| MD5/SHA1 for passwords | bcrypt / Argon2 |
| Trust client-sent user IDs | Verify from auth token |
