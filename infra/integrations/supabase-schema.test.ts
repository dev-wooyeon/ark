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
  it('stores accepted views in the lifetime counter', async () => {
    const schema = await readFile(schemaPath, 'utf8');
    const acceptedViewBranch = schema.match(
      /if should_increment then([\s\S]+?)else/
    )?.[1];

    expect(acceptedViewBranch).toContain(
      'insert into public.views (slug, count)'
    );
    expect(schema).not.toContain('public.view_daily_counts');
  });

  it('keeps fingerprint deduplication without a popularity rpc', async () => {
    const schema = await readFile(schemaPath, 'utf8');

    expect(schema).toContain(
      'create table if not exists public.view_unique_visitors'
    );
    expect(schema).toContain('create function public.increment_view(');
    expect(schema).not.toContain('get_popular_views');
  });
});
