'use client';

import { motion } from 'framer-motion';
import { PostCard } from '../PostCard';
import { EmptyState } from '@/shared/ui';
import type { FeedData } from '@/domains/post/model/types';

interface PostListProps {
  posts: FeedData[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<span className="tossface">📝</span>}
        title="아직 작성된 글이 없어요"
        description="곧 새로운 글로 찾아뵐게요"
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2"
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
