# AI Radar

Public static website for curated AI Radar briefings.

## Shape

- Astro static site.
- Curated Markdown issues are the canonical publication artifacts.
- JSON items support the live feed and future search/filtering.
- Raw ingestion data, private logs, credentials, Gmail/calendar data, and internal OpenClaw state must not be committed here.

## Development

```bash
npm install
npm run dev
npm run build
```

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`.

Custom domain target: `ai-radar.yonatankarp.com`.
