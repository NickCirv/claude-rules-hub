<div align="center">

# claude-rules-hub

**Shareable rule packs for Claude Code — install coding standards in one command.**

[![License: MIT](https://img.shields.io/badge/License-MIT-0B0A09?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-0B0A09?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)

</div>

## Install

```bash
npx github:NickCirv/claude-rules-hub list
```

No config, no API key, no sign-up. Rules are bundled — works offline.

## Usage

```bash
# Browse all available packs
npx github:NickCirv/claude-rules-hub list

# Install a pack to .claude/rules/
npx github:NickCirv/claude-rules-hub install typescript-strict

# Remove an installed pack
npx github:NickCirv/claude-rules-hub remove typescript-strict

# Search by name or tag
npx github:NickCirv/claude-rules-hub search <query>

# Preview pack content before installing
npx github:NickCirv/claude-rules-hub info <name>

# List only installed packs
npx github:NickCirv/claude-rules-hub list --installed
```

## Available Packs

| Pack | Description |
|------|-------------|
| `typescript-strict` | No `any`, immutable patterns, proper error handling |
| `react-best-practices` | Hooks rules, component patterns, state management |
| `python-clean` | PEP 8, type hints, Google docstrings, pytest patterns |
| `security-first` | OWASP top 10, input validation, secret handling |
| `tdd-workflow` | Test-first, red/green/refactor, 80% coverage requirement |
| `api-design` | REST conventions, error responses, pagination, versioning |
| `docs-required` | JSDoc on public APIs, README and changelog discipline |
| `minimal` | No debug artifacts, no hardcoded secrets, clean code |

## What it does

Installs rule files into `.claude/rules/<name>.md` in your current project directory. Claude Code automatically loads every `.md` file in `.claude/rules/` at session start — so once installed, the pack silently shapes Claude's behaviour for that project. Like ESLint configs, but for AI coding conventions.

```
your-project/
  .claude/
    rules/
      typescript-strict.md   ← installed by claude-rules-hub
      tdd-workflow.md        ← installed by claude-rules-hub
```

---
<sub>Node ≥18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
