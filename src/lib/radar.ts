export type RadarItem = {
  id: string;
  data: {
    title: string;
    url: string;
    source: string;
    discoveredAt: string;
    importance: 'critical' | 'worth-reading' | 'watchlist';
    summary: string;
    whyItMatters: string;
    tags: string[];
    issue?: string;
  };
};

export const MAX_PER_GROUP = 5;

export const sourceGroups = [
  {
    key: 'official',
    label: 'Blogs and official sources',
    shortLabel: 'Blogs',
    description: 'Company posts, product updates, and primary-source announcements.'
  },
  {
    key: 'research',
    label: 'Research and technical notes',
    shortLabel: 'Research',
    description: 'Papers, benchmarks, and engineering writeups with reusable technical detail.'
  },
  {
    key: 'developer',
    label: 'Developer projects',
    shortLabel: 'Projects',
    description: 'Repositories and tools that may be worth inspecting or adopting.'
  },
  {
    key: 'youtube',
    label: 'YouTube and video',
    shortLabel: 'YouTube',
    description: 'Video walkthroughs and creator explainers. Useful for scanning workflows quickly.'
  },
  {
    key: 'social',
    label: 'Social and community',
    shortLabel: 'Social',
    description: 'Community discussions and social signals. Treat these as early evidence.'
  },
  {
    key: 'other',
    label: 'Other signals',
    shortLabel: 'Other',
    description: 'Items that do not fit a cleaner public bucket yet.'
  }
] as const;

export type SourceGroupKey = (typeof sourceGroups)[number]['key'];

const officialSources = new Set([
  'OpenAI',
  'Anthropic',
  'Cohere Blog',
  'Mistral AI News',
  'Stability AI News',
  'Vercel Blog',
  'IBM Research Blog',
  'Datasette Blog'
]);

export function issueSlug(id: string) {
  return id.replace(/\.md$/, '');
}

export function formatIssueDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function classifyItem(item: RadarItem): SourceGroupKey {
  const source = item.data.source;
  const title = item.data.title.toLowerCase();
  const tags = item.data.tags.join(' ').toLowerCase();
  const haystack = `${source} ${title} ${tags}`.toLowerCase();

  if (haystack.includes('youtube') || source.includes('| AI Automation')) return 'youtube';
  if (source.startsWith('r/') || haystack.includes('community signal') || haystack.includes('social')) return 'social';
  if (source.startsWith('GitHub Trending') || haystack.includes('github')) return 'developer';
  if (source.includes('arXiv') || haystack.includes('research') || haystack.includes('benchmark')) return 'research';
  if (officialSources.has(source) || source.includes('Blog') || source.includes('News')) return 'official';
  return 'other';
}

export function groupItems(items: RadarItem[], limit = MAX_PER_GROUP) {
  return sourceGroups
    .map((group) => {
      const allItems = items.filter((item) => classifyItem(item) === group.key);
      return {
        ...group,
        total: allItems.length,
        items: allItems.slice(0, limit)
      };
    })
    .filter((group) => group.items.length > 0);
}

export function topTags(items: RadarItem[], limit = 8) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}
