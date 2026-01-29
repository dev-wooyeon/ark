# Next.js App Router Patterns

**Generated:** 2026-01-29
**Scope:** src/app/ directory patterns

## OVERVIEW
Next.js 14+ App Router with SSG generation and dual route organization.

## STRUCTURE
```
src/app/
├── layout.tsx           # Root layout with dual root pattern
├── page.tsx            # Homepage (server component)
├── template.tsx        # Page transition wrapper
├── blog/              # Blog routes
│   ├── page.tsx       # Blog listing
│   └── [slug]/        # Dynamic blog posts
│       └── page.tsx   # Individual post
└── feed/              # Feed routes (duplicate structure)
    ├── page.tsx       # Feed listing
    └── [slug]/        # Dynamic feed items
        └── page.tsx   # Individual feed item
```

## WHERE TO LOOK
| Pattern | Location | Notes |
|---------|----------|-------|
| SSG Generation | `[slug]/page.tsx` | Uses `generateStaticParams` |
| Client Components | Files with `'use client'` | Animations, interactivity |
| Server Components | Default files | Data fetching, static content |
| Layout Pattern | `layout.tsx` | Dual root (`#app-root` + `#overlay-root`) |
| Transitions | `template.tsx` | Page transition animations |

## CONVENTIONS
**Route Organization:** Both `/blog` and `/feed` use identical patterns - consider consolidation
**Component Separation:** Server components for data, client components for interactivity
**SSG Pattern:** `generateStaticParams` in dynamic routes for static generation
**Layout Pattern:** Dual root layout for modal management and overlay handling

## ANTI-PATTERNS (APP ROUTER)
- **NEVER** use `use client` in layout.tsx - layouts must be server components
- **NEVER** place animations in page.tsx - use client components instead
- **NEVER** mix data fetching with client-side state in server components
- **NEVER** use `requestAnimationFrame` - use `useFrame` for animations
- **NEVER** duplicate route logic between /blog and /feed - consolidate shared patterns

## DUAL ROUTE ISSUE
Current structure has both `/blog` and `/feed` with identical patterns:
- Both use `[slug]/page.tsx` with `generateStaticParams`
- Both serve similar content types
- Consider consolidating to single route with content type filtering

## SSG PATTERNS
```typescript
// Dynamic route SSG generation
export async function generateStaticParams() {
  const posts = await getPosts()  // Server-side data fetching
  return posts.map(post => ({ slug: post.slug }))
}

// Server component pattern
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)  // Direct data access
  return <PostContent post={post} />
}
```