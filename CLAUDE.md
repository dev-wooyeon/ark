# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Eunu.log** is a modern tech blog platform with interactive 3D animations built using Next.js 14+ App Router. The project emphasizes memorable user experiences through particle-based interactive animations and clean typography while maintaining 60fps performance.

Core objectives:
- Deliver technical content with high memorability through interactive animations
- Provide premium visual experience with newspaper-inspired design (beige + classic blue)
- Maintain 60fps across all animations
- Support all devices with responsive design and touch optimization
- Static site generation (SSG) for optimal performance

## Development Commands

### Essential Commands
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production (uses SSG for all pages)
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint
```

## Architecture Overview

### Technology Stack

**Framework & Core:**
- Next.js 14+ (App Router with SSG/SSR)
- React 18+ (with TypeScript)
- TypeScript in strict mode

**Animation Libraries:**
- Three.js + @react-three/fiber + @react-three/drei (3D particle animations)
- Framer Motion (React animations)

**Content Management:**
- Markdown posts in `/posts` directory
- gray-matter for frontmatter parsing
- remark + remark-gfm for Markdown to HTML conversion
- rehype-highlight for syntax highlighting
- cheerio for HTML parsing and manipulation
- raw-loader webpack configuration for .md files

**Styling:**
- CSS Modules for component-scoped styles
- CSS Variables for design tokens (defined in `src/styles/variables.css`)
- Newspaper-inspired color palette (beige + classic blue)
- Geist font family (sans and mono variants)

**Utilities:**
- date-fns for date formatting
- clsx for conditional classes

### Project Structure

```
eunu.log/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with metadata and Geist fonts
│   │   ├── page.tsx      # Home page with navigation
│   │   ├── posts/        # Blog post pages
│   │   │   ├── page.tsx           # Post list page
│   │   │   └── [slug]/page.tsx    # Dynamic post detail pages
│   │   ├── resume/       # Resume page
│   │   ├── samples/      # Sample/demo pages
│   │   ├── color-samples/  # Color palette testing page
│   │   └── font-samples/   # Typography testing page
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx       # Card component for post previews
│   │   ├── PostList.tsx       # List container for posts
│   │   ├── PostListItem.tsx   # Individual post list item
│   │   ├── TableOfContents.tsx  # Interactive TOC with scroll tracking
│   │   └── animations/    # Animation components
│   │       ├── HeroScene.tsx         # 3D sphere with mouse tracking
│   │       └── TextParticleScene.tsx # Text particle explosion effect
│   ├── lib/             # Utility functions
│   │   └── posts.ts     # Post fetching, parsing, and TOC generation
│   ├── styles/          # Global styles
│   │   ├── globals.css  # Global CSS imports and base styles
│   │   └── variables.css # CSS custom properties (design tokens)
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # Post, Project, NavItem types
│   └── hooks/           # Custom React hooks (planned)
├── posts/               # Markdown blog posts
│   └── *.md            # Individual post files
├── public/              # Static assets
└── docs/                # Project documentation
    └── PRD.md          # Detailed product requirements
