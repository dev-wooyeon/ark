# DB Schema (Generated Summary)

Generated from:

- `docs/database/supabase-view-count.sql`
- `src/shared/integrations/supabase.ts`

Last updated: 2026-04-16

## Table: `public.views`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `slug` | `text` | no | - | Primary key |
| `count` | `bigint` | no | `0` | View count |
| `created_at` | `timestamptz` | no | `now()` | Insert time |
| `updated_at` | `timestamptz` | no | `now()` | Update time |

## Table: `public.view_unique_visitors`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `slug` | `text` | no | - | PK part, post identifier |
| `viewer_fingerprint` | `text` | no | - | PK part, hashed viewer key |
| `last_viewed_at` | `timestamptz` | no | `now()` | Last accepted view time |
| `created_at` | `timestamptz` | no | `now()` | Insert time |
| `updated_at` | `timestamptz` | no | `now()` | Update time |

## RLS and Grants

- RLS enabled on `public.views`.
- RLS enabled on `public.view_unique_visitors`.
- Policy: read access allowed for all (`select` using `true`).
- Grants:
  - `select` on `public.views` to `anon`, `authenticated`.
  - execute on `increment_view(text, text, integer)` to `anon`, `authenticated`.

## Function: `public.increment_view(slug_input text, viewer_fingerprint_input text default null, dedupe_window_seconds_input integer default 86400)`

- Language: `plpgsql`
- Security: `security definer`
- Behavior:
  1. Normalize slug and fingerprint input.
  2. If fingerprint exists, enforce dedupe window by `view_unique_visitors.last_viewed_at`.
  3. Increment `views.count` only when outside dedupe window.
  4. Return latest count (`bigint`).

## Type Mapping (App)

`src/shared/integrations/supabase.ts` defines:

- Table row type for `views`.
- RPC signature:
  - `increment_view.Args.slug_input: string`
  - `increment_view.Args.viewer_fingerprint_input?: string`
  - `increment_view.Args.dedupe_window_seconds_input?: number`
  - `Returns: number`
