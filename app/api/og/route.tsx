import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { SITE_NAME } from '@/site/config/site';

export const runtime = 'nodejs';

const fontPath = join(process.cwd(), 'app', 'api', 'og', 'Pretendard-Bold.ttf');
let fontDataPromise: Promise<ArrayBuffer> | null = null;

function loadFontData(): Promise<ArrayBuffer> {
  if (!fontDataPromise) {
    fontDataPromise = readFile(fontPath).then(
      (font) =>
        font.buffer.slice(
          font.byteOffset,
          font.byteOffset + font.byteLength
        ) as ArrayBuffer
    );
  }

  return fontDataPromise;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || SITE_NAME;
  const date = searchParams.get('date');
  const tags = searchParams.get('tags')?.split(',') || [];

  const fontData = await loadFontData();

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom right, #EAEBEA, #E0E1E3)',
        padding: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'Pretendard',
        }}
      >
        {date && (
          <div
            style={{
              fontSize: '30px',
              color: '#52525B',
            }}
          >
            {date}
          </div>
        )}
        <div
          style={{
            fontSize: '60px',
            fontWeight: 700,
            color: '#252525',
            lineHeight: 1.2,
            wordBreak: 'keep-all',
          }}
        >
          {title}
        </div>
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '10px',
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  backgroundColor: '#E0E1E3',
                  color: '#3F3F46',
                  padding: '8px 24px',
                  borderRadius: '50px',
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#3F3F46',
            fontFamily: 'Pretendard',
          }}
        >
          {SITE_NAME}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
