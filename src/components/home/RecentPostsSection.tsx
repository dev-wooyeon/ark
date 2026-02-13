'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { PostCard } from '@/components/blog/PostCard'; // Fixed import path based on file structure
import { FeedData } from '@/types';
import { Button } from '@/components/ui';

interface RecentPostsSectionProps {
  posts: FeedData[];
}

export default function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <section className="py-24 bg-[var(--color-bg-primary)]">
      <Container size="md">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[var(--color-toss-blue)] font-bold tracking-wider uppercase text-sm mb-2 block">
              Recent Posts
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-grey-900)] leading-tight">
              최근 작성한 글
            </h2>
            <p className="mt-3 text-[var(--color-grey-600)]">
              기술적 고민과 배운 점들을 기록합니다.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-[var(--color-toss-blue)] font-medium hover:underline inline-flex items-center gap-1 shrink-0"
          >
            전체 글 보기
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {posts.map((post) => (
            <motion.div
              key={post.slug}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: 'easeOut' },
                },
              }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center md:hidden">
          <Button as="a" href="/blog" variant="secondary" fullWidth>
            블로그 더 보기
          </Button>
        </div>
      </Container>
    </section>
  );
}
