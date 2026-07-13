# DB Schema (Generated Summary)

Generated from:

- `docs/database/supabase-view-count.sql`
- `infra/integrations/supabase.ts`

Last updated: 2026-07-13

## Table: `public.views`

| Column       | Type          | Null | Default | Notes       |
| ------------ | ------------- | ---- | ------- | ----------- |
| `slug`       | `text`        | no   | -       | Primary key |
| `count`      | `bigint`      | no   | `0`     | View count  |
| `created_at` | `timestamptz` | no   | `now()` | Insert time |
| `updated_at` | `timestamptz` | no   | `now()` | Update time |

## Table: `public.view_unique_visitors`

| Column               | Type          | Null | Default | Notes                      |
| -------------------- | ------------- | ---- | ------- | -------------------------- |
| `slug`               | `text`        | no   | -       | PK part, post identifier   |
| `viewer_fingerprint` | `text`        | no   | -       | PK part, hashed viewer key |
| `last_viewed_at`     | `timestamptz` | no   | `now()` | Last accepted view time    |
| `created_at`         | `timestamptz` | no   | `now()` | Insert time                |
| `updated_at`         | `timestamptz` | no   | `now()` | Update time                |

## Table: `public.view_daily_counts`

| Column       | Type          | Null | Default        | Notes                       |
| ------------ | ------------- | ---- | -------------- | --------------------------- |
| `slug`       | `text`        | no   | -              | PK part, post identifier    |
| `view_date`  | `date`        | no   | `current_date` | PK part, accepted-view date |
| `count`      | `bigint`      | no   | `0`            | Accepted views for the date |
| `created_at` | `timestamptz` | no   | `now()`        | Insert time                 |
| `updated_at` | `timestamptz` | no   | `now()`        | Update time                 |

## RLS and Grants

- RLS enabled on `public.views`.
- RLS enabled on `public.view_unique_visitors`.
- RLS enabled on `public.view_daily_counts` without a direct read policy.
- Policy: read access allowed for all (`select` using `true`).
- Grants:
  - `select` on `public.views` to `anon`, `authenticated`.
  - execute on `increment_view(text, text, integer)` to `anon`, `authenticated`.
  - execute on `get_popular_views(integer, integer)` to `anon`,
    `authenticated`.

## Function: `public.increment_view(slug_input text, viewer_fingerprint_input text default null, dedupe_window_seconds_input integer default 86400)`

- Language: `plpgsql`
- Security: `security definer`
- Behavior:
  1. Normalize slug and fingerprint input.
  2. If fingerprint exists, enforce dedupe window by `view_unique_visitors.last_viewed_at`.
  3. Increment `views.count` and the current `view_daily_counts` row only when
     outside the dedupe window.
  4. Return latest count (`bigint`).

## Function: `public.get_popular_views(days_input integer default 30, limit_input integer default 5)`

- Language: `sql`, stable, security definer.
- Sums daily accepted views over the requested calendar-day window.
- Bounds the requested window to 365 days and the response to 100 rows.
- Orders by window count, latest accepted view, and slug for deterministic
  results.
- Exposes only aggregated rows; the daily table remains inaccessible directly.

## Type Mapping (App)

`infra/integrations/supabase.ts` defines:

- Table row type for `views`.
- Table row type for `view_daily_counts`.
- RPC signature:
  - `increment_view.Args.slug_input: string`
  - `increment_view.Args.viewer_fingerprint_input?: string`
  - `increment_view.Args.dedupe_window_seconds_input?: number`
  - `Returns: number`
  - `get_popular_views.Args.days_input?: number`
  - `get_popular_views.Args.limit_input?: number`
  - `Returns: Array<{ slug, count, updated_at }>`
