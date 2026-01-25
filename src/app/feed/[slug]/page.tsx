import { getFeedData, getAllFeedSlugs } from '@/lib/feeds';
import { parseHeadingsFromHtml } from '@/lib/markdown';
import InlineTableOfContents from '@/components/features/post/InlineTableOfContents';
import ReadingProgress from '@/components/layout/ReadingProgress';
import { notFound } from 'next/navigation';
import styles from './feed.module.css';

import { Metadata } from 'next';

export async function generateStaticParams() {
    const slugs = getAllFeedSlugs();
    return slugs;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const feedData = await getFeedData(params.slug);

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

export default async function Feed({ params }: { params: { slug: string } }) {
    const feedData = await getFeedData(params.slug);

    // 피드 데이터를 찾을 수 없는 경우 404 페이지 표시
    if (!feedData) {
        notFound();
    }

    const tocItems = parseHeadingsFromHtml(feedData.contentHtml);

    return (
        <>
            {/* 스크롤 진행률 표시 */}
            <ReadingProgress />

            <article className={styles.article}>
                <a href="/feed" className={styles.backLink}>
                    ← Feed
                </a>

                <header className={styles.header}>
                    <div className={styles.category}>{feedData.category}</div>
                    <h1 className={styles.title}>{feedData.title}</h1>
                    <div className={styles.meta}>
                        <time>{feedData.date}</time>
                        {feedData.tags && (
                            <div className={styles.tags}>
                                {feedData.tags.map((tag) => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                {/* 본문 상단 인라인 목차 - 모바일에서도 표시 */}
                <InlineTableOfContents tocItems={tocItems} />

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: feedData.contentHtml }}
                />
            </article>
        </>
    );
}
