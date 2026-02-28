# ARCHITECTURE

Last updated: 2026-02-27

## System Summary

`eunu.log` is a Next.js App Router blog platform with:

- File-based MDX content under `posts/**`.
- Static generation for blog routes.
- Server-side view counting via Supabase RPC.
- Client-side analytics via GA4 trackers.
- Token-driven UI styling (Tailwind + CSS variables).

## Runtime Topology

### Web Runtime

- Framework: Next.js (`next@16.1.4`) with App Router.
- React: `react@19.2.3`.
- Rendering mix:
  - Static prerendered route params via `generateStaticParams` for post pages.
  - Server route handlers for feed and OG image.
  - Server actions for view counting.

### Edge Runtime

- `src/app/api/og/route.tsx` runs at the edge and returns social images via `ImageResponse`.

## High-Level Modules

### App Layer (`src/app`)

- `layout.tsx` composes global providers, metadata, JSON-LD, analytics, and dual roots (`#app-root`, `#overlay-root`).
- Main pages:
  - `/` home (`src/app/page.tsx`)
  - `/blog` listing (`src/app/blog/page.tsx`)
  - `/blog/[slug]` post detail (`src/app/blog/[slug]/page.tsx`)
  - `/resume` and `/series`
- Route handlers:
  - `/feed.xml` (`src/app/feed.xml/route.ts`)
  - `/api/og` (`src/app/api/og/route.tsx`)
- Server action:
  - `src/app/actions/view.ts` for increment/read view count.

### Content Layer (`posts/**` + `src/features/blog/services`)

- `src/features/blog/services/post-repository.ts` recursively discovers valid post folders (`index.mdx` + `meta.json`).
- `meta.json` is validated with Zod (`FeedFrontmatterSchema`).
- MDX is loaded by dynamic import per folder path.
- Reading time is auto-derived from MDX when metadata omits it.
- Slug-to-folder cache accelerates lookups.

### Markdown/MDX Processing

- Custom webpack rule in `next.config.mjs` for `.mdx` with:
  - `remark-gfm`
  - `rehype-slug`
  - `rehype-pretty-code`
- `src/features/blog/services/markdown-parser.ts` parses MDX headings for TOC data.
- `src/features/blog/ui/mdx/components.tsx` maps MDX nodes to UI components and interactive visualization widgets.

### Feature/Shared Layer (`src/features` + `src/shared` + `src/styles`)

- Feature-first organization:
  - `src/features/blog`, `src/features/resume`, `src/features/search`, `src/features/home`
  - `src/shared/analytics`, `src/shared/layout`, `src/shared/ui`, `src/shared/providers`, `src/shared/seo`
  - `src/components/visualization` is intentionally preserved for heavy visualization widgets.
- Design tokens in `src/styles/tokens.css`.
- Global base styles and typography in `src/styles/globals.css`.
- Theming via `next-themes` provider.

### Data and Integrations

- Supabase client setup in `src/shared/integrations/supabase.ts`.
- View count data model:
  - table: `public.views`
  - rpc: `increment_view(slug_input text) -> bigint`
- SQL provisioning script: `docs/database/supabase-view-count.sql`.

### Analytics and SEO

- GA4 event helpers in `src/shared/analytics/lib/analytics.ts`.
- Trackers in `src/shared/analytics/components/*`.
- Structured data via `JsonLd` component in layout and post page.

## Request/Data Flows

### Blog Post Render Flow

1. `generateStaticParams()` builds route list from posts metadata.
2. Request to `/blog/[slug]` resolves post via `getFeedData(slug)`.
3. MDX source is parsed for heading structure (TOC).
4. MDX component renders with mapped custom components.
5. Client tracker records post view; server action can persist counter in Supabase.

### Feed Flow

1. `/feed.xml` route reads sorted metadata.
2. XML string is generated server-side.
3. Response is cached with `s-maxage=3600`.

### View Count Flow

1. Client triggers view tracking.
2. Server action normalizes slug and calls Supabase RPC.
3. RPC upserts/increments `views.count`.
4. Latest count is returned/fetched.

## Testing and Quality

- Unit/component tests: Vitest + Testing Library (`src/**/*.test.ts(x)`).
- E2E tests: Playwright mobile-focused projects (`tests/e2e/**/*.spec.ts`).
- Linting/formatting: ESLint, Prettier, markdownlint, cspell.
- Coverage focus includes `src/features`, `src/shared`, `src/styles`, and selected route domains.

## Current Architecture Risks

1. Docs/runtime drift:
   - AGENTS and README mention older stack assumptions; package versions are newer.
2. Provider boundary drift:
   - Route/layout changes can reintroduce duplicated tracker mounts if `AppProviders` is bypassed.
3. Content/animation docs drift:
   - Documented `src/components/animations` path does not exist in current tree.
4. SEO endpoint mismatch risk:
   - Post JSON-LD image URL differs from the actual OG route path/domain conventions.

## Decisions to Preserve

1. Keep folder-based content (`posts/**`) with `meta.json + index.mdx`.
2. Keep Zod schema validation in content ingestion path.
3. Keep token-first styling and avoid one-off visual constants where possible.
4. Keep route-level separation for feed, OG, and view-count concerns.
