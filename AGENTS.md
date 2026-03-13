# Repository Guidelines

## Always-Follow Rules
- Keep changes minimal and scoped to the task. Do not edit unrelated files.
- Preserve the current MDX pipeline. MDX must stay on the custom webpack rule with `@mdx-js/loader` in `next.config.mjs`; do not switch to Next.js built-in MDX unless the whole content pipeline is intentionally migrated.
- Keep visualization-heavy UI in `src/components/visualization/`. Do not move that code to other folders without a clear architectural reason.
- Never use `any`. Use concrete types or `unknown` with narrowing.
- Never use arbitrary Tailwind values such as `p-[13px]`. Use standard utilities, shared tokens, and existing style patterns.
- Do not replace feature-first structure with flat shared folders. Keep code in `src/features/`, `src/shared/`, and `src/domains/` by responsibility.
- Preserve blog content structure as `posts/**/index.mdx` with nearby `meta.json`, including nested series directories when present.

## Project Structure
- `src/app/` — Next.js App Router pages, layouts, handlers
- `src/core/` — app-level providers and configuration composition
- `src/domains/` — cross-feature contracts and schemas
- `src/features/` — feature modules such as blog, home, resume, and search
- `src/shared/` — reusable UI, layout, analytics, SEO, and providers
- `src/components/visualization/` — animation and visualization-heavy components
- `src/styles/` — design tokens and global styles
- `posts/` — blog content, series entries, and metadata managed as nested `index.mdx` + `meta.json`
- `tests/` — Playwright end-to-end coverage
- `internal/` — scripts and tool configuration

## Development Commands
- `npm run dev` — run the local dev server with webpack
- `npm run build` — create the production build
- `npm run lint` — run ESLint on source files
- `npm run lint:css:syntax` — check CSS syntax rules
- `npm run test:unit` — run Vitest unit tests
- `npm run test:components` — run component-focused Vitest tests
- `npm run test:e2e` — run Playwright scenarios
- `npm run test:ci` — run the main CI-equivalent validation set

## Style & Testing
Use TypeScript with 2-space indentation, semicolons, single quotes, trailing commas (`es5`), and 80-column width; Prettier enforces this. Name components in `PascalCase`, hooks in `camelCase` with a `use` prefix, and tests as `*.test.ts` or `*.test.tsx`. Add targeted Vitest or Playwright coverage when changing logic, UI behavior, parsers, or app actions. Before opening a PR, run `npm run build` and the most relevant test command for the change.

## Commits & PRs
Use commit messages like `type(scope): concise description`, for example `fix(home): preview 배포 타입 오류 수정`. Common types include `feat`, `fix`, `refactor`, `test`, and `chore`. Use branch names like `codex/<task>`. Follow `.github/pull_request_template.md`, link related issues or PRs, and include screenshots when UI changes are visible. Confirm mobile/desktop and dark/light behavior when layout or navigation changes.
