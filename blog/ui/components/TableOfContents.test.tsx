import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { setupScrollToMock } from '@/shared/testing/dom-mocks';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  it('renders items and scrolls/hashes when clicked', () => {
    setupScrollToMock();

    const item = { id: 'section-1', text: '첫번째 섹션', level: 2 };
    const header = document.createElement('h2');
    header.id = item.id;
    header.getBoundingClientRect = () => ({ top: 320 } as DOMRect);
    document.body.appendChild(header);

    window.history.replaceState = vi.fn();
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();

    class MockIntersectionObserver {
      observe = observeSpy;
      disconnect = disconnectSpy;

      constructor() {
        // noop
      }
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof window.IntersectionObserver;

    const { getByRole } = render(<TableOfContents items={[item]} />);

    const button = getByRole('button', { name: '첫번째 섹션' });
    fireEvent.click(button);

    expect(button).toHaveStyle({
      fontFamily: 'var(--font-sans-emoji)',
    });
    expect(observeSpy).toHaveBeenCalledWith(header);
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      `#${item.id}`
    );
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 220,
      behavior: 'smooth',
    });
  });
});
