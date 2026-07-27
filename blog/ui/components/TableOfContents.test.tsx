import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  it('renders native hash links and observes headings', () => {
    const items = [
      { id: 'section-1', text: '첫번째 섹션', level: 2 },
      { id: 'section-2', text: '두번째 섹션', level: 2 },
    ];
    const header = document.createElement('h2');
    header.id = items[0].id;
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

    const { container, getByRole } = render(<TableOfContents items={items} />);

    const link = getByRole('link', { name: '첫번째 섹션' });
    fireEvent.click(link);

    expect(container.querySelector('nav')).toHaveClass('ark-article-toc');
    expect(container.querySelector('nav > ol')).toHaveClass(
      'ark-article-toc-list'
    );
    expect(link).toHaveAttribute('href', `#${items[0].id}`);
    expect(link).toHaveClass('ark-article-toc-link');
    expect(observeSpy).toHaveBeenCalledWith(header);
  });
});
