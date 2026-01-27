import { getFeedData, getAllFeedSlugs } from '@/lib/mdx-feeds';
import { getMdxSource, parseHeadingsFromMdx } from '@/lib/markdown';
import InlineTableOfContents from './_components/InlineTableOfContents';
import ReadingProgress from './_components/ReadingProgress';
import { mdxComponents } from './_components/MdxComponents';
import { notFound } from 'next/navigation';
import BackLink from '../../_components/BackLink';

import { Metadata } from 'next';

export async function generateStaticParams() {
    const slugs = getAllFeedSlugs();
    return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const feedData = await getFeedData(slug);

    if (!feedData) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: feedData.title,
        description: feedData.description,
        openGraph: {
            title: feedData.title,
            description: feedData.description,
            type: 'article',
            publishedTime: feedData.date,
            authors: ['Eunu'],
            tags: feedData.tags,
            images: feedData.image ? [feedData.image] : [],
        },
    };
}

export default async function Feed({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const feedData = await getFeedData(slug);

    // 피드 데이터를 찾을 수 없는 경우 404 페이지 표시
    if (!feedData) {
        notFound();
    }

    // Get MDX source for TOC generation
    const mdxSource = getMdxSource(slug);
    const tocItems = mdxSource ? parseHeadingsFromMdx(mdxSource) : [];

    const { Content } = feedData;

    return (
        <>
            {/* 스크롤 진행률 표시 */}
            <ReadingProgress />

            <article className="max-w-[800px] mx-auto py-16 px-8 max-md:py-8 max-md:px-4">
                <BackLink href="/feed" text="← Feed" />

                <header className="mb-12 text-center">
                    <div className="text-sm font-bold text-[var(--accent-primary)] uppercase mb-4">{feedData.category}</div>
                    <h1 className="font-sans text-[clamp(2.5rem,6vw,3.5rem)] font-bold text-[var(--text-primary)] mb-6 leading-[1.2] tracking-[-0.02em] max-md:text-[2rem]">{feedData.title}</h1>
                    <div className="text-sm text-[var(--text-tertiary)] flex flex-col items-center gap-4">
                        <time>{feedData.date}</time>
                        {feedData.tags && (
                            <div className="flex gap-2 flex-wrap justify-center">
                                {feedData.tags.map((tag) => (
                                    <span key={tag} className="text-[var(--accent-primary)] font-medium">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                {/* 본문 상단 인라인 목차 - 모바일에서도 표시 */}
                <InlineTableOfContents tocItems={tocItems} />

                {/* Replace dangerouslySetInnerHTML with MDX component */}
                <div className="prose prose-lg max-w-none">
                    <Content components={mdxComponents} />
                </div>
            </article>
        </>
    );
}
