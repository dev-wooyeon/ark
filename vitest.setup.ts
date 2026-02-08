import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
const IntersectionObserverMock = function () {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
};

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
