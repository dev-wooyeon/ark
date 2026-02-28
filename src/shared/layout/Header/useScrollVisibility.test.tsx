import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEffect, useState } from 'react';
import { isBlogPostPath, useScrollVisibility } from './useScrollVisibility';
import {
  resetDomState,
  setWindowScrollY,
  setupMatchMediaMock,
} from '@/shared/testing/dom-mocks';

function HookProbe({ pathname }: { pathname: string }) {
  const [state, setState] = useState({ top: true, bottom: true });

  const visibility = useScrollVisibility(pathname);

  useEffect(() => {
    setState({
      top: visibility.topHeaderVisible,
      bottom: visibility.bottomBarVisible,
    });
  }, [visibility.topHeaderVisible, visibility.bottomBarVisible]);

  return (
    <div data-testid="visibility-state">
      {state.top ? 'T' : 'F'}-{state.bottom ? 'T' : 'F'}
    </div>
  );
}

describe('isBlogPostPath', () => {
  it('returns true only for strict /blog/:slug format', () => {
    expect(isBlogPostPath('/blog/hello-world')).toBe(true);
    expect(isBlogPostPath('/blog')).toBe(false);
    expect(isBlogPostPath('/')).toBe(false);
    expect(isBlogPostPath('/blog/a/b')).toBe(false);
  });
});

describe('useScrollVisibility', () => {
  it('shows bottom bar on home at top area (0~40px)', async () => {
    resetDomState();
    setWindowScrollY(0);
    const { findByTestId } = render(<HookProbe pathname="/" />);

    const stateText = await findByTestId('visibility-state');

    expect(stateText).toHaveTextContent('T-T');
  });

  it('hides bottom bar on home after crossing reveal threshold', async () => {
    resetDomState();
    setWindowScrollY(0);
    const { findByTestId } = render(<HookProbe pathname="/" />);
    let stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');

    act(() => {
      setWindowScrollY(50);
      window.dispatchEvent(new Event('scroll'));
    });

    stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('F-F');
  });

  it('keeps top header visible within small top scroll area', async () => {
    resetDomState();
    setWindowScrollY(5);
    const { findByTestId } = render(<HookProbe pathname="/" />);

    const stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');
  });

  it('hides mobile bars on blog detail when scrolling down', async () => {
    resetDomState();
    const { findByTestId } = render(<HookProbe pathname="/blog/how-to-test" />);
    let stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');

    act(() => {
      setWindowScrollY(80);
      window.dispatchEvent(new Event('scroll'));
    });

    stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('F-F');
  });

  it('shows bars again when scrolling upward on blog detail', async () => {
    resetDomState();
    const { findByTestId } = render(<HookProbe pathname="/blog/how-to-test" />);
    let stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');

    act(() => {
      setWindowScrollY(120);
      window.dispatchEvent(new Event('scroll'));
    });
    stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('F-F');

    act(() => {
      setWindowScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });
    stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');
  });

  it('does not animate on non-mobile screens', async () => {
    resetDomState();
    setupMatchMediaMock(false);

    setWindowScrollY(200);
    const { findByTestId } = render(<HookProbe pathname="/blog/how-to-test" />);
    const stateText = await findByTestId('visibility-state');

    expect(stateText).toHaveTextContent('T-T');
  });

  it('hides/reveals bottom bar at 40/41px boundary only on home', async () => {
    resetDomState();
    setWindowScrollY(40);
    const { findByTestId } = render(<HookProbe pathname="/" />);

    const stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');

    act(() => {
      setWindowScrollY(41);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(await findByTestId('visibility-state')).toHaveTextContent('T-F');

    act(() => {
      setWindowScrollY(40);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(await findByTestId('visibility-state')).toHaveTextContent('T-T');
  });

  it('syncs mobile bottom offset CSS variable with bottom visibility', async () => {
    resetDomState();
    setWindowScrollY(0);
    const { findByTestId } = render(<HookProbe pathname="/" />);
    let stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');

    expect(document.body.style.getPropertyValue('--mobile-bottom-nav-offset')).toBe(
      'var(--mobile-bottom-nav-height)'
    );

    act(() => {
      setWindowScrollY(120);
      window.dispatchEvent(new Event('scroll'));
    });
    stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('F-F');
    expect(document.body.style.getPropertyValue('--mobile-bottom-nav-offset')).toBe('0px');

    act(() => {
      setWindowScrollY(0);
      window.dispatchEvent(new Event('scroll'));
    });
    stateText = await findByTestId('visibility-state');
    expect(stateText).toHaveTextContent('T-T');
    expect(document.body.style.getPropertyValue('--mobile-bottom-nav-offset')).toBe(
      'var(--mobile-bottom-nav-height)'
    );
  });
});
