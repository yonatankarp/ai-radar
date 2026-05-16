import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const issueCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/issues' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(['draft', 'published']).default('published'),
    tags: z.array(z.string()).default([])
  })
});

const itemCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/items' }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    source: z.string(),
    publishedAt: z.string().optional(),
    discoveredAt: z.string(),
    importance: z.enum(['critical', 'worth-reading', 'watchlist']),
    summary: z.string(),
    whyItMatters: z.string(),
    tags: z.array(z.string()).default([]),
    issue: z.string().optional()
  })
});

export const collections = {
  issues: issueCollection,
  items: itemCollection
};
