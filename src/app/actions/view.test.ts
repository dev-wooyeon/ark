import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSupabaseServerClient } from '@/shared/integrations/supabase';
import { getViewCount, incrementView, trackView } from './view';

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
    maybeSingle: ReturnType<typeof vi.fn>;
  };
};

function createQueryMock(payload: { data: unknown; error: { message: string } | null }) {
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
});
