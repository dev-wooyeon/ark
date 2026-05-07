import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AgentationOverlay from './AgentationOverlay';

vi.mock('agentation', () => ({
  Agentation: ({
    endpoint,
    webhookUrl,
  }: {
    endpoint: string;
    webhookUrl: string;
  }) => (
    <div
      data-testid="agentation-overlay"
      data-endpoint={endpoint}
      data-webhook-url={webhookUrl}
    />
  ),
}));

describe('AgentationOverlay', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('does not render the overlay when health check fails', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false }),
    } as Response);

    global.fetch = fetchMock;

    render(<AgentationOverlay />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/agentation/health', {
        cache: 'no-store',
      });
    });

    expect(screen.queryByTestId('agentation-overlay')).not.toBeInTheDocument();
  });

  it('renders the overlay when health check succeeds', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    global.fetch = fetchMock;

    render(<AgentationOverlay />);

    const overlay = await screen.findByTestId('agentation-overlay');

    expect(overlay).toHaveAttribute(
      'data-endpoint',
      '/api/agentation-sync'
    );
    expect(overlay).toHaveAttribute(
      'data-webhook-url',
      '/api/agentation/webhook'
    );
  });

  it('passes through a custom endpoint when configured', async () => {
    vi.stubEnv(
      'NEXT_PUBLIC_AGENTATION_ENDPOINT',
      'https://agentation.example.com'
    );

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    global.fetch = fetchMock;

    render(<AgentationOverlay />);

    const overlay = await screen.findByTestId('agentation-overlay');

    expect(overlay).toHaveAttribute(
      'data-endpoint',
      'https://agentation.example.com'
    );
  });
});
