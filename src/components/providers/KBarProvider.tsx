'use client';

import { KBarProvider as KBarProviderLib } from 'kbar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { getSearchActions } from '@/lib/search';
import { useMemo } from 'react';
import { FeedData } from '@/types';

interface KBarProviderProps {
  children: React.ReactNode;
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
