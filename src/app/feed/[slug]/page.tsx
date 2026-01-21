import { getFeedData, getAllFeedSlugs, parseHeadingsFromHtml } from '@/lib/feeds';
import TableOfContents from '@/components/TableOfContents';
import styles from './feed.module.css';

export async function generateStaticParams() {
    const slugs = getAllFeedSlugs();
    return slugs;
}

export default async function Feed({ params }: { params: { slug: string } }) {
    const feedData = await getFeedData(params.slug);
    const tocItems = parseHeadingsFromHtml(feedData.contentHtml);

    return (
        <>
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
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: feedData.contentHtml }}
                />
            </article>
            <TableOfContents tocItems={tocItems} />
        </>
    );
}
