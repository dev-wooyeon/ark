'use client';

import { KBarProvider as KBarProviderLib } from 'kbar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { getSearchActions } from '@/lib/search';
import { useMemo } from 'react';

interface KBarProviderProps {
  children: React.ReactNode;
  posts?: any[];
}

export default function KBarProvider({ children, posts = [] }: KBarProviderProps) {
  const actions = useMemo(() => getSearchActions(posts), [posts]);

  return (
    <KBarProviderLib actions={actions}>
      {children}
      <CommandPalette />
    </KBarProviderLib>
  );
}
