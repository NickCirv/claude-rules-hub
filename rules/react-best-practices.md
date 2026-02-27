# React Best Practices

Component patterns, hooks rules, and state management conventions.

## Component Design

- **One component per file** — no co-located multiple exports
- **Under 200 lines per component** — extract if larger
- **Single responsibility** — component does one thing well
- **Props interface at the top** — always typed, no inline types in function signature

```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  // ...
}
```

## Hooks Rules

- Only call hooks at the top level — never inside conditions, loops, or callbacks
- Custom hooks must start with `use` and be extracted to their own file
- `useEffect` must list all dependencies — no empty arrays without a comment explaining why
- Prefer `useMemo`/`useCallback` only when profiling confirms a performance issue — not preemptively

```typescript
// WRONG
function Component() {
  if (condition) {
    const [state, setState] = useState(false) // conditional hook
  }
}

// CORRECT
function Component() {
  const [state, setState] = useState(false)
  if (condition) { /* use state */ }
}
```

## State Management

- **Local state first** — reach for `useState` before any global solution
- **Lift state** to the closest common ancestor — no prop drilling past 3 levels
- **Context for cross-cutting concerns** only (auth, theme, locale) — not for app state
- **Prefer URL state** for things that should survive refresh (filters, pagination, tabs)

## Event Handlers

- Name event handlers `handle<Event>` — `handleClick`, `handleSubmit`, `handleChange`
- Extract complex logic out of JSX — no multi-line arrow functions inline

```tsx
// WRONG
<button onClick={() => {
  doThing()
  doOtherThing()
  setState(x => x + 1)
}}>Click</button>

// CORRECT
function handleClick() {
  doThing()
  doOtherThing()
  setState(x => x + 1)
}

<button onClick={handleClick}>Click</button>
```

## Rendering

- Always provide `key` props in lists — use stable IDs, never array index for dynamic lists
- Conditional rendering: use `&&` for simple cases, ternary for if/else, extract component for complex
- Never inject raw HTML without sanitizing with DOMPurify first

## Performance

- Wrap expensive child components in `React.memo` only when props are stable and rerenders are measured
- Avoid creating new objects/arrays in render — move constants outside component or use `useMemo`
- Lazy load routes with `React.lazy` + `Suspense`

## File Conventions

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      index.ts        <- re-export only
  hooks/
    useAuth.ts
    useDebounce.ts
  pages/
    Home.tsx
  types/
    index.ts
```

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| `index` as list key | Stable unique ID |
| Inline object props style={{}} | CSS class or extracted constant |
| `any` for event types | `React.MouseEvent<HTMLButtonElement>` |
| Direct DOM manipulation | Refs via `useRef` |
| Derive state from props in effect | Compute during render |
| Multiple `useState` for related data | `useReducer` or single object |
