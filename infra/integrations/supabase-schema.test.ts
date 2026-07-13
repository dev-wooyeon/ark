// @vitest-environment node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const schemaPath = path.join(
  process.cwd(),
  'docs',
  'database',
  'supabase-view-count.sql'
);

describe('view count database contract', () => {
  it('updates the daily aggregate only for accepted views', async () => {
    const schema = await readFile(schemaPath, 'utf8');
    const acceptedViewBranch = schema.match(
      /if should_increment then([\s\S]+?)else/
    )?.[1];

    expect(schema).toContain(
      'create table if not exists public.view_daily_counts'
    );
    expect(acceptedViewBranch).toContain(
      'insert into public.view_daily_counts (slug, view_date, count)'
    );
  });

  it('sums daily counts through a restricted recent-popularity rpc', async () => {
    const schema = await readFile(schemaPath, 'utf8');

    expect(schema).toContain('create function public.get_popular_views(');
    expect(schema).toContain('sum(daily.count)::bigint as count');
    expect(schema).toContain(
      'current_date - (least(greatest(coalesce(days_input, 30), 1), 365) - 1)'
    );
    expect(schema).toContain(
      'limit least(greatest(coalesce(limit_input, 5), 1), 100)'
    );
    expect(schema).toContain(
      'revoke all on public.view_daily_counts from anon, authenticated'
    );
  });
});
