import { program } from 'commander'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { listPacks, searchPacks, getPack, readPackContent } from './registry.js'
import { installPack, removePack, listInstalled } from './installer.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'))

const ACCENT = chalk.hex('#7C3AED')
const DIM = chalk.dim
const SUCCESS = chalk.green
const ERROR = chalk.red
const WARN = chalk.yellow
const BOLD = chalk.bold

function printHeader() {
  console.log()
  console.log(ACCENT.bold('claude-rules-hub') + DIM(` v${pkg.version}`))
  console.log(DIM('Community rule packs for Claude Code'))
  console.log()
}

function tagBadge(tag) {
  return DIM(`[${tag}]`)
}

export function run() {
  program
    .name('claude-rules-hub')
    .description('Community rule packs for Claude Code')
    .version(pkg.version)

  program
    .command('list')
    .description('Browse all available rule packs')
    .option('-i, --installed', 'Show only installed packs')
    .action((opts) => {
      printHeader()

      const installed = listInstalled()

      if (opts.installed) {
        if (installed.length === 0) {
          console.log(WARN('No packs installed in .claude/rules/'))
          console.log(DIM('Run "claude-rules-hub install <name>" to get started.'))
          console.log()
          return
        }
        console.log(BOLD('Installed packs:\n'))
        for (const name of installed) {
          const pack = getPack(name)
          const desc = pack ? pack.description : 'Custom or external pack'
          console.log(`  ${SUCCESS('✔')} ${BOLD(name)}`)
          console.log(`    ${DIM(desc)}`)
          console.log()
        }
        return
      }

      const packs = listPacks()

      if (packs.length === 0) {
        console.log(WARN('No packs found.'))
        return
      }

      console.log(BOLD(`${packs.length} packs available:\n`))

      for (const pack of packs) {
        const isInstalled = installed.includes(pack.name)
        const status = isInstalled ? SUCCESS('✔ installed') : DIM('not installed')
        const tags = pack.tags.map(tagBadge).join(' ')

        console.log(`  ${ACCENT.bold(pack.name)} ${status}`)
        console.log(`  ${pack.description}`)
        console.log(`  ${tags}`)
        console.log()
      }

      console.log(DIM('Install with: claude-rules-hub install <name>'))
      console.log()
    })

  program
    .command('install <name>')
    .description('Install a rule pack to .claude/rules/')
    .action((name) => {
      printHeader()

      console.log(`Installing ${ACCENT.bold(name)}...`)
      console.log()

      const result = installPack(name)

      if (!result.success) {
        console.log(ERROR(`✘ ${result.error}`))
        console.log()
        process.exit(1)
      }

      const pack = getPack(name)

      console.log(SUCCESS(`✔ Installed successfully`))
      console.log()
      console.log(`  Pack: ${BOLD(name)}`)
      console.log(`  Path: ${DIM(result.path)}`)
      if (pack) {
        console.log(`  Desc: ${pack.description}`)
      }
      console.log()
      console.log(DIM('Claude Code will load this rule file in your next session.'))
      console.log()
    })

  program
    .command('remove <name>')
    .description('Remove an installed rule pack')
    .action((name) => {
      printHeader()

      console.log(`Removing ${ACCENT.bold(name)}...`)
      console.log()

      const result = removePack(name)

      if (!result.success) {
        console.log(ERROR(`✘ ${result.error}`))
        console.log()
        process.exit(1)
      }

      console.log(SUCCESS(`✔ Removed ${name}`))
      console.log(DIM('The rule file has been deleted from .claude/rules/'))
      console.log()
    })

  program
    .command('search <query>')
    .description('Search available rule packs by name, description, or tag')
    .action((query) => {
      printHeader()

      const results = searchPacks(query)

      if (results.length === 0) {
        console.log(WARN(`No packs found matching "${query}"`))
        console.log(DIM('Run "claude-rules-hub list" to see all available packs.'))
        console.log()
        return
      }

      const installed = listInstalled()

      console.log(BOLD(`${results.length} result(s) for "${query}":\n`))

      for (const pack of results) {
        const isInstalled = installed.includes(pack.name)
        const status = isInstalled ? SUCCESS('✔ installed') : DIM('not installed')
        const tags = pack.tags.map(tagBadge).join(' ')

        console.log(`  ${ACCENT.bold(pack.name)} ${status}`)
        console.log(`  ${pack.description}`)
        console.log(`  ${tags}`)
        console.log()
      }

      console.log(DIM(`Install with: claude-rules-hub install <name>`))
      console.log()
    })

  program
    .command('info <name>')
    .description('Show details and preview a rule pack')
    .action((name) => {
      printHeader()

      const pack = getPack(name)

      if (!pack) {
        console.log(ERROR(`✘ Pack "${name}" not found.`))
        console.log(DIM('Run "claude-rules-hub list" to see available packs.'))
        console.log()
        process.exit(1)
      }

      const installed = listInstalled().includes(name)
      const status = installed ? SUCCESS('✔ installed') : DIM('not installed')

      console.log(BOLD(`${pack.name}`) + '  ' + status)
      console.log()
      console.log(`  ${pack.description}`)
      console.log(`  Tags:   ${pack.tags.map(tagBadge).join(' ')}`)
      console.log(`  Author: ${DIM(pack.author)}`)
      console.log()
      console.log(DIM('─'.repeat(60)))
      console.log()

      const content = readPackContent(name)
      if (content) {
        const lines = content.split('\n')
        const preview = lines.slice(0, 30).join('\n')
        console.log(preview)
        if (lines.length > 30) {
          console.log()
          console.log(DIM(`... (${lines.length - 30} more lines)`))
        }
      }

      console.log()
      if (!installed) {
        console.log(DIM(`Install with: claude-rules-hub install ${name}`))
      }
      console.log()
    })

  program.parse()
}
