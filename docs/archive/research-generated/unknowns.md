# Project Unknowns (Auto-Generated)

Generated on: 2026-02-26
Method: static repo inspection (`package.json`, `src/`, `docs/`, `AGENTS.md`, `README.md`)

## Confirmed Mismatches

1. Stack version drift:
   - Docs describe Next.js 14+/React 18+, but current dependencies are Next.js 16.1.4 and React 19.2.3.
2. Component structure drift:
   - `AGENTS.md` references `src/components/animations/`, but current tree has no such folder.
3. Layout instrumentation duplication:
   - `src/app/layout.tsx` mounts `GoogleAnalytics` and `PageViewTracker` more than once.
4. SEO path/domain inconsistency:
   - Post JSON-LD image points to `https://eunu.log/og?...`, while OG endpoint is `/api/og` and canonical domain usage elsewhere is `https://eunu-log.vercel.app`.
5. Documentation tree drift:
   - Prior docs set did not include the engineering scaffold requested here.

## Open Questions

1. Canonical domain:
   - Should canonical metadata move to `https://eunu.log` or stay on `https://eunu-log.vercel.app`?
2. Animation ownership:
   - Should animation and algorithm-visualization components stay merged under `visualization`, or be split into an explicit `animations` domain?
3. Analytics architecture:
   - Is dual tracker mount intentional for compatibility, or accidental duplicate event risk?
4. MDX pipeline strategy:
   - Keep custom webpack MDX loader, or migrate to modern Next.js-native MDX integration?
5. Operational baseline:
   - Is GitHub Actions intentionally absent, or should minimal CI be added for lint/unit smoke checks?

## High-Leverage Next Clarifications

1. Choose one canonical site URL and apply everywhere.
2. Confirm desired component domain boundaries (`visualization` vs `animations`).
3. Decide whether to enforce CI for `lint + unit + e2e smoke`.
