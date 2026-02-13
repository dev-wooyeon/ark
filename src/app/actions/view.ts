'use server';

import { getSupabaseServerClient } from '@/lib/supabase';

function normalizeSlug(slug: string): string | null {
  const value = slug.trim();
  return value.length > 0 ? value : null;
}

function toCount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

async function readViewCount(slug: string): Promise<number | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('views')
    .select('count')
    .eq('slug', slug)
    .maybeSingle<{ count: number }>();

  if (error) {
    console.error('Error fetching view count:', error);
    return null;
  }

  return data?.count ?? 0;
}

export async function incrementView(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn(
      '[view-count] Supabase env is missing. Skipping increment operation.'
    );
    return;
  }

  const { error } = await supabase.rpc<
    'increment_view',
    { slug_input: string }
  >('increment_view', {
    slug_input: normalizedSlug,
  });
  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

export async function getViewCount(slug: string): Promise<number | null> {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  return readViewCount(normalizedSlug);
}

export async function trackView(slug: string): Promise<number | null> {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn(
      '[view-count] Supabase env is missing. Returning null for view count.'
    );
    return null;
  }

  const { data, error } = await supabase.rpc<
    'increment_view',
    { slug_input: string }
  >('increment_view', {
    slug_input: normalizedSlug,
  });

  if (error) {
    console.error('Error incrementing view count:', error);
    return readViewCount(normalizedSlug);
  }

  const count = toCount(data);
  if (count !== null) {
    return count;
  }

  return readViewCount(normalizedSlug);
}
