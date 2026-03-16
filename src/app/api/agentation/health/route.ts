import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEFAULT_AGENTATION_TARGET = 'http://127.0.0.1:4747';
const DEFAULT_AGENTATION_ENDPOINT = '/api/agentation-sync';
const AGENTATION_PROXY_TARGET =
  process.env.AGENTATION_PROXY_TARGET ?? DEFAULT_AGENTATION_TARGET;
const AGENTATION_ENDPOINT =
  process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT ?? DEFAULT_AGENTATION_ENDPOINT;
const HEALTHCHECK_TIMEOUT_MS = 1500;

function buildHealthUrl(): string {
  if (
    AGENTATION_ENDPOINT.startsWith('http://') ||
    AGENTATION_ENDPOINT.startsWith('https://')
  ) {
    return new URL('/health', AGENTATION_ENDPOINT).toString();
  }

  try {
    return new URL('/health', AGENTATION_PROXY_TARGET).toString();
  } catch {
    return new URL('/health', DEFAULT_AGENTATION_TARGET).toString();
  }
}

function jsonResponse(ok: boolean, status: number) {
  return NextResponse.json(
    { ok },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return jsonResponse(false, 404);
  }

  try {
    const response = await fetch(buildHealthUrl(), {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(HEALTHCHECK_TIMEOUT_MS),
    });

    return jsonResponse(response.ok, response.ok ? 200 : 503);
  } catch {
    return jsonResponse(false, 503);
  }
}
