export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getTagCount(posts: Array<{ data: { tags: string[] } }>): Map<string, number> {
  const tagCount = new Map<string, number>()
  for (const post of posts) {
    const tags = post.data.tags || []
    for (const tag of tags) {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
    }
  }
  return tagCount
}

export function getAllTags(posts: Array<{ data: { tags: string[] } }>): string[] {
  const tags = new Set<string>()
  for (const post of posts) {
    const postTags = post.data.tags || []
    for (const tag of postTags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
