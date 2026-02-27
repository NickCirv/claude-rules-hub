# API Design

REST conventions, error responses, pagination, and versioning standards.

## URL Structure

- Use **nouns**, not verbs — resources are things, not actions
- **Plural** resource names: `/users`, `/orders`, `/products`
- Nested resources for owned relationships (max 2 levels deep)
- **kebab-case** for multi-word resource names

```
GET    /users              → list users
POST   /users              → create user
GET    /users/:id          → get user
PATCH  /users/:id          → partial update
DELETE /users/:id          → delete user
GET    /users/:id/orders   → user's orders (max 2 levels)
```

## HTTP Methods

| Method | Action | Idempotent | Body |
|--------|--------|-----------|------|
| GET | Read | Yes | No |
| POST | Create | No | Yes |
| PUT | Replace | Yes | Yes |
| PATCH | Partial update | No | Yes |
| DELETE | Remove | Yes | No |

## Status Codes

Use the correct status code — no 200 for errors, no 500 for validation failures.

| Code | When |
|------|------|
| 200 | Success with body |
| 201 | Resource created |
| 204 | Success, no body (DELETE) |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate, version mismatch) |
| 422 | Unprocessable entity (semantic errors) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## Error Response Format

All errors must return a consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

## Pagination

Use cursor-based pagination for large or frequently-updated datasets, offset-based for simple admin views.

```json
// Response
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true,
    "total": 1247
  }
}

// Request (cursor)
GET /users?cursor=eyJpZCI6MTAwfQ==&limit=20

// Request (offset)
GET /users?page=3&limit=20
```

## Versioning

- Version via URL path: `/v1/`, `/v2/`
- Never break existing endpoints — add new versions instead
- Maintain old versions for at least 6 months after deprecation
- Add `Deprecation` and `Sunset` headers when phasing out

## Request & Response Bodies

- **Always JSON** — set `Content-Type: application/json`
- **camelCase** for JSON keys (not snake_case, not PascalCase)
- **ISO 8601** for all dates and timestamps: `2026-02-27T14:30:00Z`
- **Wrap responses** in a `data` key for single resources

```json
// Single resource
{ "data": { "id": "usr_123", "email": "user@example.com" } }

// Collection
{ "data": [...], "pagination": { ... } }
```

## Filtering & Sorting

- Filtering via query params: `GET /users?status=active&role=admin`
- Sorting: `GET /users?sort=createdAt&order=desc`
- Field selection: `GET /users?fields=id,email,name`

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| `/getUsers` | `GET /users` |
| 200 with `{ error: "not found" }` | `404 Not Found` |
| No pagination on lists | Always paginate; max 100 per page |
| Breaking changes on same version | New version path |
| Different error shapes per endpoint | Single error schema |
| Exposing internal IDs | Use public UUIDs or slugs |
