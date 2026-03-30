# Refactor to Standard Next.js Structure

Status: superseded on 2026-03-30

## 1. Goal

This plan proposed flattening the current feature-first structure into a more
generic Next.js layout. It is no longer active because the repository guidance
now explicitly preserves `src/features`, `src/shared`, `src/domains`, and
`src/core` by responsibility.

## 2. Scope

- Do not execute the flattening migration described in the original draft.
- Keep the existing feature-first layout intact unless the repository
  guidelines are intentionally changed.
- Preserve the current MDX pipeline and visualization component placement.
- Retain this file only as a record of a rejected direction.

## 3. Constraints

- Repository guidelines take precedence over this draft.
- No directory flattening should happen while `AGENTS.md` requires the
  feature-first structure.
- Future structure work must start from an updated execution plan.

## 4. Milestones

1. Mark the draft as superseded.
2. Move it out of `docs/exec-plans/active/`.
3. Revisit only if repository guidelines change.

## 5. Verification

- Confirm no active execution plan in this repository asks for structure
  flattening.
- Keep the active plan folder reserved for work that still matches current
  repository rules.

## 6. Rollback

- Restore the file to `docs/exec-plans/active/` only if the repository
  guidelines are deliberately changed and the plan is rewritten to match the
  new rules.
