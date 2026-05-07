# Docs Index

Last updated: 2026-05-07

This index tracks the smallest set of documentation that must stay aligned with
the current codebase. It is not a full file inventory.

Prefer updating an existing ADR, guide, exec plan, or README before adding a new
standalone document.

## Repository-Level Docs

- `AGENTS.md`
- `ARCHITECTURE.md`

## Active Documentation

- Decisions:
  - `docs/adr/README.md`
  - `docs/adr/*.md`
- Planning:
  - `docs/PLANS.md`
  - `docs/exec-plans/active/README.md`
  - `docs/exec-plans/tech-debt-tracker.md`
- Maintained guides:
  - `docs/guides/**`
- Domain references:
  - `docs/database/**`
  - `docs/product-specs/**`
  - `docs/design-docs/**`

## Reference / Research

- `docs/references/**`
- `docs/research/benchmark/**`
- `docs/research/toss/**`
- `docs/tds-rebuild/**`

## Archive

- `docs/archive/research-generated/**`

## Maintenance Rules

1. Use repository-relative paths only in docs (no absolute local paths).
2. Update `Last updated` when editing policy/process docs.
3. Treat this file as a maintained-doc boundary, not a complete docs inventory.
4. Move stale auto-generated reports to `docs/archive/` instead of deleting context.
5. Keep commands copy-pastable from repository root.
6. Remove or replace stale links when a referenced file no longer exists.
