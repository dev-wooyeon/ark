import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MermaidDiagram } from './MermaidDiagram';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
  }),
}));

const mockMermaidRender = vi.fn(async () => ({
  svg: '<svg width="500" height="250"><text>diagram</text></svg>',
}));

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: mockMermaidRender,
  },
}));

describe('MermaidDiagram', () => {
  it('renders diagram and handles zoom/fullscreen workflow', async () => {
    render(<MermaidDiagram chart="graph TD; A-->B" />);

    await waitFor(() => {
      expect(screen.getByText('diagram')).toBeInTheDocument();
      expect(mockMermaidRender).toHaveBeenCalledTimes(1);
    });

    const minus = screen.getByRole('button', { name: '-' });
    const plus = screen.getByRole('button', { name: '+' });
    const full = screen.getByRole('button', { name: '전체화면' });
    const reset = screen.getByRole('button', { name: 'Reset' });

    expect(screen.getByText('100%')).toBeInTheDocument();

    act(() => {
      fireEvent.click(plus);
      fireEvent.click(minus);
      fireEvent.click(reset);
    });

    expect(screen.getByText('100%')).toBeInTheDocument();

    fireEvent.click(full);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const close = screen.getByRole('button', { name: '닫기' });
    fireEvent.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  });

  it('shows plain code fallback when render fails', async () => {
    mockMermaidRender.mockRejectedValueOnce(new Error('render failed'));

    render(<MermaidDiagram chart="graph TD; A-->B" />);

    await waitFor(() => {
      expect(screen.getByText('graph TD; A-->B')).toBeInTheDocument();
    });

    expect(screen.queryByLabelText('Mermaid diagram')).not.toBeInTheDocument();
    expect(screen.getByText('graph TD; A-->B')).toBeInTheDocument();
  });
});
