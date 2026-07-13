// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

describe('GET /api/og', () => {
  it('returns a non-empty PNG from the Node.js runtime', async () => {
    const { GET, runtime } = await import('./route');
    const response = await GET(
      new NextRequest(
        'https://ark-log.vercel.app/api/og?title=%ED%95%9C%EA%B8%80%20OG%20%EC%9D%B4%EB%AF%B8%EC%A7%80&tags=Next.js,Ark'
      )
    );
    const bytes = new Uint8Array(await response.arrayBuffer());

    expect(runtime).toBe('nodejs');
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(bytes.byteLength).toBeGreaterThan(10_000);
    expect(Array.from(bytes.slice(0, PNG_SIGNATURE.length))).toEqual(
      PNG_SIGNATURE
    );
  }, 30_000);
});
