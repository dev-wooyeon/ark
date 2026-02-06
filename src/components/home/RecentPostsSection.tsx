import Link from 'next/link';
import { Container } from '@/components/layout';
import { PostCard } from '@/components/blog/PostCard'; // Fixed import path based on file structure
import { FeedData } from '@/types';
import { Button } from '@/components/ui';

interface RecentPostsSectionProps {
    posts: FeedData[];
}

export default function RecentPostsSection({ posts }: RecentPostsSectionProps) {
    return (
        <section className="py-24 bg-white">
            <Container size="md">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-toss-blue font-bold tracking-wider uppercase text-sm mb-2 block">
                            Recent Posts
                        </span>
                        <h2 className="text-3xl font-bold text-grey-900 leading-tight">
                            최근 작성한 글
                        </h2>
                        <p className="mt-3 text-grey-600">
                            기술적 고민과 배운 점들을 기록합니다.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="text-toss-blue font-medium hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                        전체 글 보기
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Button as="a" href="/blog" variant="secondary" fullWidth>
                        블로그 더 보기
                    </Button>
                </div>
            </Container>
        </section>
    );
}
