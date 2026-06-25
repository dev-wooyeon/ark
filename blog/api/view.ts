'use server';

import { createHash, randomUUID } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { getSupabaseServerClient } from '@/infra/integrations/supabase';
import { SITE_BRAND } from '@/site/config/site';

const VIEW_DEDUPE_WINDOW_SECONDS = 60 * 60 * 24;
const VIEW_FINGERPRINT_SALT =
  process.env.VIEW_FINGERPRINT_SALT ??
  `${SITE_BRAND.technicalName}-view-fingerprint-v1`;
const VIEW_FALLBACK_VISITOR_COOKIE = 'view_visitor_id';
const VIEW_FALLBACK_VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const NEXT_PHASE_PRODUCTION_BUILD = 'phase-production-build';
const shouldLogViewIssues = process.env.NODE_ENV !== 'test';

function readErrorField(error: unknown, field: 'code' | 'message'): string {
  if (typeof error !== 'object' || error === null) {
    return '';
  }

  const value = (error as Record<string, unknown>)[field];
  return typeof value === 'string' ? value.trim() : '';
}

function summarizeOperationalError(error: unknown): string {
  const code = readErrorField(error, 'code');
  const message =
    error instanceof Error
      ? error.message.trim()
      : readErrorField(error, 'message');

  if (code && message) {
    return `${code}: ${message}`;
  }

  return message || code || 'unknown error';
}

function logViewWarning(message: string): void {
  if (!shouldLogViewIssues) {
    return;
  }

  console.warn(`[view-count] ${message}`);
}

function logViewError(message: string, error: unknown): void {
  if (!shouldLogViewIssues) {
    return;
  }

  console.error(
    `[view-count] ${message} (${summarizeOperationalError(error)})`
  );
}

function isProductionBuildPhase(): boolean {
  return (
    process.env.NEXT_PHASE === NEXT_PHASE_PRODUCTION_BUILD ||
    process.env.npm_lifecycle_event === 'build'
  );
}

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

function readHeaderValue(
  headerStore: Awaited<ReturnType<typeof headers>>,
  names: string[]
): string {
  for (const name of names) {
    const value = headerStore.get(name);
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return '';
}

function normalizeIpAddress(rawValue: string): string {
  if (!rawValue) {
    return '';
  }

  const [first] = rawValue.split(',');
  return first?.trim() ?? '';
}

function getOrCreateFallbackVisitorId(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): string {
  const existingId = cookieStore.get(VIEW_FALLBACK_VISITOR_COOKIE)?.value;
  if (existingId && existingId.trim().length > 0) {
    return existingId;
  }

  const visitorId = randomUUID();
  cookieStore.set({
    name: VIEW_FALLBACK_VISITOR_COOKIE,
    value: visitorId,
    maxAge: VIEW_FALLBACK_VISITOR_COOKIE_MAX_AGE_SECONDS,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return visitorId;
}

async function createViewerFingerprint(): Promise<string> {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const ipAddress = normalizeIpAddress(
    readHeaderValue(headerStore, [
      'x-forwarded-for',
      'x-real-ip',
      'cf-connecting-ip',
      'fly-client-ip',
      'true-client-ip',
    ])
  );
  const userAgent = readHeaderValue(headerStore, ['user-agent']);
  const acceptLanguage = readHeaderValue(headerStore, ['accept-language']);
  const secChUa = readHeaderValue(headerStore, ['sec-ch-ua']);
  const secChUaPlatform = readHeaderValue(headerStore, ['sec-ch-ua-platform']);

  const signatureParts = [
    ipAddress,
    userAgent,
    acceptLanguage,
    secChUa,
    secChUaPlatform,
  ].filter((value) => value.length > 0);

  const signatureSource =
    signatureParts.length > 0
      ? signatureParts.join('|')
      : `visitor:${getOrCreateFallbackVisitorId(cookieStore)}`;

  return createHash('sha256')
    .update(`${VIEW_FINGERPRINT_SALT}|${signatureSource}`)
    .digest('hex');
}

function isLegacyIncrementViewSignatureError(error: {
  message: string;
  details?: string;
  hint?: string;
}): boolean {
  const fullText = `${error.message} ${error.details ?? ''} ${error.hint ?? ''}`
    .trim()
    .toLowerCase();

  return (
    fullText.includes('increment_view') &&
    (fullText.includes('function') ||
      fullText.includes('signature') ||
      fullText.includes('matches'))
  );
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
    logViewError('Failed to fetch view count.', error);
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
    logViewWarning('Supabase env is missing. Skipping increment operation.');
    return;
  }

  const { error } = await supabase.rpc<
    'increment_view',
    { slug_input: string }
  >('increment_view', {
    slug_input: normalizedSlug,
  });
  if (error) {
    logViewError('Failed to increment view count.', error);
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
    logViewWarning('Supabase env is missing. Returning null for view count.');
    return null;
  }

  const viewerFingerprint = await createViewerFingerprint();
  const { data, error } = await supabase.rpc<
    'increment_view',
    {
      slug_input: string;
      viewer_fingerprint_input?: string;
      dedupe_window_seconds_input?: number;
    }
  >('increment_view', {
    slug_input: normalizedSlug,
    viewer_fingerprint_input: viewerFingerprint,
    dedupe_window_seconds_input: VIEW_DEDUPE_WINDOW_SECONDS,
  });

  if (error) {
    if (isLegacyIncrementViewSignatureError(error)) {
      const legacyResult = await supabase.rpc<
        'increment_view',
        {
          slug_input: string;
        }
      >('increment_view', {
        slug_input: normalizedSlug,
      });

      if (legacyResult.error) {
        logViewError('Failed to increment view count.', legacyResult.error);
        return readViewCount(normalizedSlug);
      }

      const legacyCount = toCount(legacyResult.data);
      if (legacyCount !== null) {
        return legacyCount;
      }

      return readViewCount(normalizedSlug);
    }

    logViewError('Failed to increment view count.', error);
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
  if (isProductionBuildPhase()) {
    return [];
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    logViewWarning(
      'Supabase env is missing. Returning empty popular view list.'
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
    logViewError('Failed to fetch popular view entries.', error);
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
