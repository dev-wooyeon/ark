import { Metadata } from 'next';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { Header, Container } from '@/shared/layout';
import { EmptyState } from '@/shared/ui';
import { getSeriesSummaries } from '@/features/blog/model/series-group';
import { SeriesHubList } from '@/features/blog/ui/components';

export const metadata: Metadata = {
  title: 'Series',
  description: '연속된 학습과 구현 기록을 시리즈 단위로 모아봅니다',
};

export default function SeriesPage() {
  const allPosts = getSortedFeedData();
  const seriesSummaries = getSeriesSummaries(allPosts);
  const totalEpisodes = seriesSummaries.reduce(
    (total, summary) => total + summary.postCount,
    0
  );

  return (
    <>
      <Header />

      <main className="py-16">
        <Container size="md">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)]">
              시리즈
            </h1>
            <p className="mt-4 text-lg text-[var(--color-grey-600)]">
              하나의 주제를 깊게 다룬 연재 글을 모아봤습니다
            </p>
            <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">
              {seriesSummaries.length}개 시리즈 · {totalEpisodes}개 글
            </p>
          </header>

          {seriesSummaries.length === 0 ? (
            <EmptyState
              icon={<span className="tossface">📚</span>}
              title="아직 등록된 시리즈가 없어요"
              description="새로운 시리즈를 준비 중입니다. 먼저 블로그의 다른 글을 둘러보세요."
              size="sm"
              action={{
                label: '블로그 둘러보기',
                href: '/blog',
                variant: 'secondary',
              }}
            />
          ) : (
            <SeriesHubList seriesSummaries={seriesSummaries} />
          )}
        </Container>
      </main>
    </>
  );
}
