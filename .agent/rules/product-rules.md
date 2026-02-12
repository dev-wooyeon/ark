---
trigger: always_on
---

# Product Rules (Unified)

## Stack

- Framework: `Next.js 16` + App Router
- Language: `TypeScript`
- UI: `React 19`, `Tailwind CSS 4`, CSS Variables
- Content: `MDX` (custom webpack loader)
- Animation: `@react-three/fiber`, `@react-three/drei`, `framer-motion`
- Test: `Vitest`

## Implementation Rules

- Default to Server Components. Use Client Components only for interaction.
- Do not use arbitrary Tailwind values (`p-[13px]` etc.).
- Prefer tokens in `src/styles/tokens.css` over component-level hardcoding.
- Keep animation code in `src/components/animations/`.
- Use `useFrame` instead of `requestAnimationFrame`.
- Do not use `any`. Use concrete types or `unknown` + narrowing.

## Design Rules

- Prioritize global consistency over local styling convenience.
- Reuse semantic tokens:
  - Text: `--color-text-*`
  - Background: `--color-bg-*`
  - Border: `--color-border*`
- Handle dark mode via `.dark` token overrides, not per-component ad hoc values.
- Use 8pt spacing rhythm (`4, 8, 12, 16, 24, 32...`).
- Use standard radii (`--radius-sm`, `--radius-md`, `--radius-lg`).

## UX Rules

- Use short and clear wording.
- One sentence, one message.
- Avoid ambiguous terms. Prefer numbers/conditions.
- Show immediate feedback on interaction.
- Always design loading, empty, and error states.
- Mobile first:
  - Minimum touch target `44x44px` (recommended `48x48px`)
  - Minimum gap between touch targets `8px`
- Accessibility:
  - Body text contrast `4.5:1+`
  - Large text/UI contrast `3:1+`
  - Keyboard navigation and focus visibility required

## Quality Gates

- Required after code changes: `npm run build`
- For logic changes: run tests (`npm test` or target tests)
- Use semantic HTML and meaningful `alt` text
- Manage page metadata with Next Metadata API
