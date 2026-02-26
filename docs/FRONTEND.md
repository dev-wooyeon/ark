# FRONTEND

Last updated: 2026-02-26

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS + CSS variables
- MDX + custom webpack loader pipeline

## Frontend Architecture

1. Route layer: `src/app/**`
2. UI composition: `src/components/**`
3. Content/data transforms: `src/lib/**`
4. Styles/tokens: `src/styles/**`

## Frontend Rules

1. Keep component domains clear (`blog`, `layout`, `ui`, `visualization`, etc.).
2. Avoid duplicated global trackers/providers in root layout.
3. Use typed contracts from `src/types/index.ts`.
4. Keep MDX custom component mappings centralized in `src/mdx-components.tsx`.

## Test Expectations

1. Unit/component behavior covered with Vitest.
2. Critical mobile flows covered with Playwright specs.
3. Ensure no runtime errors on static prerender paths.
