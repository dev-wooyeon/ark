import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSupabaseServerClient } from '@/shared/integrations/supabase';
import {
  getPopularViewsInRecentDays,
  getViewCount,
  incrementView,
  trackView,
} from './view';

vi.mock('@/shared/integrations/supabase', () => ({
  getSupabaseServerClient: vi.fn(),
}));

interface RpcResult {
  data: unknown;
  error: { message: string } | null;
}

type SupabaseLike = {
  from: ReturnType<typeof vi.fn>;
  rpc: ReturnType<typeof vi.fn>;
  __queryMock: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    gte: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
  };
};

function createQueryMock(payload: {
  data: unknown;
  error: { message: string } | null;
}) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(payload),
    maybeSingle: vi.fn().mockResolvedValue(payload),
  };
}

function createRpcResponse(payload: RpcResult) {
  return vi.fn().mockResolvedValue(payload);
}

function createSupabaseMock(options: {
  queryPayload: { data: unknown; error: { message: string } | null };
  rpcPayload: RpcResult;
}) {
  const queryMock = createQueryMock(options.queryPayload);

  return {
    from: vi.fn().mockReturnValue(queryMock),
    rpc: createRpcResponse(options.rpcPayload),
    __queryMock: queryMock,
  } as unknown as SupabaseLike;
}

const mockedGetSupabase = vi.mocked(getSupabaseServerClient);

describe('view actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('increments view when slug is valid and client exists', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 10 }, error: null },
      rpcPayload: { data: 11, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    await incrementView('  valid-slug  ');

    expect(client.rpc).toHaveBeenCalledWith('increment_view', {
      slug_input: 'valid-slug',
    });
  });

  it('skips increment when slug is blank', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 10 }, error: null },
      rpcPayload: { data: 11, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    await incrementView('   ');

    expect(client.rpc).not.toHaveBeenCalled();
  });

  it('returns null when no supabase client is available', async () => {
    mockedGetSupabase.mockReturnValue(null);

    const count = await getViewCount('my-post');
    expect(count).toBeNull();
  });

  it('returns null on trackView when supabase client is missing', async () => {
    mockedGetSupabase.mockReturnValue(null);

    const count = await trackView('my-post');

    expect(count).toBeNull();
  });

  it('reads count from view row', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 42 }, error: null },
      rpcPayload: { data: 0, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    const count = await getViewCount('my-post');
    expect(count).toBe(42);
    expect(client.from).toHaveBeenCalledWith('views');
    expect(client.__queryMock.select).toHaveBeenCalledWith('count');
    expect(client.__queryMock.eq).toHaveBeenCalledWith('slug', 'my-post');
    expect(client.__queryMock.maybeSingle).toHaveBeenCalledTimes(1);
  });

  it('returns 0 when view row exists without count', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: {}, error: null },
      rpcPayload: { data: 0, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    const count = await getViewCount('my-post');

    expect(count).toBe(0);
  });

  it('returns null for invalid slug in trackView', async () => {
    mockedGetSupabase.mockReturnValue(
      createSupabaseMock({
        queryPayload: { data: { count: 1 }, error: null },
        rpcPayload: { data: 1, error: null },
      })
    );

    const count = await trackView('');

    expect(count).toBeNull();
  });

  it('falls back to read path when increment RPC fails', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValueOnce({ data: { count: 9 }, error: null }),
      }),
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'rpc failed' },
      }),
    };
    mockedGetSupabase.mockReturnValue(client as unknown as SupabaseLike);

    const count = await trackView('my-post');

    expect(client.rpc).toHaveBeenCalledWith('increment_view', {
      slug_input: 'my-post',
    });
    expect(count).toBe(9);
  });

  it('returns rpc count directly when available', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 1 }, error: null },
      rpcPayload: { data: 15, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    const count = await trackView('my-post');

    expect(count).toBe(15);
  });

  it('fetches popular views with recent-day filter and descending count order', async () => {
    const client = createSupabaseMock({
      queryPayload: {
        data: [
          {
            slug: 'a',
            count: 10,
            updated_at: '2026-03-05T00:00:00.000Z',
          },
          {
            slug: 'b',
            count: 10,
            updated_at: '2026-03-04T00:00:00.000Z',
          },
        ],
        error: null,
      },
      rpcPayload: { data: 0, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    const result = await getPopularViewsInRecentDays(30, 5);

    expect(client.from).toHaveBeenCalledWith('views');
    expect(client.__queryMock.select).toHaveBeenCalledWith(
      'slug,count,updated_at'
    );
    expect(client.__queryMock.gte).toHaveBeenCalledWith(
      'updated_at',
      expect.any(String)
    );
    expect(client.__queryMock.order).toHaveBeenCalledWith('count', {
      ascending: false,
    });
    expect(client.__queryMock.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual([
      { slug: 'a', count: 10, updated_at: '2026-03-05T00:00:00.000Z' },
      { slug: 'b', count: 10, updated_at: '2026-03-04T00:00:00.000Z' },
    ]);
  });

  it('returns empty list when supabase is unavailable for popular query', async () => {
    mockedGetSupabase.mockReturnValue(null);

    const result = await getPopularViewsInRecentDays(30, 5);

    expect(result).toEqual([]);
  });

  it('returns empty list when popular query fails', async () => {
    const client = createSupabaseMock({
      queryPayload: {
        data: null,
        error: { message: 'failed' },
      },
      rpcPayload: { data: 0, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    const result = await getPopularViewsInRecentDays(30, 5);

    expect(result).toEqual([]);
  });

  it('normalizes invalid day/limit inputs for popular query', async () => {
    const client = createSupabaseMock({
      queryPayload: {
        data: [],
        error: null,
      },
      rpcPayload: { data: 0, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    await getPopularViewsInRecentDays(0, 0);

    expect(client.__queryMock.limit).toHaveBeenCalledWith(1);
  });
});
