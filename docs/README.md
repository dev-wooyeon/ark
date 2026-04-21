# Docs Index

Last updated: 2026-04-17

This index tracks the active documentation that should stay aligned with the
current codebase. If a document is missing here, add it when the document
becomes part of the maintained workflow.

## Repository-Level Docs

- `AGENTS.md`
- `ARCHITECTURE.md`

## Active Documentation

- Engineering baseline:
  - `docs/FRONTEND.md`
  - `docs/DESIGN.md`
  - `docs/RELIABILITY.md`
  - `docs/SECURITY.md`
  - `docs/QUALITY_SCORE.md`
  - `docs/blog-quality-guide.md`
- Delivery/process:
  - `docs/PLANS.md`
  - `docs/exec-plans/active/README.md`
  - `docs/exec-plans/completed/README.md`
  - `docs/exec-plans/tech-debt-tracker.md`
  - `docs/guides/agentation-workflow.md`
  - `docs/guides/pr-workflow.md`
  - `docs/guides/testing-guide.md`
  - `docs/guides/ai-collaboration.md`
  - `docs/guides/ui-components-guide.md`
- Product/domain:
  - `docs/PRODUCT_SENSE.md`
  - `docs/product-specs/index.md`
  - `docs/product-specs/new-user-onboarding.md`
  - `docs/design-docs/index.md`
  - `docs/design-docs/core-beliefs.md`
- Data/analytics:
  - `docs/analytics/analytics-kpi-weekly-template.md`
  - `docs/database/db-schema.md`
  - `docs/database/supabase-view-count.sql`

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
3. Move stale auto-generated reports to `docs/archive/` instead of deleting context.
4. Keep commands copy-pastable from repository root.
5. Remove or replace stale links when a referenced file no longer exists.
