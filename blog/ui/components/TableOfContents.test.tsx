import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  it('renders native hash links and observes headings', () => {
    const item = { id: 'section-1', text: '첫번째 섹션', level: 2 };
    const header = document.createElement('h2');
    header.id = item.id;
    document.body.appendChild(header);

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

    const { container, getByRole } = render(<TableOfContents items={[item]} />);

    const link = getByRole('link', { name: '첫번째 섹션' });
    fireEvent.click(link);

    expect(container.querySelector('nav')).toBeNull();
    expect(document.body.querySelector('nav')).toHaveClass('bottom-8');
    expect(document.body.querySelector('nav > div')).toHaveClass(
      'h-full',
      'overflow-y-auto'
    );
    expect(document.body.querySelector('ul')).toHaveClass('m-0', 'p-0');
    expect(link).toHaveAttribute('href', `#${item.id}`);
    expect(link).toHaveStyle({
      fontFamily: 'var(--font-sans-emoji)',
    });
    expect(observeSpy).toHaveBeenCalledWith(header);
  });
});
