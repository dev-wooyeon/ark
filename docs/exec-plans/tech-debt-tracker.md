# Tech Debt Tracker

Last reviewed: 2026-02-26

## Open Items

| ID | Area | Issue | Impact | Suggested Fix |
| --- | --- | --- | --- | --- |
| TD-001 | Docs drift | Runtime versions in docs differ from `package.json` (`next@16`, `react@19`). | Medium | Align AGENTS/README/architecture docs with actual stack. |
| TD-002 | Analytics | `layout.tsx` mounts GA and page-view trackers more than once. | Medium | Keep single source of truth per tracker in root layout. |
| TD-003 | SEO | JSON-LD OG URL path/domain may not match OG route conventions. | Low | Standardize canonical site URL + OG endpoint helper. |
| TD-004 | Repo hygiene | `.DS_Store` exists under `src/app`. | Low | Remove and block with `.gitignore`. |
| TD-005 | Structure docs | Docs reference `src/components/animations` but tree currently uses `visualization` components. | Medium | Update docs or reintroduce explicit animation folder with ownership. |

## Tracking Rules

1. Add issue IDs in PR descriptions when resolving debt.
2. Move resolved rows to a changelog section with date and commit reference.
