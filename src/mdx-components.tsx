import type { MDXComponents } from 'mdx/types';
import {
  BinarySearchVisualization,
  DPVisualization,
  GraphTraversalVisualization,
  SlidingWindowVisualization,
  SortingVisualization,
  TwoPointerVisualization
} from '@/components/visualization';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 {...props}>{props.children}</h1>,
    h2: (props) => <h2 {...props} className="mt-12 mb-6 text-2xl font-bold">{props.children}</h2>,
    h3: (props) => <h3 {...props} className="mt-8 mb-4 text-xl font-bold">{props.children}</h3>,
    BinarySearchVisualization,
    DPVisualization,
    GraphTraversalVisualization,
    SlidingWindowVisualization,
    SortingVisualization,
    TwoPointerVisualization,
    ...components,
  };
}
