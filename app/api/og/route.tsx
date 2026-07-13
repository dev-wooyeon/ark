import { readFile } from 'node:fs/promises';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { SITE_NAME } from '@/site/config/site';

export const runtime = 'nodejs';

const fontUrl = new URL('./Pretendard-Bold.ttf', import.meta.url);
let fontDataPromise: Promise<ArrayBuffer> | null = null;

function loadFontData(): Promise<ArrayBuffer> {
  if (!fontDataPromise) {
    fontDataPromise = readFile(fontUrl).then(
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
        backgroundImage: 'linear-gradient(to bottom right, #E0F2FF, #fff)',
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
              color: '#6b7684',
            }}
          >
            {date}
          </div>
        )}
        <div
          style={{
            fontSize: '60px',
            fontWeight: 700,
            color: '#191f28',
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
                  backgroundColor: 'rgba(49, 130, 246, 0.1)',
                  color: '#3182f6',
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
            color: '#3182f6',
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
