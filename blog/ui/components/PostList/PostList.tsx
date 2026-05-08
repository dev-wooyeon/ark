'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PostCard } from '../PostCard';
import { EmptyState } from '@/ui';
import type { FeedData } from '@/blog/model/types';
import {
  useEffectiveMotionMode,
  type EffectiveMotionMode,
} from '@/ui/motion/model/motion-mode';

interface PostListProps {
  posts: FeedData[];
  layout?: 'grid' | 'list';
}

function getContainerVariants(
  effectiveMotionMode: EffectiveMotionMode
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: effectiveMotionMode === 'reduced' ? 0.03 : 0.08,
      },
    },
  };
}

function getItemVariants(effectiveMotionMode: EffectiveMotionMode): Variants {
  const shouldTranslate = effectiveMotionMode === 'full';

  return {
    hidden: {
      opacity: 0,
      y: shouldTranslate ? 20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: effectiveMotionMode === 'reduced' ? 0.16 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
}

const layoutClassNames = {
  grid: 'grid gap-6 md:grid-cols-2',
  list: 'space-y-4',
} satisfies Record<NonNullable<PostListProps['layout']>, string>;

export default function PostList({ posts, layout = 'grid' }: PostListProps) {
  const effectiveMotionMode = useEffectiveMotionMode();

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<span className="tossface">📝</span>}
        title="아직 작성된 글이 없어요"
        description="곧 새로운 글로 찾아뵐게요"
      />
    );
  }

  if (effectiveMotionMode === 'off') {
    return (
      <div className={layoutClassNames[layout]}>
        {posts.map((post) => (
          <div key={post.slug} className={layout === 'grid' ? 'h-full' : ''}>
            <PostCard
              post={post}
              variant={layout === 'list' ? 'list' : 'default'}
            />
          </div>
        ))}
      </div>
    );
  }

  const containerVariants = getContainerVariants(effectiveMotionMode);
  const itemVariants = getItemVariants(effectiveMotionMode);

  if (layout === 'list') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={layoutClassNames.list}
      >
        {posts.map((post) => (
          <motion.div key={post.slug} variants={itemVariants}>
            <PostCard post={post} variant="list" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={layoutClassNames.grid}
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={itemVariants} className="h-full">
          <PostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export type { PostListProps };
