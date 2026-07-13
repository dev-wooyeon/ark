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

alter table public.views enable row level security;
alter table public.view_unique_visitors enable row level security;

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
  else
    select count
      into updated_count
    from public.views
    where slug = normalized_slug;
  end if;

  return coalesce(updated_count, 0);
end;
$$;

grant select on public.views to anon, authenticated;
grant execute on function public.increment_view(text, text, integer) to anon, authenticated;
