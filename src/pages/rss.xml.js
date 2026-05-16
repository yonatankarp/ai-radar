import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const issues = (await getCollection('issues', ({ data }) => data.status === 'published'))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const site = new URL(base, context.site).toString();

  return rss({
    title: 'AI Radar',
    description: 'A chronological feed of source-linked AI briefings.',
    site,
    items: issues.map((issue) => ({
      title: issue.data.title,
      description: issue.data.description,
      pubDate: issue.data.publishedAt,
      link: `${site}issues/${issue.id.replace(/\.md$/, '')}/`
    }))
  });
}
