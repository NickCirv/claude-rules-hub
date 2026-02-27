# Python Clean

PEP 8 compliance, type hints, docstrings, and pytest patterns.

## Type Hints (Mandatory)

- All function signatures must have type annotations — parameters and return types
- Use `from __future__ import annotations` for forward references
- Use `typing` module types for complex types: `Optional`, `Union`, `TypeVar`, `Protocol`
- Prefer `X | None` over `Optional[X]` (Python 3.10+)

```python
# WRONG
def process(data, timeout=30):
    return data

# CORRECT
def process(data: dict[str, str], timeout: int = 30) -> list[str]:
    return list(data.values())
```

## Docstrings

- Every public function, class, and module must have a docstring
- Use Google-style docstrings

```python
def calculate_total(items: list[dict], tax_rate: float = 0.1) -> float:
    """Calculate the total cost including tax.

    Args:
        items: List of dicts with 'price' and 'quantity' keys.
        tax_rate: Tax rate as a decimal. Defaults to 0.1 (10%).

    Returns:
        Total cost including tax.

    Raises:
        ValueError: If tax_rate is negative.
    """
    if tax_rate < 0:
        raise ValueError(f"tax_rate must be non-negative, got {tax_rate}")
    subtotal = sum(item['price'] * item['quantity'] for item in items)
    return subtotal * (1 + tax_rate)
```

## PEP 8 Rules

- Lines under 88 characters (Black formatter limit)
- 2 blank lines between top-level definitions
- 1 blank line between methods inside a class
- No trailing whitespace
- Imports: stdlib → third-party → local, separated by blank lines

## Error Handling

- Never use bare `except:` — always specify the exception type
- Log exceptions with context before re-raising
- Use custom exception classes for domain errors

```python
# WRONG
try:
    result = risky()
except:
    pass

# CORRECT
try:
    result = risky()
except ValueError as err:
    logger.error("Invalid value during processing: %s", err)
    raise
```

## Naming

- `snake_case` for functions, variables, modules
- `PascalCase` for classes
- `SCREAMING_SNAKE_CASE` for module-level constants
- Private: single underscore prefix `_internal`
- No abbreviations unless universally understood (`url`, `id`, `http`)

## Pytest Patterns

- Test files: `test_<module>.py`
- Test functions: `test_<what>_<condition>_<expected>()`
- Use fixtures for setup/teardown — no `setUp`/`tearDown`
- Parametrize for multiple inputs — no copy-paste test cases

```python
import pytest

@pytest.fixture
def sample_user():
    return {"id": "1", "email": "test@example.com"}

@pytest.mark.parametrize("email,valid", [
    ("user@example.com", True),
    ("not-an-email", False),
    ("", False),
])
def test_validate_email_returns_correct_result(email: str, valid: bool) -> None:
    assert validate_email(email) == valid

def test_process_user_raises_when_email_missing(sample_user: dict) -> None:
    del sample_user["email"]
    with pytest.raises(ValueError, match="email is required"):
        process_user(sample_user)
```

## Anti-Patterns

| Never | Do Instead |
|-------|-----------|
| `except:` bare | `except SpecificError as err:` |
| Mutable default args `def f(x=[])` | `def f(x=None): x = x or []` |
| String concatenation in loops | `"".join(parts)` or f-strings |
| `import *` | Explicit named imports |
| Magic numbers | Named constants |
| `print()` in production | `logging` module |
