# DB Schema (Generated Summary)

Generated from:

- `docs/supabase-view-count.sql`
- `src/lib/supabase.ts`

Last updated: 2026-02-26

## Table: `public.views`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `slug` | `text` | no | - | Primary key |
| `count` | `bigint` | no | `0` | View count |
| `created_at` | `timestamptz` | no | `now()` | Insert time |
| `updated_at` | `timestamptz` | no | `now()` | Update time |

## RLS and Grants

- RLS enabled on `public.views`.
- Policy: read access allowed for all (`select` using `true`).
- Grants:
  - `select` on `public.views` to `anon`, `authenticated`.
  - execute on `increment_view(text)` to `anon`, `authenticated`.

## Function: `public.increment_view(slug_input text)`

- Language: `plpgsql`
- Security: `security definer`
- Behavior:
  1. Insert slug with `count=1`.
  2. On conflict, increment count and update `updated_at`.
  3. Return latest count (`bigint`).

## Type Mapping (App)

`src/lib/supabase.ts` defines:

- Table row type for `views`.
- RPC signature: `increment_view.Args.slug_input: string`, `Returns: number`.
