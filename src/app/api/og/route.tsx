import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'eunu.log';
  const date = searchParams.get('date');
  const tags = searchParams.get('tags')?.split(',') || [];

  // Load Noto Sans KR for consistent rendering across environments
  // Using a Google Fonts raw file as a reliable source
  const fontData = await fetch(
    new URL(
      'https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.otf',
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

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
          fontFamily: '"Noto Sans KR"',
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
            fontFamily: '"Noto Sans KR"',
          }}
        >
          eunu.log
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans KR',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
