# TypeScript Strict

Enforce strict TypeScript standards. No escape hatches.

## Type Safety

- **No `any`** — use `unknown` and narrow with type guards
- **No non-null assertions (`!`)** — handle null/undefined explicitly
- **No type casting with `as`** unless absolutely unavoidable (document why)
- Enable `strict: true` in tsconfig — all flags on

```typescript
// WRONG
function process(data: any) { ... }
const value = map.get(key)!

// CORRECT
function process(data: unknown) {
  if (typeof data === 'string') { ... }
}
const value = map.get(key)
if (value === undefined) throw new Error('Key not found')
```

## Immutability

- NEVER mutate objects or arrays — always spread or use structuredClone
- Prefer `readonly` arrays: `ReadonlyArray<T>` or `readonly T[]`
- Mark object properties `readonly` when they must not change

```typescript
// WRONG
function updateUser(user: User, name: string) {
  user.name = name
  return user
}

// CORRECT
function updateUser(user: User, name: string): User {
  return { ...user, name }
}
```

## Error Handling

- Always type catch blocks: `catch (err) { if (err instanceof Error) ... }`
- Never swallow errors silently
- Return `Result<T, E>` types for expected failures rather than throwing

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

## Function Standards

- Functions under 50 lines
- Single responsibility per function
- Explicit return types on all public functions
- Use function overloads for polymorphic behaviour

## Import Discipline

- No barrel files that re-export everything (`index.ts` dump)
- Import only what you use — no wildcard imports (`import *`)
- Group: external, internal, relative — separated by blank lines

## Naming

- Interfaces: PascalCase, no `I` prefix (`User`, not `IUser`)
- Types: PascalCase (`ApiResponse`, not `apiResponse`)
- Enums: PascalCase, string values are SCREAMING_SNAKE_CASE
- Generic params: descriptive (`TItem`, `TKey`) not single letters (`T`, `U`)

## Validation at Boundaries

- Validate all external input (API requests, env vars, user input) with Zod
- Never trust data from outside the process — parse, don't cast

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
})

type User = z.infer<typeof UserSchema>
```

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| `any` | `unknown` + type guard |
| `ts-ignore` | Fix the actual type issue |
| `Object` type | Specific interface or `Record<K, V>` |
| Optional chaining everywhere | Explicit null handling |
| `console.log` in production | Structured logging |
