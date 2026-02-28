# FRONTEND

Last updated: 2026-02-27

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS + CSS variables
- MDX + custom webpack loader pipeline

## Frontend Architecture

1. Route layer: `src/app/**`
2. Feature layer: `src/features/**`
3. Shared layer: `src/shared/**` (+ visualization: `src/components/visualization/**`)
4. Styles/tokens: `src/styles/**`

## Frontend Rules

1. Keep boundaries clear between feature modules (`blog`, `resume`, `search`, `home`) and shared modules (`layout`, `ui`, `analytics`, `providers`, `seo`).
2. Avoid duplicated global trackers/providers in root layout.
3. Use typed contracts from `src/domains/**/model/types.ts` and `src/shared/types/*`.
4. Keep MDX custom component mappings centralized in `src/features/blog/ui/mdx/components.tsx`.

## Test Expectations

1. Unit/component behavior covered with Vitest.
2. Critical mobile flows covered with Playwright specs.
3. Ensure no runtime errors on static prerender paths.
