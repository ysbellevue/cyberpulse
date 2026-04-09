# CyberPulse

Real-time cybersecurity news aggregator pulling from 35+ trusted sources. Updated every 15 minutes.

## Tech Stack

- **Next.js 14** (App Router, ISR)
- **TypeScript**
- **rss-parser** for RSS/Atom feed ingestion
- **Vercel** for deployment (free tier)

## How It Works

1. The homepage is a **server component** that fetches all 35 RSS feeds in parallel
2. Articles are deduplicated by URL, auto-tagged by keyword matching, and sorted newest-first
3. **ISR (Incremental Static Regeneration)** caches the page for 15 minutes, then refetches on the next request
4. The client-side Feed component handles search, filter, and sort interactivity

No database. No cron jobs. No environment variables. Just RSS → HTML.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com and sign up with GitHub (free)
3. Click "Import Project" → select this repo
4. Click "Deploy"
5. Done. You'll get a live URL in ~90 seconds.

No environment variables needed. No configuration required.

## Project Structure

```
app/
  layout.tsx          → Root layout, metadata, fonts
  page.tsx            → Homepage (server component, fetches RSS)
  api/health/route.ts → Health check endpoint
components/
  feed.tsx            → Client component (search, filter, sort, feed UI)
lib/
  sources.ts          → All 35 source definitions with RSS URLs
  fetch-feeds.ts      → RSS fetching, dedup, auto-tagging logic
public/
  robots.txt          → SEO
```

## Design System

- White background (#FFFFFF)
- Blue accent (#2B6FFB)
- Navy text (#0B0D10)
- Slate gray scale for hierarchy
- Inter font
- Swiss minimalism — no gradients, no decorative elements

## Adding Sources

Edit `lib/sources.ts` and add a new entry:

```ts
{ id: 36, name: "New Source", url: "https://example.com", rssUrl: "https://example.com/feed/" },
```

Deploy. That's it.

## Future Expansion

1. Supabase database for article history + full-text search
2. /sources page
3. Daily AI-summarized digest
4. Newsletter signup
5. Individual article pages for SEO
6. Cybersecurity tools directory
