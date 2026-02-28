# AI Collaboration Guide

## Why This Exists

This repository now relies on the Codex harness for generic agent behavior.
This guide keeps only repository-specific rules that are easy to miss.

## Repository-Specific Rules

1. Post data lives in `posts/[slug]/index.mdx + meta.json`.
2. Internal tooling lives in `internal/`:
   - `internal/scripts/**`
   - `internal/config/**`
3. Visualization-heavy UI belongs in `src/components/visualization/**`.
4. Do not use arbitrary Tailwind values like `p-[13px]`.
5. Do not add `any` type; use concrete types or `unknown` with narrowing.

## Execution Checklist

1. Keep scope minimal and avoid unrelated file changes.
2. Do not revert user-authored changes unless explicitly asked.
3. Run relevant checks after changes:
   - Base: `npm run build`
   - Tests when logic changes: `npm run test:unit` or targeted Vitest runs
4. Summarize what changed, why, and how it was verified.

## Useful Commands

- `npm run dev`
- `npm run build`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run lint`
- `npm run lint:css:syntax`

## Related Docs

- `docs/FRONTEND.md`
- `docs/DESIGN.md`
- `docs/guides/testing-guide.md`
- `docs/guides/pr-workflow.md`