```

### Key Design Patterns

**Server-Side Generation:**
- Post list and detail pages use Next.js SSG with `generateStaticParams`
- Posts are read from filesystem at build time using `fs` module
- HTML is pre-rendered for optimal performance and SEO

**Client-Side 3D Rendering:**
- Three.js components are client-only ('use client' directive)
- HeroScene and TextParticleScene use `@react-three/fiber` Canvas
- Dynamic imports with `next/dynamic` and `ssr: false` can be used for lazy loading
- Prevents SSR issues with WebGL and reduces initial bundle size

**Color System:**
All colors are defined as CSS variables in `src/styles/variables.css`:
- **Light Mode:**
  - Background: Newspaper beige (#EAEBEA)
  - Text: Soft black (#1A1A1A) for primary, grays for secondary/tertiary
  - Accent: Classic blue (#0066CC) for links/buttons, darker blue (#004499) for hover
  - Code: Light gray background (#F8F9FA) with green-tinted syntax colors
- **Dark Mode:** (via `prefers-color-scheme`)
  - Background: Dark gray (#1A1A1A)
  - Text: Light variations with green tints
  - Accent: Bright blue (#4A9EFF)
  - Automatic theme switching based on system preferences

**TypeScript Types:**
Core types are centralized in `src/types/index.ts`:
- `Post` and `PostData` for blog content
- `Project` for portfolio items
- `NavItem` and `SocialLink` for navigation

**Path Aliases:**
The project uses `@/*` alias for `./src/*` imports (configured in `tsconfig.json`)

## Animation Architecture

### Three.js Integration

The project features two main 3D animation components:

#### 1. HeroScene (3D Sphere)
**Component:** `src/components/animations/HeroScene.tsx`

**Key Implementation Details:**
- Uses `@react-three/fiber` Canvas for React integration
- `@react-three/drei` for MeshDistortMaterial and Sphere geometry
- Mouse tracking: Sphere rotates based on normalized mouse coordinates (-1 to 1)
- Auto-rotation: Continuous slow rotation on Z-axis when idle
- Smooth interpolation: Uses `THREE.MathUtils.lerp` for smooth transitions
- Colors match design system: Accent colors with emissive properties

**Performance Considerations:**
- Component is client-only ('use client' directive)
- Uses `useFrame` hook for animation loop (runs at 60fps)
- Event listener for mouse position added only on client side

#### 2. TextParticleScene (Interactive Text Particles)
**Component:** `src/components/animations/TextParticleScene.tsx`

**Key Implementation Details:**
- Converts text ("eunu") into particle system using Canvas 2D API
- Uses `THREE.InstancedMesh` for efficient rendering of thousands of particles
- **Intro Animation:** Particles fly in from random positions to form text
- **Mouse Interaction:**
  - Repulsion effect: particles move away from mouse cursor
  - Click explosion: particles explode outward and return
- **Physics:** Spring-based animation with velocity and damping
- Colors match design system with emissive materials

**Performance Considerations:**
- InstancedMesh for rendering thousands of particles efficiently
- Particle sampling with gap parameter to control density
- Client-only rendering with 'use client' directive

### Animation Best Practices

- Always use `'use client'` directive for components using Three.js or browser APIs
- Implement `prefers-reduced-motion` for accessibility (planned)
- Keep particle count reasonable for 60fps on lower-end devices
- Use `useFrame` for animation loops instead of `requestAnimationFrame`
- Place animation components in `src/components/animations/`

## Content Management

### Blog Post Structure

Posts are stored as Markdown files in `/posts/` directory with YAML frontmatter:

```yaml
---
title: "Post Title"
description: "Short description"
date: "2025-01-20"
updated: "2025-01-20"  # Optional
category: "Dev"         # Dev or Life
tags: ["Tag1", "Tag2"]
image: "/images/post.jpg"  # Optional
readingTime: 8          # Optional, in minutes
featured: true          # Optional
---

# Your markdown content here

Code blocks are automatically syntax highlighted:

\`\`\`javascript
const example = "code";
\`\`\`
```

### Post Processing Pipeline

**Location:** `src/lib/posts.ts`

The post processing pipeline includes these key functions:

1. **`getSortedPostsData()`** - Fetches all posts and sorts by date
   - Reads all .md files from /posts directory
   - Parses frontmatter with gray-matter
   - Returns array of PostData objects sorted newest first

2. **`getAllPostSlugs()`** - Gets all post slugs for static generation
   - Used by `generateStaticParams` in Next.js 14+ App Router
   - Returns array of slug parameters for pre-rendering

3. **`getPostData(slug)`** - Fetches and processes a single post
   - Parses frontmatter metadata
   - Converts Markdown to HTML using remark pipeline:
     - `remark` - Markdown processor
     - `remark-gfm` - GitHub Flavored Markdown support (tables, task lists, etc.)
     - `remark-rehype` - Converts Markdown AST to HTML AST
     - `rehype-highlight` - Syntax highlighting with highlight.js
     - `rehype-stringify` - Converts HTML AST to string
   - Returns post metadata + HTML content

4. **`parseHeadingsFromHtml(htmlContent)`** - Generates table of contents
   - Parses HTML with cheerio to extract h1-h6 elements
   - Builds hierarchical tree structure based on heading levels
   - Generates IDs for headings (kebab-case from text)
   - Returns `TocItem[]` array for TableOfContents component

### Table of Contents System

**Component:** `src/components/TableOfContents.tsx`

**Features:**
- **Automatic Generation:** Parses headings from HTML content
- **Hierarchical Display:** Nested structure matching heading levels
- **Active Section Tracking:** Uses IntersectionObserver to highlight current section
- **Smooth Scrolling:** Animated scroll to section on click
- **Responsive Visibility:** Automatically hides on narrow screens when it would overlap content
- **ID Assignment:** Dynamically assigns IDs to headings if missing

**Technical Implementation:**
- Client component ('use client') for browser APIs
- IntersectionObserver with custom rootMargin for header offset
- Window resize listener for responsive visibility
- Recursive rendering for nested heading structure

### Webpack Configuration

The `next.config.js` includes:
- Custom webpack rule for `.md` files using `raw-loader`
- Image optimization with AVIF and WebP formats
- React strict mode enabled

## Performance Targets

Based on PRD requirements:
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Animation FPS:** 60fps consistently
- **SSG:** All pages pre-rendered at build time for instant loading

## Development Guidelines

### When Adding New Features

**For New Pages:**
- Create in `src/app/[pagename]/page.tsx`
- Use Server Components by default for better performance
- Only add 'use client' when you need browser APIs or interactivity
- Add route metadata for SEO in layout or page files
- Use `generateStaticParams` for dynamic routes that should be pre-rendered

**For New Components:**
- Use CSS Modules for styling (*.module.css)
- Reference design tokens from `src/styles/variables.css`
- Follow naming convention: PascalCase for components, camelCase for utilities
- Place in appropriate directory:
  - `src/components/` - Reusable UI components
  - `src/components/animations/` - Animation-specific components
- Export types alongside component when using TypeScript

**For Animations:**
- Keep 60fps as priority - test on lower-end devices
- Use `requestAnimationFrame` or animation library frame hooks (e.g., `useFrame`)
- Implement `prefers-reduced-motion` for accessibility
- Place animation components in `src/components/animations/`
- Use 'use client' directive for all Three.js components
- Consider performance impact of particle count and geometry complexity

**For Blog Features:**
- Add new post types to `src/types/index.ts`
- Update Post interface if adding metadata fields
- Add processing logic to `src/lib/posts.ts` if needed
- Consider creating utility functions in `src/lib/` for complex operations

**For Utility Functions:**
- Create in `src/lib/` directory
- Export as named exports
- Include TypeScript types
- Document complex functions with JSDoc comments

### Styling Conventions

**CSS Variables Usage:**
Always use design tokens instead of hardcoded values:
- Colors: `var(--text-primary)`, `var(--accent-primary)`, `var(--bg-primary)`
- Typography: `var(--text-lg)`, `var(--font-semibold)`, `var(--font-sans)`
- Spacing: `var(--space-4)`, `var(--space-8)` (8px grid system)
- Shadows: `var(--shadow-md)`, `var(--shadow-lg)`
- Borders: `var(--radius-md)`, `var(--border)`

**Typography:**
- Use Geist font family variables: `var(--font-sans)` and `var(--font-mono)`
- Font sizes follow design tokens: `--text-xs` (12px) to `--text-5xl` (48px)
- Font weights: `--font-normal` (400) to `--font-bold` (700)

**Responsive Design:**
The project targets mobile-first responsive design. Test across:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

**Dark Mode:**
- Colors automatically adapt via `@media (prefers-color-scheme: dark)`
- Test both light and dark modes for all new components
- Ensure sufficient contrast ratios in both modes

### Code Quality

**TypeScript:**
- Enable strict mode (already configured)
- Define types for all props, state, and function parameters
- Use type imports: `import type { TypeName } from '@/types'`
- Avoid `any` - use `unknown` or proper types

**Component Structure:**
1. Imports (React, Next.js, types, components, styles)
2. Type/interface definitions
3. Component function
4. Helper functions (if needed)
5. Export statement

**File Naming:**
- Components: PascalCase (e.g., `PostCard.tsx`)
- Utilities: camelCase (e.g., `posts.ts`)
- CSS Modules: Component name + `.module.css` (e.g., `PostCard.module.css`)
- Types: camelCase (e.g., `index.ts` in types folder)

## Important Files Reference

### Core Configuration
- `next.config.js` - Next.js and webpack configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `package.json` - Dependencies and scripts

### Styling
- `src/styles/variables.css` - Complete design system tokens (colors, typography, spacing)
- `src/styles/globals.css` - Global styles and resets

### Content & Utilities
- `src/lib/posts.ts` - Post fetching, parsing, and TOC generation utilities
- `src/types/index.ts` - TypeScript type definitions for Post, Project, etc.

### Key Components
- `src/components/TableOfContents.tsx` - Interactive TOC with scroll tracking
- `src/components/animations/HeroScene.tsx` - 3D sphere animation
- `src/components/animations/TextParticleScene.tsx` - Text particle explosion

### Pages
- `src/app/page.tsx` - Home page with site introduction
- `src/app/posts/page.tsx` - Post list page
- `src/app/posts/[slug]/page.tsx` - Post detail page with TOC
- `src/app/layout.tsx` - Root layout with Geist fonts and metadata

### Documentation
- `docs/PRD.md` - Comprehensive product requirements document
- `CLAUDE.md` - This file (AI assistant guidance)

## Testing & Development Pages

The project includes sample pages for testing design system components:
- `/samples` - General component samples
- `/color-samples` - Color palette visualization
- `/font-samples` - Typography testing

These pages are useful for:
- Testing design token changes
- Previewing component variations
- Debugging responsive behavior
- Ensuring consistency across the design system

## Common Tasks

### Adding a New Blog Post
1. Create a new `.md` file in `/posts/` directory
2. Add frontmatter with required fields (title, description, date, category)
3. Write content in Markdown with GitHub Flavored Markdown support
4. Run `npm run dev` to preview
5. Post will automatically appear in post list and have its own detail page

### Creating a New Animation
1. Create component in `src/components/animations/`
2. Add 'use client' directive at the top
3. Import Three.js dependencies
4. Use `Canvas` from `@react-three/fiber` as wrapper
5. Use `useFrame` for animation loops
6. Match colors to design system variables
7. Test performance on various devices

### Modifying the Design System
1. Update color/spacing/typography values in `src/styles/variables.css`
2. Changes automatically propagate to all components using CSS variables
3. Test in both light and dark modes
4. Verify responsive behavior across breakpoints
5. Check sample pages (`/color-samples`, `/font-samples`) for visual confirmation

### Debugging Build Issues
1. Check `npm run build` output for errors
2. Verify all dynamic routes have `generateStaticParams`
3. Ensure no client-only code runs during SSG
4. Check that all imported files exist and paths are correct
5. Verify markdown files have valid frontmatter

## Known Patterns

**Dynamic Imports (when needed):**
```typescript
import dynamic from 'next/dynamic';

const HeroScene = dynamic(
  () => import('@/components/animations/HeroScene'),
  { ssr: false }
);
```

**Post Fetching:**
```typescript
import { getSortedPostsData, getPostData } from '@/lib/posts';

// In page component
const posts = getSortedPostsData(); // All posts
const post = await getPostData(slug); // Single post
```

**CSS Variable Usage:**
```css
.component {
  color: var(--text-primary);
  background: var(--bg-primary);
  font-size: var(--text-lg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

**Three.js Animation:**
```typescript
'use client';

import { useFrame } from '@react-three/fiber';

function AnimatedMesh() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.z += delta * 0.5;
  });

  return <mesh ref={meshRef}>...</mesh>;
}
```
