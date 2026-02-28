'use client';

import { KBarProvider as KBarProviderLib } from 'kbar';
import { CommandPalette } from '@/features/search/ui/components/CommandPalette';
import { getSearchActions } from '@/features/search/model/get-search-actions';
import { useMemo, type ReactNode } from 'react';
import type { FeedData } from '@/domains/post/model/types';

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
      <CommandPalette />
    </KBarProviderLib>
  );
}
