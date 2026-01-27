/**
 * UI Layout Constants
 * 레이아웃 관련 상수 정의
 */

// Header & Navigation
export const HEADER_HEIGHT = 80;
export const HEADER_OFFSET = HEADER_HEIGHT; // 스크롤 시 헤더 높이 보정

// IntersectionObserver
export const TOC_ROOT_MARGIN = `-${HEADER_HEIGHT}px 0px -70% 0px`;

// Z-Index Scale
export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  readingProgress: 1001,
} as const;

// Animation Durations (ms)
export const ANIMATION = {
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

// Breakpoints (px) - Tailwind 기본값과 동기화
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Typography
export const TYPING_SPEED = {
  fast: 15,
  normal: 50,
  slow: 100,
} as const;
