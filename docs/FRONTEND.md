# FRONTEND

Last updated: 2026-05-07

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS + CSS variables
- MDX + custom webpack loader pipeline

## Frontend Architecture

1. Route adapter layer: `src/app/**`
2. Domain modules: `blog/**`, `resume/**`, `search/**`
3. Composition layer: `site/**`
4. Runtime/integration layer: `platform/**`
5. Domain-agnostic primitives: `shared/**`
6. Styles/tokens: `styles/**`

## Frontend Rules

1. Keep boundaries clear between domain modules (`blog`, `resume`, `search`) and composition/infrastructure modules (`site`, `platform`, `shared`).
2. Avoid duplicated global trackers/providers in root layout.
3. Keep domain contracts inside the owning domain module, for example `blog/model/types.ts`.
4. Keep MDX custom component mappings centralized in `blog/ui/mdx/components.tsx`.

## Test Expectations

1. Unit/component behavior covered with Vitest.
2. Critical mobile flows covered with Playwright specs.
3. Ensure no runtime errors on static prerender paths.
