import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSupabaseServerClient } from './supabase';

const mockCreateClient = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

describe('supabase client factory', () => {
  beforeEach(() => {
    mockCreateClient.mockReset();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('returns null when environment variables are missing', () => {
    const client = getSupabaseServerClient();

    expect(client).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('creates and caches server client when env vars are provided', () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'token';

    const first = getSupabaseServerClient();
    const second = getSupabaseServerClient();

    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'token',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
    expect(first).toBe(second);
  });
});
