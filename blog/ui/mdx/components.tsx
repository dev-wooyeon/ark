import { createHeadingIdGenerator } from '@/blog/model/heading';
import type { MDXComponents } from 'mdx/types';
import {
  createElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import {
  ImageGrid,
  MermaidDiagram,
} from '@/blog/ui/components';

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return '';
}

function mergeClassName(baseClassName: string, className?: string): string {
  return className ? `${baseClassName} ${className}` : baseClassName;
}

export function getMDXComponents(components: MDXComponents): MDXComponents {
  const nextHeadingId = createHeadingIdGenerator();
  const createHeading = (
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    baseClassName: string
  ) => {
    const Heading = (props: ComponentPropsWithoutRef<'h1'>) => {
      const generatedId = nextHeadingId(extractText(props.children));

      return createElement(
        tag,
        {
          ...props,
          id: generatedId ?? props.id,
          className: mergeClassName(baseClassName, props.className),
        },
        props.children
      );
    };

    Heading.displayName = `MdxHeading(${tag})`;

    return Heading;
  };

  return {
    h1: createHeading(
      'h1',
      'text-3xl font-bold mt-16 mb-8 text-[var(--color-grey-900)]'
    ),
    h2: createHeading(
      'h2',
      'mt-12 mb-6 text-2xl font-bold text-[var(--color-grey-900)]'
    ),
    h3: createHeading(
      'h3',
      'mt-8 mb-4 text-xl font-bold text-[var(--color-grey-900)]'
    ),
    h4: createHeading(
      'h4',
      'mt-8 mb-4 text-lg font-bold text-[var(--color-grey-900)]'
    ),
    h5: createHeading(
      'h5',
      'mt-8 mb-4 text-base font-bold text-[var(--color-grey-900)]'
    ),
    h6: createHeading(
      'h6',
      'mt-8 mb-4 text-base font-bold text-[var(--color-grey-900)]'
    ),
    p: (props) => <p {...props}>{props.children}</p>,
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
    ImageGrid,
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
