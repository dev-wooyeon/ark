# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-29
**Commit:** unknown
**Branch:** main

## OVERVIEW

Modern tech blog platform with interactive 3D animations built on Next.js 14+ App Router, emphasizing memorable user experiences through particle-based animations and newspaper-inspired design.

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
| Pages & Routing    | `src/app/`        | Next.js 14+ App Router with SSG                    |
| Components         | `src/components/` | Organized by domain (blog, layout, ui)             |
| Content Processing | `src/lib/`        | MDX feeds, markdown processing                     |
| Styling            | `src/styles/`     | CSS variables, Tailwind integration                |
| Blog Content       | `content/`        | MDX files with separate metadata                   |
| Configuration      | Root              | `next.config.mjs`, `package.json`, `tsconfig.json` |

## CONVENTIONS

**Content Structure:** Each blog post uses folder structure: `content/[slug]/index.mdx + meta.json`
**Component Organization:** Domain-based folders with index.ts exports
**Styling:** CSS variables + Tailwind CSS hybrid approach
**Animation:** All Three.js components in `src/components/animations/` with 'use client' directive

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** use arbitrary Tailwind values like `p-[13px]` - use standard classes only
- **NEVER** use `requestAnimationFrame` - **ALWAYS** use `useFrame` for animations
- **NEVER** place animations outside `src/components/animations/`
- **NEVER** use `any` type - use `unknown` or proper types
- **NEVER** exceed particle counts that break 60fps

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
- Webpack flag suggests Turbopack compatibility issues
- No CI/CD setup - relies on Vercel auto-deployment
- Korean language content support in feeds
- 3D animations require 'use client' directive and careful performance management
- Agent execution rules: `.agent/rules/meta-prompt.md`
- AI engineering guardrails: `.agent/rules/meta-prompt-engineering.md`
- Personal communication rules: `.agent/rules/meta-prompt-personal-preferences.md`
- Multi-model knowledge sync: `.agent/rules/meta-prompt-knowledge-sync.md`
- Unified product rules: `.agent/rules/product-rules.md`
- Toss-inspired engineering rules: `.agent/rules/meta-prompt-toss-inspired.md`
