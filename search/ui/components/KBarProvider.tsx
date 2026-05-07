'use client';

import { KBarProvider as KBarProviderLib } from 'kbar';
import { CommandPalette } from '@/search/ui/components/CommandPalette';
import { getSearchActions } from '@/search/model/get-search-actions';
import { useMemo, type ReactNode } from 'react';
import type { FeedData } from '@/blog/model/types';

interface KBarProviderProps {
  children: ReactNode;
  posts?: FeedData[];
}

export default function KBarProvider({
  children,
  posts = [],
}: KBarProviderProps) {
  const actions = useMemo(() => getSearchActions(posts), [posts]);

  return (
    <KBarProviderLib actions={actions}>
      {children}
      <CommandPalette posts={posts} />
    </KBarProviderLib>
  );
}
