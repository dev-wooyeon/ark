'use client';

import {
  lazy,
  Suspense,
  type ComponentType,
  type FunctionComponent,
} from 'react';

type VisualizationLoader = () => Promise<{
  default: ComponentType;
}>;

function createLazyVisualization(
  displayName: string,
  loader: VisualizationLoader
): FunctionComponent {
  const LazyVisualization = lazy(loader);

  function Visualization() {
    return (
      <Suspense fallback={null}>
        <LazyVisualization />
      </Suspense>
    );
  }

  Visualization.displayName = displayName;
  return Visualization;
}

export const BinarySearchVisualization = createLazyVisualization(
  'BinarySearchVisualization',
  () => import('@/blog/ui/visualization/BinarySearchVisualization')
);
export const DPVisualization = createLazyVisualization(
  'DPVisualization',
  () => import('@/blog/ui/visualization/DPVisualization')
);
export const GraphTraversalVisualization = createLazyVisualization(
  'GraphTraversalVisualization',
  () => import('@/blog/ui/visualization/GraphTraversalVisualization')
);
export const SlidingWindowVisualization = createLazyVisualization(
  'SlidingWindowVisualization',
  () => import('@/blog/ui/visualization/SlidingWindowVisualization')
);
export const SortingVisualization = createLazyVisualization(
  'SortingVisualization',
  () => import('@/blog/ui/visualization/SortingVisualization')
);
export const TwoPointerVisualization = createLazyVisualization(
  'TwoPointerVisualization',
  () => import('@/blog/ui/visualization/TwoPointerVisualization')
);
