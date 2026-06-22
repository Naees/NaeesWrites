#!/usr/bin/env node
/**
 * Auto-tagging script for NaeesWrites blog posts.
 * 
 * Scans all posts in src/content/posts/ and suggests tags based on
 * heuristic keyword matching. Outputs suggestions to dist/.auto-tags.json.
 * 
 * Usage:
 *   npm run auto-tag       — show suggestions only (non-destructive)
 *   npm run auto-tag -- -y — accept all suggestions and update frontmatter
 * 
 * Run interactively to accept/skip per post.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { suggestTags, TAG_KEYWORD_MAP } from '../src/lib/utils.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsDir = join(__dirname, '..', 'src', 'content', 'posts')
const distDir = join(__dirname, '..', 'dist')

interface PostSuggestion {
  file: string
  title: string
  existing: string[]
  suggested: string[]
  combined: string[]
}

function readPostYaml(filePath: string): { frontmatter: Record<string, unknown>, body: string } {
  const content = readFileSync(filePath, 'utf-8')
  const separatorPos = content.indexOf('---', 3)
  if (separatorPos === -1) {
    throw new Error(`Could not find frontmatter separator in ${filePath}`)
  }
  const fmStr = content.substring(3, separatorPos)
  const body = content.substring(separatorPos + 3)

  // Simple YAML frontmatter parser for our use case
  const frontmatter: Record<string, unknown> = {}
  const lines = fmStr.trim().split('\n')
  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.substring(0, colonIdx).trim()
    let value = line.substring(colonIdx + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      // Array: ["tag1", "tag2"]
      const inner = value.substring(1, value.length - 1)
      frontmatter[key] = inner
        .split(',')
        .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (value.startsWith('"') && value.endsWith('"')) {
      frontmatter[key] = value.substring(1, value.length - 1)
    } else if (value.startsWith("'") && value.endsWith("'")) {
      frontmatter[key] = value.substring(1, value.length - 1)
    } else {
      frontmatter[key] = value
    }
  }

  return { frontmatter, body }
}

function writePostYaml(filePath: string, frontmatter: Record<string, unknown>, body: string): void {
  let fmStr = ''
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      fmStr += `${key}: [${value.map((v: string) => `"${v}"`).join(', ')}]\n`
    } else {
      fmStr += `${key}: ${value}\n`
    }
  }

  const newContent = `---\n${fmStr}---\n${body}`
  writeFileSync(filePath, newContent, 'utf-8')
}

function getPostFiles(): string[] {
  const files = readdirSync(postsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .sort()
  return files.map(f => join(postsDir, f))
}

function main() {
  const args = process.argv.slice(2)
  const yesFlag = args.includes('-y')
  const isPrebuild = args.includes('--prebuild')

  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true })
  }

  const postFiles = getPostFiles()
  const suggestions: PostSuggestion[] = []

  for (const filePath of postFiles) {
    const { frontmatter, body } = readPostYaml(filePath)
    const title = String(frontmatter.title || '')
    const description = String(frontmatter.description || '')
    const existingTags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags as string[]
      : []

    const suggested = suggestTags(title, description, body, existingTags, 4)

    if (suggested.length > 0) {
      suggestions.push({
        file: filePath.replace(join(__dirname, '..'), ''),
        title,
        existing: existingTags,
        suggested,
        combined: [...new Set([...existingTags, ...suggested])],
      })
    }
  }

  // Output to dist/.auto-tags.json
  const outputPath = join(distDir, '.auto-tags.json')
  writeFileSync(outputPath, JSON.stringify(suggestions, null, 2), 'utf-8')

  // Print to console
  console.log(`\n📝 Auto-tag suggestions for ${suggestions.length} posts\n`)
  console.log('=' .repeat(60))

  for (const s of suggestions) {
    console.log(`\n📄 ${s.file} — "${s.title}"`)
    console.log(`   existing: [${s.existing.join(', ')}]`)
    console.log(`   suggest:  [${s.suggested.join(', ')}]`)
    console.log(`   combined: [${s.combined.join(', ')}]`)

    if (yesFlag) {
      console.log(`   ✅ auto-accepting`)
      updateFrontmatter(s)
    } else if (!isPrebuild) {
      process.stdout.write(`   [y] accept  [n] skip  [a] all  > `)
    }
  }

  if (!yesFlag && !isPrebuild) {
    console.log('\n\n⚠️  This script is non-destructive by default.')
    console.log('   Run with -y flag to auto-accept all suggestions.')
    console.log('   Or run interactively: node scripts/auto-tag.ts\n')
  }

  if (isPrebuild) {
    console.log('\n💡 Run `npm run auto-tag` to interactively apply suggestions.\n')
  } else {
    console.log(`\n💾 Suggestions saved to ${outputPath.replace(process.cwd(), '.')}\n`)
  }
}

function updateFrontmatter(suggestion: PostSuggestion) {
  const filePath = join(__dirname, '..', suggestion.file)
  const { frontmatter, body } = readPostYaml(filePath)

  frontmatter.tags = suggestion.combined
  writePostYaml(filePath, frontmatter, body)
  console.log(`   ✏️  updated ${suggestion.file}`)
}

main()
