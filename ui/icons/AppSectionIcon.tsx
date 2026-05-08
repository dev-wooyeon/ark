import type { ReactNode } from 'react';

type ContentCategory = 'Tech' | 'Life';
type AppSection = 'home' | 'engineering' | 'life' | 'resume';

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

function renderSvg(
  paths: ReactNode,
  { width = 12, height = 12, className }: IconProps
) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export function CategoryIcon({
  category,
  width,
  height,
  className,
}: IconProps & { category: ContentCategory | string }) {
  switch (category) {
    case 'Tech':
      return renderSvg(
        <>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 20h8" />
          <path d="M10 16v4" />
          <path d="M14 16v4" />
        </>,
        { width, height, className }
      );
    case 'Life':
      return renderSvg(
        <>
          <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" />
          <path d="M8 7h7" />
          <path d="M8 11h7" />
        </>,
        { width, height, className }
      );
    default:
      return renderSvg(<path d="m20 12-8 8-8-8 8-8 8 8z" />, {
        width,
        height,
        className,
      });
  }
}

export function AppSectionIcon({
  section,
  width = 16,
  height = 16,
  className,
}: IconProps & { section: AppSection }) {
  switch (section) {
    case 'engineering':
      return (
        <CategoryIcon
          category="Tech"
          width={width}
          height={height}
          className={className}
        />
      );
    case 'life':
      return (
        <CategoryIcon
          category="Life"
          width={width}
          height={height}
          className={className}
        />
      );
    case 'resume':
      return renderSvg(
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </>,
        { width, height, className }
      );
    case 'home':
    default:
      return renderSvg(
        <>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </>,
        { width, height, className }
      );
  }
}

export type { AppSection, ContentCategory };
