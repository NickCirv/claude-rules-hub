# Minimal

Bare minimum rules for any project. Clean code, no debug artifacts, no hardcoded secrets.

## The Non-Negotiables

These apply to every project, every language, every file size.

### No Debug Artifacts

Remove before committing:
- `console.log`, `console.error`, `console.warn` statements left over from debugging
- `print()` debug statements in Python
- `debugger;` statements
- Commented-out code blocks

```javascript
// WRONG — left in after debugging
console.log('user data:', user)
const result = processUser(user)
// console.log('old approach', legacyProcess(user))

// CORRECT
const result = processUser(user)
```

### No Hardcoded Secrets

Never commit secrets to version control:
- API keys
- Passwords
- Database connection strings with credentials
- Private tokens

Use environment variables instead. Add `.env` to `.gitignore` before the first commit.

```
# .env (never committed)
DATABASE_URL=postgres://user:pass@localhost/mydb
API_KEY=sk-abc123

# .env.example (committed — shows required vars, no values)
DATABASE_URL=
API_KEY=
```

### No Hardcoded Magic Numbers

Give numbers names:

```javascript
// WRONG
if (retries > 3) { ... }
const timeout = 30000

// CORRECT
const MAX_RETRIES = 3
const REQUEST_TIMEOUT_MS = 30_000

if (retries > MAX_RETRIES) { ... }
```

### Read Files Before Editing

Never propose changes to code you haven't read. Always read the current file first.

### Error Handling

Don't swallow errors silently:

```javascript
// WRONG
try {
  await riskyOperation()
} catch (err) {
  // nothing
}

// CORRECT
try {
  await riskyOperation()
} catch (err) {
  logger.error('Operation failed:', err)
  throw err
}
```

### Meaningful Names

- Variables: what they hold (`userEmail`, not `x` or `data`)
- Functions: what they do (`getUserById`, not `get` or `fetch`)
- Booleans: questions (`isActive`, `hasPermission`, not `active`, `permission`)

### Small Functions

Functions over 50 lines should be split. If a function does more than one thing, it should be two functions.

### Git Hygiene

- Commit messages: imperative mood, under 72 chars (`Add login endpoint`, not `added login stuff`)
- One logical change per commit
- Never commit directly to `main` — use branches

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| `var` in JavaScript | `const` or `let` |
| Generic names (`data`, `info`, `temp`) | Descriptive names |
| Hardcoded localhost URLs | Environment variables |
| TODO comments without issue references | Create an issue, link it |
| 500-line files | Split into modules |
| Copy-paste code blocks | Extract a function |
