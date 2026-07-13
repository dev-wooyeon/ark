create table if not exists public.views (
  slug text primary key,
  count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.view_unique_visitors (
  slug text not null,
  viewer_fingerprint text not null,
  last_viewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, viewer_fingerprint)
);

create table if not exists public.view_daily_counts (
  slug text not null,
  view_date date not null default current_date,
  count bigint not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, view_date)
);

create index if not exists view_daily_counts_recent_idx
  on public.view_daily_counts (view_date desc, count desc);

alter table public.views enable row level security;
alter table public.view_unique_visitors enable row level security;
alter table public.view_daily_counts enable row level security;

drop policy if exists "Allow read view counts" on public.views;
create policy "Allow read view counts"
  on public.views
  for select
  using (true);

drop function if exists public.increment_view(text);
drop function if exists public.increment_view(text, text, integer);
create function public.increment_view(
  slug_input text,
  viewer_fingerprint_input text default null,
  dedupe_window_seconds_input integer default 86400
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_slug text;
  normalized_fingerprint text;
  dedupe_window interval;
  tracked_last_viewed_at timestamptz;
  should_increment boolean := true;
  updated_count bigint;
begin
  normalized_slug := btrim(slug_input);
  if normalized_slug is null or normalized_slug = '' then
    return 0;
  end if;

  normalized_fingerprint := nullif(btrim(viewer_fingerprint_input), '');
  dedupe_window := make_interval(
    secs => greatest(coalesce(dedupe_window_seconds_input, 86400), 0)
  );

  if normalized_fingerprint is not null and dedupe_window > interval '0 seconds' then
    insert into public.view_unique_visitors (
      slug,
      viewer_fingerprint,
      last_viewed_at,
      created_at,
      updated_at
    )
    values (
      normalized_slug,
      normalized_fingerprint,
      now(),
      now(),
      now()
    )
    on conflict do nothing;

    if not found then
      select last_viewed_at
        into tracked_last_viewed_at
      from public.view_unique_visitors
      where slug = normalized_slug
        and viewer_fingerprint = normalized_fingerprint
      for update;

      if tracked_last_viewed_at is null then
        should_increment := true;
      elsif now() - tracked_last_viewed_at >= dedupe_window then
        update public.view_unique_visitors
        set
          last_viewed_at = now(),
          updated_at = now()
        where slug = normalized_slug
          and viewer_fingerprint = normalized_fingerprint;
        should_increment := true;
      else
        update public.view_unique_visitors
        set updated_at = now()
        where slug = normalized_slug
          and viewer_fingerprint = normalized_fingerprint;
        should_increment := false;
      end if;
    end if;
  end if;

  if should_increment then
    insert into public.views (slug, count)
    values (normalized_slug, 1)
    on conflict (slug)
    do update set
      count = public.views.count + 1,
      updated_at = now()
    returning count into updated_count;

    insert into public.view_daily_counts (slug, view_date, count)
    values (normalized_slug, current_date, 1)
    on conflict (slug, view_date)
    do update set
      count = public.view_daily_counts.count + 1,
      updated_at = now();
  else
    select count
      into updated_count
    from public.views
    where slug = normalized_slug;
  end if;

  return coalesce(updated_count, 0);
end;
$$;

drop function if exists public.get_popular_views(integer, integer);
create function public.get_popular_views(
  days_input integer default 30,
  limit_input integer default 5
)
returns table (
  slug text,
  count bigint,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    daily.slug,
    sum(daily.count)::bigint as count,
    max(daily.updated_at) as updated_at
  from public.view_daily_counts as daily
  where daily.view_date >=
    current_date - (least(greatest(coalesce(days_input, 30), 1), 365) - 1)
  group by daily.slug
  order by
    sum(daily.count) desc,
    max(daily.updated_at) desc,
    daily.slug asc
  limit least(greatest(coalesce(limit_input, 5), 1), 100);
$$;

grant select on public.views to anon, authenticated;
revoke all on public.view_daily_counts from anon, authenticated;
revoke all on function public.get_popular_views(integer, integer) from public;
grant execute on function public.increment_view(text, text, integer) to anon, authenticated;
grant execute on function public.get_popular_views(integer, integer) to anon, authenticated;
