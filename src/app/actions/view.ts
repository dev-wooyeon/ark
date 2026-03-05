'use server';

import { getSupabaseServerClient } from '@/shared/integrations/supabase';

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

function normalizePositiveInt(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

export interface PopularViewEntry {
  slug: string;
  count: number;
  updated_at: string;
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

export async function getPopularViewsInRecentDays(
  days: number,
  limit: number
): Promise<PopularViewEntry[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn(
      '[view-count] Supabase env is missing. Returning empty popular view list.'
    );
    return [];
  }

  const normalizedDays = normalizePositiveInt(days, 30);
  const normalizedLimit = normalizePositiveInt(limit, 5);
  const threshold = new Date(
    Date.now() - normalizedDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from('views')
    .select('slug,count,updated_at')
    .gte('updated_at', threshold)
    .order('count', { ascending: false })
    .limit(normalizedLimit);

  if (error) {
    console.error('Error fetching popular view entries:', error);
    return [];
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => {
      const count = toCount(entry.count);
      const slug = typeof entry.slug === 'string' ? entry.slug.trim() : '';
      const updatedAt =
        typeof entry.updated_at === 'string' ? entry.updated_at : '';

      if (!slug || count === null || !updatedAt) {
        return null;
      }

      return {
        slug,
        count,
        updated_at: updatedAt,
      } satisfies PopularViewEntry;
    })
    .filter((entry): entry is PopularViewEntry => entry !== null)
    .sort((a, b) => {
      if (a.count === b.count) {
        return a.updated_at < b.updated_at ? 1 : -1;
      }

      return b.count - a.count;
    });
}
