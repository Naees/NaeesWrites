#!/usr/bin/env node
/**
 * Create a new draft blog post for NaeesWrites.
 * 
 * Usage:
 *   npm run new-post "My Post Title"
 * 
 * Creates a draft file in src/content/posts/ with today's date.
 * If the generated slug already exists, appends -1, -2, etc.
 */

import { writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsDir = join(__dirname, '..', 'src', 'content', 'posts')

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function findUniqueSlug(baseSlug: string): string {
  const files = readdirSync(postsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
  const existingSlugs = new Set(files.map(f => f.replace(/\.md$/, '')))
  
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug
  }
  
  let counter = 1
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter++
  }
  return `${baseSlug}-${counter}`
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Usage: npm run new-post "Post Title"')
    process.exit(1)
  }
  
  const title = args.join(' ')
  const baseSlug = generateSlug(title)
  const slug = findUniqueSlug(baseSlug)
  const today = formatDate(new Date())
  
  const content = `---
title: "${title}"
description: ""
date: ${today}
tags: []
draft: true
---

- INSERT TEXT HERE -
`
  
  const filePath = join(postsDir, `${slug}.md`)
  writeFileSync(filePath, content, 'utf-8')
  
  // Capture git commit date for footer
  const publicDir = join(__dirname, '..', 'public')
  if (!existsSync(publicDir)) {
    writeFileSync(join(publicDir, '.last-commit-date.json'), JSON.stringify({ date: today }), 'utf-8')
  } else {
    try {
      const commitDate = execSync('git log -1 --format="%cd" --date=format:"%Y-%m-%d"', { encoding: 'utf-8' }).trim()
      writeFileSync(join(publicDir, '.last-commit-date.json'), JSON.stringify({ date: commitDate }), 'utf-8')
    } catch {
      writeFileSync(join(publicDir, '.last-commit-date.json'), JSON.stringify({ date: today }), 'utf-8')
    }
  }
  
  console.log(`\n✅ Created draft post: ${filePath}`)
  console.log(`   Slug: ${slug}`)
  console.log(`   Date: ${today}`)
  console.log(`\n📝 Edit the file, then set draft: false when ready to publish.`)
  console.log(`   Then run: git add && git commit && npm run build\n`)
}

main()
