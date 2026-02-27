import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readdirSync, readFileSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RULES_DIR = join(__dirname, '..', 'rules')

const PACK_META = {
  'typescript-strict': {
    description: 'Strict TypeScript — no any, proper error handling, immutable patterns',
    tags: ['typescript', 'strict', 'immutability'],
    author: 'claude-rules-hub',
  },
  'react-best-practices': {
    description: 'React hooks rules, component patterns, state management conventions',
    tags: ['react', 'hooks', 'frontend', 'javascript'],
    author: 'claude-rules-hub',
  },
  'python-clean': {
    description: 'PEP 8 compliance, type hints, docstrings, pytest patterns',
    tags: ['python', 'pep8', 'testing', 'types'],
    author: 'claude-rules-hub',
  },
  'security-first': {
    description: 'OWASP rules, input validation, secret handling, injection prevention',
    tags: ['security', 'owasp', 'validation', 'secrets'],
    author: 'claude-rules-hub',
  },
  'tdd-workflow': {
    description: 'Test-first development, red/green/refactor cycle, coverage requirements',
    tags: ['tdd', 'testing', 'coverage', 'workflow'],
    author: 'claude-rules-hub',
  },
  'api-design': {
    description: 'REST conventions, error responses, pagination, versioning standards',
    tags: ['api', 'rest', 'design', 'backend'],
    author: 'claude-rules-hub',
  },
  'docs-required': {
    description: 'JSDoc/docstrings on public APIs, README updates, inline documentation',
    tags: ['documentation', 'jsdoc', 'readme'],
    author: 'claude-rules-hub',
  },
  'minimal': {
    description: 'Bare minimum rules — clean code, no console.logs, no hardcoded secrets',
    tags: ['minimal', 'basics', 'starter'],
    author: 'claude-rules-hub',
  },
}

export function listPacks() {
  if (!existsSync(RULES_DIR)) {
    return []
  }

  const files = readdirSync(RULES_DIR).filter(f => f.endsWith('.md'))

  return files.map(file => {
    const name = file.replace('.md', '')
    const meta = PACK_META[name] || {
      description: 'No description available',
      tags: [],
      author: 'unknown',
    }

    return {
      name,
      ...meta,
      filename: file,
      path: join(RULES_DIR, file),
    }
  })
}

export function getPack(name) {
  const packs = listPacks()
  return packs.find(p => p.name === name) || null
}

export function searchPacks(query) {
  const q = query.toLowerCase()
  return listPacks().filter(pack => {
    return (
      pack.name.toLowerCase().includes(q) ||
      pack.description.toLowerCase().includes(q) ||
      pack.tags.some(t => t.toLowerCase().includes(q))
    )
  })
}

export function readPackContent(name) {
  const pack = getPack(name)
  if (!pack) return null
  return readFileSync(pack.path, 'utf-8')
}
