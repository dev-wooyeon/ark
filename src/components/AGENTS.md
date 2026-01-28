# COMPONENT PATTERNS

**Generated:** 2026-01-29
**Commit:** unknown
**Branch:** main

## OVERVIEW
Domain-based React component library with atomic design principles and Three.js animations.

## STRUCTURE
```
src/components/
├── blog/           # Blog-specific components (PostCard, PostList, etc.)
├── layout/         # Layout components (Header, Footer, Container)
├── ui/             # Reusable UI primitives (Button, Modal, Card, etc.)
└── PageTransition.tsx # Route transition component
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Blog Features | `blog/` | Post cards, lists, reading progress, TOC |
| Layout Structure | `layout/` | Header, footer, container wrapper |
| UI Primitives | `ui/` | Atomic design components with variants |
| Route Animations | `PageTransition.tsx` | Client-side page transitions |

## CONVENTIONS
**Component Organization:** Domain-based folders with barrel exports (index.ts)
**Component Structure:** Each component in its own folder with Component.tsx + index.ts
**Types Co-location:** Types defined alongside components (e.g., Button.types.ts)
**Animation Components:** Require 'use client' directive for Three.js integration

## ANTI-PATTERNS (COMPONENTS)
- **NEVER** create components without barrel export in index.ts
- **NEVER** place animation logic outside dedicated animation components
- **NEVER** mix UI primitives with business logic components
- **NEVER** use 'use client' directive on non-animation components unnecessarily