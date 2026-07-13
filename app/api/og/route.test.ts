// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('GET /api/og', () => {
  it('returns a non-empty PNG using the bundled Korean font', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url =
          input instanceof URL
            ? input
            : new URL(typeof input === 'string' ? input : input.url);

        if (url.protocol !== 'file:') {
          throw new Error(`Unexpected external font request: ${url.href}`);
        }

        return new Response(await readFile(url), {
          status: 200,
          headers: { 'Content-Type': 'font/ttf' },
        });
      })
    );

    const { GET } = await import('./route');
    const response = await GET(
      new NextRequest(
        'https://ark-log.vercel.app/api/og?title=%ED%95%9C%EA%B8%80%20OG%20%EC%9D%B4%EB%AF%B8%EC%A7%80&tags=Next.js,Ark'
      )
    );
    const bytes = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(bytes.byteLength).toBeGreaterThan(10_000);
    expect(Array.from(bytes.slice(0, PNG_SIGNATURE.length))).toEqual(
      PNG_SIGNATURE
    );
  }, 30_000);
});
