'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface PostViewTrackerProps {
  slug: string;
  category: string;
  tags?: string[];
}

export default function PostViewTracker({
  slug,
  category,
  tags = [],
}: PostViewTrackerProps) {
  const tagsText = tags.join(',');

  useEffect(() => {
    trackEvent('post_view', {
      post_slug: slug,
      post_category: category,
      post_tags: tagsText,
    });
  }, [slug, category, tagsText]);

  return null;
}

