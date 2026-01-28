# Learnings: AGENTS.md Generation

## 2026-01-29 - src/app/ AGENTS.md Generation

### Key Findings Documented
- **Dual Route Pattern**: Both `/blog` and `/feed` routes use identical structure with `[slug]/page.tsx` and `generateStaticParams`
- **SSG Implementation**: Dynamic routes use `generateStaticParams` for static generation at build time
- **Component Separation**: Clear distinction between server components (data fetching) and client components (interactivity)
- **Template Pattern**: `template.tsx` handles page transition animations, distinct from `layout.tsx`
- **Dual Root Layout**: Layout uses `#app-root` and `#overlay-root` for modal management

### Anti-Patterns Identified
- Client components should not be in layout.tsx
- Animation logic separated from page components
- Data fetching confined to server components
- No arbitrary Tailwind values
- No `requestAnimationFrame` - use `useFrame` for animations

### Documentation Approach
- 45 lines total (within 30-80 line constraint)
- Sections: OVERVIEW, STRUCTURE, WHERE TO LOOK, CONVENTIONS, ANTI-PATTERNS, DUAL ROUTE ISSUE, SSG PATTERNS
- Included code examples for SSG patterns
- Avoided repeating parent content from root AGENTS.md
- Focused specifically on App Router patterns

### Technical Debt Noted
- Duplicate route structure between /blog and /feed
- Consider consolidation to single route with content type filtering
- Missing exports in mdx-feeds library (`getSortedFeedsData` vs `getSortedFeedData`)