import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is required')
  process.exit(1)
}

const REPO = 'Naees/NaeesWrites'
const OWNER = 'Naees'
const NAME = 'NaeesWrites'
const CATEGORY_ID = 'DIC_kwDOTAHAGc4C_itP'
const BASE_URL = `https://naees.github.io/${NAME}`

interface Discussion {
  id: string
  title: string
  slug: string
}

async function fetchDiscussions(page = 1): Promise<Discussion[]> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${NAME}/discussions?category_id=${CATEGORY_ID}&per_page=100&page=${page}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API error (${res.status}): ${body}`)
  }
  return res.json() as Promise<Discussion[]>
}

async function loadAllDiscussions(): Promise<Discussion[]> {
  let page = 1
  let all: Discussion[] = []
  while (true) {
    const pageDiscussions = await fetchDiscussions(page)
    all = all.concat(pageDiscussions)
    if (pageDiscussions.length < 100) break
    page++
  }
  return all
}

async function loadPosts(): Promise<{ slug: string; title: string }[]> {
  const postsDir = join(process.cwd(), 'src/content/posts')
  const files = await readdir(postsDir)
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

  const posts: { slug: string; title: string }[] = []

  for (const file of mdFiles) {
    const content = await readFile(join(postsDir, file), 'utf-8')
    const frontmatter = content.slice(0, content.indexOf('---', 3))
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)
    const dateMatch = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/)
    const slug = file.replace(/\.(md|mdx)$/, '')
    const title = titleMatch?.[1]?.trim() || slug
    posts.push({ slug, title })
  }

  posts.sort((a, b) => b.title.localeCompare(a.title))
  return posts
}

async function createDiscussion(slug: string, title: string): Promise<void> {
  const discussionTitle = `${BASE_URL}/posts/${slug}/`
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${NAME}/discussions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: discussionTitle,
        body: `Discussion for post: ${title}\n\nSlug: ${slug}`,
        category_id: Number(CATEGORY_ID),
        start_comment_body: `Auto-created discussion for post "${title}" (${slug}).`,
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to create discussion for ${slug}: ${res.status} ${body}`)
  }

  console.log(`  ✓ Created discussion for "${title}" (${slug})`)
}

async function main() {
  console.log('📚 Syncing giscus discussions...\n')

  const [posts, existingDiscussions] = await Promise.all([
    loadPosts(),
    loadAllDiscussions(),
  ])

  const discussionBySlug = new Map(
    existingDiscussions.map(d => [d.slug, d])
  )

  let created = 0
  let skipped = 0

  for (const post of posts) {
    const discussion = discussionBySlug.get(post.slug)
    if (discussion) {
      const expectedTitle = `${BASE_URL}/posts/${post.slug}/`
      if (discussion.title === expectedTitle) {
        console.log(`  ✓ "${post.title}" — discussion exists with correct title`)
        skipped++
      } else {
        await createDiscussion(post.slug, post.title)
        created++
      }
    } else {
      await createDiscussion(post.slug, post.title)
      created++
    }
  }

  console.log(`\n✅ Done! Created: ${created}, Skipped (exists): ${skipped}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
