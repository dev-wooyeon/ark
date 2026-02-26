# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-26
**Commit:** 2669f50
**Branch:** master

## OVERVIEW

Modern tech blog platform built on Next.js App Router with MDX-based content, interactive visualization components, analytics tracking, and a token-driven design system.

## STRUCTURE

```
eunu.log/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and processing
│   ├── styles/           # Design tokens and global styles
│   └── types/            # TypeScript definitions
├── content/              # Blog posts (MDX + metadata)
├── public/               # Static assets
├── docs/                 # Project documentation
└── .agent/              # AI agent rules
```

## WHERE TO LOOK

| Task               | Location          | Notes                                              |
| ------------------ | ----------------- | -------------------------------------------------- |
| Pages & Routing    | `src/app/`        | Next.js App Router with static generation + handlers |
| Components         | `src/components/` | Organized by domain (blog, layout, ui, visualization) |
| Content Processing | `src/lib/`        | MDX feeds, markdown processing                     |
| Styling            | `src/styles/`     | CSS variables, Tailwind integration                |
| Blog Content       | `content/`        | MDX files with separate metadata                   |
| Configuration      | Root              | `next.config.mjs`, `package.json`, `tsconfig.json` |

## CONVENTIONS

**Content Structure:** Each blog post uses folder structure: `content/[slug]/index.mdx + meta.json`
**Component Organization:** Domain-based folders with index.ts exports
**Styling:** CSS variables + Tailwind CSS hybrid approach
**Visualization:** Interactive visualization components live in `src/components/visualization/` and should use client runtime when browser APIs are required

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** use arbitrary Tailwind values like `p-[13px]` - use standard classes only
- **NEVER** use raw `requestAnimationFrame` loops in React UI when framework lifecycle hooks can be used
- **NEVER** place visualization/animation-heavy components outside `src/components/visualization/` without clear reason
- **NEVER** use `any` type - use `unknown` or proper types
- **NEVER** ship client effects that drop below smooth interaction on mobile

## UNIQUE STYLES

- Dual root layout pattern (`#app-root` + `#overlay-root`) for modal management
- Folder-based content organization with separated metadata
- CSS variable-driven design system integrated with Tailwind
- Custom webpack MDX processing instead of Next.js built-in MDX

## COMMANDS

```bash
# Development (uses webpack flag)
npm run dev

# Build (uses webpack flag)
npm run build

# Testing (Vitest, not Jest)
npm test

# Bundle analysis
ANALYZE=true npm run build
```

## NOTES

- Uses Vitest instead of Jest for testing
- Uses Playwright for mobile-focused e2e coverage
- Webpack flag suggests Turbopack compatibility issues
- No CI/CD setup - relies on Vercel auto-deployment
- Korean language content support in feeds
- Current app dependencies include Next.js 16 and React 19
- Agent execution rules: `.agent/rules/meta-prompt.md`
- AI engineering guardrails: `.agent/rules/meta-prompt-engineering.md`
- Personal communication rules: `.agent/rules/meta-prompt-personal-preferences.md`
- Multi-model knowledge sync: `.agent/rules/meta-prompt-knowledge-sync.md`
- Unified product rules: `.agent/rules/product-rules.md`
- Toss-inspired engineering rules: `.agent/rules/meta-prompt-toss-inspired.md`
