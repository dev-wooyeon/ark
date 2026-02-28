create table if not exists public.views (
  slug text primary key,
  count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.views enable row level security;

drop policy if exists "Allow read view counts" on public.views;
create policy "Allow read view counts"
  on public.views
  for select
  using (true);

create or replace function public.increment_view(slug_input text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count bigint;
begin
  insert into public.views (slug, count)
  values (slug_input, 1)
  on conflict (slug)
  do update set
    count = public.views.count + 1,
    updated_at = now()
  returning count into updated_count;

  return updated_count;
end;
$$;

grant select on public.views to anon, authenticated;
grant execute on function public.increment_view(text) to anon, authenticated;
