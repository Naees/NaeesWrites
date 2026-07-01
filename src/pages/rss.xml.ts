import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

const SITE = 'https://naees.github.io/NaeesWrites';

export async function GET(context) {
  const posts = [...await getCollection('posts')]
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Naees Writes',
    description: 'A collection of thoughts, ideas, and writing by Naees.',
    site: context.site || SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${context.site || SITE}/posts/${post.id}/`,
    })),
  });
}
