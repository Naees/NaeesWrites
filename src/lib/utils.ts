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

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return Math.max(1, minutes)
}

export const TAG_KEYWORD_MAP: Record<string, string[]> = {
  'design': ['design', 'ui', 'ux', 'layout', 'typography', 'color', 'minimal', 'visual', 'aesthetic', 'interface'],
  'philosophy': ['philosophy', 'thought', 'meaning', 'value', 'principle', 'mindset', 'perspective', 'reflection'],
  'technology': ['technology', 'tech', 'tool', 'software', 'stack', 'system', 'architecture', 'build', 'code'],
  'webdev': ['web', 'html', 'css', 'javascript', 'frontend', 'backend', 'server', 'deploy', 'hosting', 'static'],
  'security': ['security', 'threat', 'attack', 'vulnerability', 'risk', 'defense', 'privacy', 'encryption', 'auth'],
  'writing': ['write', 'writing', 'word', 'narrative', 'story', 'prose', 'voice', 'craft'],
  'meta': ['meta', 'blog', 'update', 'note', 'introduction', 'welcome'],
}

export function suggestTags(
  title: string,
  description: string,
  body: string,
  existingTags: string[] = [],
  maxTags: number = 4,
): string[] {
  const titleLower = title.toLowerCase()
  const descLower = description.toLowerCase()
  const bodyLower = body.toLowerCase()

  const scores = new Map<string, number>()

  for (const [tag, keywords] of Object.entries(TAG_KEYWORD_MAP)) {
    if (existingTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())) {
      continue
    }

    for (const keyword of keywords) {
      const kwLower = keyword.toLowerCase()

      const titleMatches = (titleLower.match(new RegExp(kwLower, 'g')) || []).length
      const descMatches = (descLower.match(new RegExp(kwLower, 'g')) || []).length
      const bodyMatches = (bodyLower.match(new RegExp(kwLower, 'g')) || []).length

      scores.set(tag, (scores.get(tag) || 0) + titleMatches * 2 + descMatches * 1.5 + bodyMatches * 1)
    }
  }

  const sorted = Array.from(scores.entries())
    .filter(([, score]) => score >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([tag]) => tag)

  return sorted
}
