import { existsSync, mkdirSync, copyFileSync, unlinkSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { getPack, readPackContent } from './registry.js'
import { writeFileSync } from 'fs'

function getRulesDir() {
  const cwd = process.cwd()
  return join(cwd, '.claude', 'rules')
}

function ensureRulesDir() {
  const dir = getRulesDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

export function installPack(name) {
  const pack = getPack(name)
  if (!pack) {
    return { success: false, error: `Pack "${name}" not found. Run "claude-rules-hub list" to see available packs.` }
  }

  const rulesDir = ensureRulesDir()
  const destPath = join(rulesDir, `${name}.md`)

  if (existsSync(destPath)) {
    return { success: false, error: `Pack "${name}" is already installed. Use "remove" first to reinstall.` }
  }

  try {
    copyFileSync(pack.path, destPath)
    return { success: true, path: destPath }
  } catch (err) {
    return { success: false, error: `Failed to install: ${err.message}` }
  }
}

export function removePack(name) {
  const rulesDir = getRulesDir()
  const destPath = join(rulesDir, `${name}.md`)

  if (!existsSync(destPath)) {
    return { success: false, error: `Pack "${name}" is not installed in .claude/rules/.` }
  }

  try {
    unlinkSync(destPath)
    return { success: true }
  } catch (err) {
    return { success: false, error: `Failed to remove: ${err.message}` }
  }
}

export function listInstalled() {
  const rulesDir = getRulesDir()

  if (!existsSync(rulesDir)) {
    return []
  }

  return readdirSync(rulesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
}
