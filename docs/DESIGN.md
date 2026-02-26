# DESIGN

Last updated: 2026-02-26

## Source of Truth

1. Tokens: `src/styles/tokens.css`
2. Global style behavior: `src/styles/globals.css`
3. Reusable component patterns: `src/components/ui/**`, `src/components/layout/**`

## Design Guardrails

1. Prefer token usage over hardcoded color/spacing values.
2. Preserve readability-first typography and spacing rhythm.
3. Keep dark-mode behavior aligned with token inversion rules.
4. Validate mobile safe-area behavior when changing navigation or footer patterns.

## Validation Checklist

1. Visual regression on key pages (`/`, `/blog`, `/blog/[slug]`).
2. No layout shift regressions in mobile navigation/header.
3. Color contrast remains accessible for primary text/actions.
