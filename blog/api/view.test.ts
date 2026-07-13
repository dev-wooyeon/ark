import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cookies, headers } from 'next/headers';
import { getSupabaseServerClient } from '@/infra/integrations/supabase';
import { getViewCount, incrementView, trackView } from './view';

vi.mock('@/infra/integrations/supabase', () => ({
  getSupabaseServerClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
  headers: vi.fn(),
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
    maybeSingle: ReturnType<typeof vi.fn>;
  };
};

interface CookieStoreLike {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
}

interface HeaderStoreLike {
  get: ReturnType<typeof vi.fn>;
}

function createQueryMock(payload: {
  data: unknown;
  error: { message: string } | null;
}) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
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
const mockedCookies = vi.mocked(cookies);
const mockedHeaders = vi.mocked(headers);
function createCookieStoreMock(
  visitorId: string | null = null
): CookieStoreLike {
  return {
    get: vi
      .fn()
      .mockReturnValue(
        visitorId ? { name: 'view_visitor_id', value: visitorId } : null
      ),
    set: vi.fn(),
  };
}

function createHeaderStoreMock(
  entries: Record<string, string | null>
): HeaderStoreLike {
  return {
    get: vi.fn((name: string) => entries[name] ?? null),
  };
}

describe('view actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCookies.mockResolvedValue(createCookieStoreMock());
    mockedHeaders.mockResolvedValue(
      createHeaderStoreMock({
        'x-forwarded-for': '203.0.113.10',
        'user-agent': 'Vitest Browser',
        'accept-language': 'ko-KR',
      })
    );
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

    expect(client.rpc).toHaveBeenCalledWith(
      'increment_view',
      expect.objectContaining({
        slug_input: 'my-post',
        viewer_fingerprint_input: expect.any(String),
        dedupe_window_seconds_input: 86400,
      })
    );
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

  it('includes fingerprint and dedupe window when tracking view', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 1 }, error: null },
      rpcPayload: { data: 5, error: null },
    });
    mockedGetSupabase.mockReturnValue(client);

    await trackView('my-post');

    expect(client.rpc).toHaveBeenCalledWith(
      'increment_view',
      expect.objectContaining({
        slug_input: 'my-post',
        viewer_fingerprint_input: expect.any(String),
        dedupe_window_seconds_input: 86400,
      })
    );
  });

  it('uses standard client hints platform header for fingerprinting', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 1 }, error: null },
      rpcPayload: { data: 5, error: null },
    });
    const headerStore = createHeaderStoreMock({
      'x-forwarded-for': '203.0.113.10',
      'user-agent': 'Vitest Browser',
      'accept-language': 'ko-KR',
      'sec-ch-ua': '"Chromium";v="126"',
      'sec-ch-ua-platform': '"macOS"',
    });
    mockedGetSupabase.mockReturnValue(client);
    mockedHeaders.mockResolvedValue(headerStore);

    await trackView('my-post');

    expect(headerStore.get).toHaveBeenCalledWith('sec-ch-ua-platform');
    expect(headerStore.get).not.toHaveBeenCalledWith(
      'sec-ch-ua-infrastructure'
    );
  });

  it('falls back to legacy increment signature when rpc argument mismatch occurs', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValueOnce({ data: { count: 12 }, error: null }),
      }),
      rpc: vi
        .fn()
        .mockResolvedValueOnce({
          data: null,
          error: {
            message:
              'Could not find the function public.increment_view(slug_input, viewer_fingerprint_input, dedupe_window_seconds_input)',
          },
        })
        .mockResolvedValueOnce({ data: 12, error: null }),
    };
    mockedGetSupabase.mockReturnValue(client as unknown as SupabaseLike);

    const count = await trackView('my-post');

    expect(client.rpc).toHaveBeenNthCalledWith(
      1,
      'increment_view',
      expect.objectContaining({
        slug_input: 'my-post',
        viewer_fingerprint_input: expect.any(String),
        dedupe_window_seconds_input: 86400,
      })
    );
    expect(client.rpc).toHaveBeenNthCalledWith(2, 'increment_view', {
      slug_input: 'my-post',
    });
    expect(count).toBe(12);
  });

  it('uses fallback visitor cookie when request headers are unavailable', async () => {
    const client = createSupabaseMock({
      queryPayload: { data: { count: 1 }, error: null },
      rpcPayload: { data: 2, error: null },
    });
    const cookieStore = createCookieStoreMock();
    mockedGetSupabase.mockReturnValue(client);
    mockedHeaders.mockResolvedValue(createHeaderStoreMock({}));
    mockedCookies.mockResolvedValue(cookieStore);

    await trackView('my-post');

    expect(cookieStore.set).toHaveBeenCalledTimes(1);
    expect(client.rpc).toHaveBeenCalledWith(
      'increment_view',
      expect.objectContaining({
        slug_input: 'my-post',
        viewer_fingerprint_input: expect.any(String),
      })
    );
  });
});
