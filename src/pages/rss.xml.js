import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const issues = (await getCollection('issues', ({ data }) => data.status === 'published'))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  return rss({
    title: 'AI Radar',
    description: 'Curated AI signal, ranked by importance.',
    site: context.site,
    items: issues.map((issue) => ({
      title: issue.data.title,
      description: issue.data.description,
      pubDate: issue.data.publishedAt,
      link: `/issues/${issue.id.replace(/\.md$/, '')}/`
    }))
  });
}
