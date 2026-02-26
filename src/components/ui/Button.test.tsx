import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '.';

describe('Button', () => {
  it('renders default button label', () => {
    render(<Button>클릭</Button>);
    expect(screen.getByRole('button', { name: '클릭' })).toBeInTheDocument();
  });

  it('renders anchor variant for internal links', () => {
    render(
      <Button as="a" href="/blog">
        블로그
      </Button>
    );

    expect(screen.getByRole('link', { name: '블로그' })).toHaveAttribute('href', '/blog');
  });

  it('renders anchor variant for external links', () => {
    render(
      <Button as="a" href="https://example.com">
        외부 링크
      </Button>
    );

    expect(screen.getByRole('link', { name: '외부 링크' })).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });

  it('shows loading indicator and disables interaction when loading', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button loading onClick={onClick}>
        로딩
      </Button>
    );

    const button = container.querySelector('button');

    expect(button).not.toBeNull();
    if (!button) return;

    expect(button).toBeDisabled();
    button.click();

    expect(onClick).not.toHaveBeenCalled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('supports tertiary variant style markers', () => {
    render(<Button variant="tertiary">아웃라인</Button>);
    const button = screen.getByRole('button', { name: '아웃라인' });
    expect(button).toHaveClass('text-[var(--color-toss-blue)]');
  });

  it('expands width when fullWidth is true', () => {
    render(
      <Button fullWidth variant="secondary">
        전체폭
      </Button>
    );

    expect(screen.getByRole('button', { name: '전체폭' })).toHaveClass('w-full');
  });

  it('renders left and right icons', () => {
    const icon = <span aria-hidden="true">★</span>;
    render(
      <Button leftIcon={icon} rightIcon={icon}>
        아이콘
      </Button>
    );

    expect(screen.getByRole('button', { name: '아이콘' })).toContainHTML('★');
  });
});
