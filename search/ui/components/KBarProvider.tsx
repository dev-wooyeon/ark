'use client';

import { KBarProvider as KBarProviderLib } from 'kbar';
import { CommandPalette } from '@/search/ui/components/CommandPalette';
import { getSearchActions } from '@/search/model/get-search-actions';
import { useMemo, type ReactNode } from 'react';
import type { SearchablePost } from '@/search/model/get-search-actions';

interface KBarProviderProps {
  children: ReactNode;
  posts?: SearchablePost[];
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
