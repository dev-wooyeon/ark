import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTheme } from 'next-themes';
import { GiscusComments } from './GiscusComments';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@giscus/react', () => ({
  default: () => <div data-testid="giscus-embed" />,
}));

describe('GiscusComments', () => {
  it('renders section and applies dark theme to iframe when present', async () => {
    const postMessage = vi.fn();

    const iframe = document.createElement('iframe');
    iframe.className = 'giscus-frame';
    Object.defineProperty(iframe, 'contentWindow', {
      value: {
        postMessage,
      },
      configurable: true,
    });
    document.body.appendChild(iframe);

    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'dark',
    } as ReturnType<typeof useTheme>);

    render(<GiscusComments slug="redis" />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole('heading', { level: 2, name: '댓글' })).toBeInTheDocument();
    expect(screen.getByTestId('giscus-embed')).toBeInTheDocument();
    expect(postMessage).toHaveBeenCalledWith(
      {
        giscus: {
          setConfig: {
            theme: 'dark',
          },
        },
      },
      'https://giscus.app'
    );

    document.body.removeChild(iframe);
  });
});

