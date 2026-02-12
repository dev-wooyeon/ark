import type { MDXComponents } from 'mdx/types';
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ImageGrid, MermaidDiagram, ScrollWorkflow } from '@/components/blog';

// Dynamic imports for visualization components (code splitting)
const BinarySearchVisualization = dynamic(() =>
  import('@/components/visualization').then((mod) => ({
    default: mod.BinarySearchVisualization,
  }))
);
const DPVisualization = dynamic(() =>
  import('@/components/visualization').then((mod) => ({
    default: mod.DPVisualization,
  }))
);
const GraphTraversalVisualization = dynamic(() =>
  import('@/components/visualization').then((mod) => ({
    default: mod.GraphTraversalVisualization,
  }))
);
const SlidingWindowVisualization = dynamic(() =>
  import('@/components/visualization').then((mod) => ({
    default: mod.SlidingWindowVisualization,
  }))
);
const SortingVisualization = dynamic(() =>
  import('@/components/visualization').then((mod) => ({
    default: mod.SortingVisualization,
  }))
);
const TwoPointerVisualization = dynamic(() =>
  import('@/components/visualization').then((mod) => ({
    default: mod.TwoPointerVisualization,
  }))
);

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return '';
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        {...props}
        className="text-3xl font-bold mt-16 mb-8 text-[var(--color-grey-900)]"
      >
        {props.children}
      </h1>
    ),
    h2: (props) => (
      <h2
        {...props}
        className="mt-12 mb-6 text-2xl font-bold text-[var(--color-grey-900)]"
      >
        {props.children}
      </h2>
    ),
    h3: (props) => (
      <h3
        {...props}
        className="mt-8 mb-4 text-xl font-bold text-[var(--color-grey-900)]"
      >
        {props.children}
      </h3>
    ),
    p: (props) => (
      <p
        {...props}
        className="text-base leading-relaxed mb-6 text-[var(--color-grey-700)]"
      >
        {props.children}
      </p>
    ),
    img: (props) => {
      // Improved null safety - return null if no src
      if (!props.src) return null;

      return (
        <span className="block my-12 overflow-hidden rounded-[16px]">
          <Image
            src={props.src}
            alt={props.alt || ''}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 800px"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
            priority={props.src?.includes('thumbnail')}
            className="rounded-[16px]"
          />
          {props.alt && (
            <span className="block text-center text-sm text-[var(--color-grey-600)] mt-4 mb-2 px-4">
              {props.alt}
            </span>
          )}
        </span>
      );
    },
    BinarySearchVisualization,
    DPVisualization,
    GraphTraversalVisualization,
    SlidingWindowVisualization,
    SortingVisualization,
    TwoPointerVisualization,
    ImageGrid,
    ScrollWorkflow,
    pre: (props) => {
      const preProps = props as ComponentPropsWithoutRef<'pre'> & {
        'data-language'?: string;
      };

      if (preProps['data-language'] === 'mermaid') {
        const chart = extractText(preProps.children).trimEnd();
        return <MermaidDiagram chart={chart} />;
      }

      return <pre {...preProps}>{preProps.children}</pre>;
    },
    ...components,
  };
}
