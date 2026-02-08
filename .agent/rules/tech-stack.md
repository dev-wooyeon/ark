---
trigger: always_on
---

# Tech Stack & Implementation Rules

## 1. Core Framework

- **Next.js 16+ (App Router):** Use Server Components by default. Client Components only for interaction.
- **Tailwind CSS:** Do not use arbitrary values like `p-[13px]`. Use standard classes.

## 2. Component Architecture

- **Compound Components:** Use compound patterns for complex UIs (e.g., Select, Modal).
- **Declarative Patterns:** Follow `@toss/slash` philosophy.
  - Use `<Suspense>` and `<ErrorBoundary>` for async boundaries.
  - Implement 'Overlay' pattern for modals and toasts.

## 3. Data Fetching & State

- Use **React Query (TanStack Query)** for server state.
- Keep local state minimal and close to where it's used.

## 4. Quality Standard

- **Accessibility:** All images must have `alt` text. Use semantic HTML (`<article>`, `<section>`, `<nav>`).
- **SEO:** Use `Metadata` API in Next.js for every page.
