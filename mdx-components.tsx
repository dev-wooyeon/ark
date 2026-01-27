import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Default HTML element overrides (for future custom components)
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    // Future: Add custom components like <Callout>, <Chart>, etc.
    // Example: Callout: ({ children, type }) => <div className={`callout ${type}`}>{children}</div>,
    ...components,
  };
}
