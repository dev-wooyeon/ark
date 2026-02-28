import { vi } from 'vitest';

export const pathnameState: { value: string } = { value: '/' };
let searchParams = new URLSearchParams();

export const routerState = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

export function setMockPathname(pathname: string) {
  pathnameState.value = pathname;
}

export function setMockSearchParams(next: string) {
  searchParams = new URLSearchParams(next);
}

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => pathnameState.value),
  useSearchParams: vi.fn(() => searchParams),
  useRouter: vi.fn(() => routerState),
}));

