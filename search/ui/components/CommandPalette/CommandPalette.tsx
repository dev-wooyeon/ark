'use client';

import * as React from 'react';
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useKBar,
  useMatches,
} from 'kbar';
import styles from './CommandPalette.module.css';
import type { FeedData } from '@/blog/model/types';
import { AnalyticsEvents, trackEvent } from '@/infra/analytics/lib/analytics';
import { getRecommendedSearchTerms } from '@/search/model/search-recommendations';

type SearchScopeId = 'all' | 'tech' | 'life' | 'resume';

interface SearchScope {
  id: SearchScopeId;
  label: string;
  query: string;
}

interface CommandPaletteProps {
  posts?: FeedData[];
}

const SEARCH_SCOPES: SearchScope[] = [
  { id: 'all', label: '전체', query: '' },
  { id: 'tech', label: 'Tech', query: 'Tech' },
  { id: 'life', label: 'Life', query: 'Life' },
  { id: 'resume', label: 'Resume', query: 'Resume' },
];

function getActiveSearchScope(normalizedQuery: string): SearchScopeId {
  const matchedScope = SEARCH_SCOPES.find(
    (scope) => scope.query.toLowerCase() === normalizedQuery.toLowerCase()
  );

  return matchedScope?.id ?? 'all';
}

export const CommandPalette = ({ posts = [] }: CommandPaletteProps) => {
  const { query, searchQuery } = useKBar((state) => ({
    searchQuery: state.searchQuery,
  }));
  const normalizedQuery = searchQuery.trim();
  const activeScope = getActiveSearchScope(normalizedQuery);
  const recommendedTerms = React.useMemo(
    () => getRecommendedSearchTerms(posts),
    [posts]
  );

  return (
    <KBarPortal>
      <KBarPositioner className={styles.positioner}>
        <KBarAnimator className={styles.animator}>
          <div className={styles.searchWrapper}>
            <KBarSearch
              className={styles.search}
              aria-label="전체 글, 태그, 섹션 검색"
              defaultPlaceholder="글 제목, 태그, 섹션 검색"
            />
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => query.toggle()}
              aria-label="검색 모달 닫기"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <SearchScopeBar
            activeScope={activeScope}
            onSelect={(scope) => query.setSearch(scope.query)}
          />
          {normalizedQuery.length === 0 && (
            <div className={styles.recommendationPanel}>
              <p className={styles.recommendationLabel}>추천 키워드</p>
              <SearchSuggestionButtons
                terms={recommendedTerms}
                onSelect={query.setSearch}
              />
            </div>
          )}
          <RenderResults recommendedTerms={recommendedTerms} />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

function SearchScopeBar({
  activeScope,
  onSelect,
}: {
  activeScope: SearchScopeId;
  onSelect: (scope: SearchScope) => void;
}) {
  return (
    <div className={styles.scopeBar} aria-label="검색 범위">
      {SEARCH_SCOPES.map((scope) => {
        const isActive = scope.id === activeScope;

        return (
          <button
            key={scope.id}
            type="button"
            className={`${styles.scopeButton} ${isActive ? styles.scopeButtonActive : ''}`}
            onClick={() => onSelect(scope)}
            aria-pressed={isActive}
          >
            {scope.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchSuggestionButtons({
  terms,
  onSelect,
}: {
  terms: string[];
  onSelect: (term: string) => void;
}) {
  return (
    <div className={styles.suggestionGroup} role="list">
      {terms.map((keyword) => (
        <button
          key={keyword}
          type="button"
          className={styles.suggestionButton}
          onClick={() => onSelect(keyword)}
        >
          {keyword}
        </button>
      ))}
    </div>
  );
}

function RenderResults({ recommendedTerms }: { recommendedTerms: string[] }) {
  const { results } = useMatches();
  const { query, searchQuery } = useKBar((state) => ({
    searchQuery: state.searchQuery,
  }));
  const normalizedQuery = searchQuery.trim();
  const resultCount = results.filter((item) => typeof item !== 'string').length;
  const hasResults = resultCount > 0;
  const lastTrackedRef = React.useRef('');

  React.useEffect(() => {
    if (normalizedQuery.length < 2) {
      return;
    }

    const trackKey = `${normalizedQuery}:${resultCount}`;
    if (lastTrackedRef.current === trackKey) {
      return;
    }

    const timer = window.setTimeout(() => {
      trackEvent(AnalyticsEvents.search, {
        query: normalizedQuery,
        result_count: resultCount,
      });

      if (resultCount === 0) {
        trackEvent(AnalyticsEvents.error, {
          source: 'command_palette_no_result',
          query: normalizedQuery,
        });
      }

      lastTrackedRef.current = trackKey;
    }, 250);

    return () => window.clearTimeout(timer);
  }, [normalizedQuery, resultCount]);

  if (normalizedQuery.length > 0 && !hasResults) {
    return (
      <div className={styles.noResultWrapper}>
        <p className={styles.noResultTitle}>검색 결과가 없습니다</p>
        <p className={styles.noResultDescription}>
          다른 키워드로 검색하거나 추천 키워드를 선택해 보세요.
        </p>
        <SearchSuggestionButtons
          terms={recommendedTerms}
          onSelect={query.setSearch}
        />
        <div className={styles.recoveryActions}>
          <button
            type="button"
            className={styles.recoveryButton}
            onClick={() => query.setSearch('')}
          >
            검색 초기화
          </button>
          <a href="/engineering" className={styles.recoveryButton}>
            Engineering 보기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === 'string' ? (
            <div className={styles.sectionHeader}>{item}</div>
          ) : (
            <div
              className={`${styles.resultItem} ${active ? styles.resultItemActive : ''}`}
            >
              <div className={styles.resultContent}>
                <div className={styles.resultName}>{item.name}</div>
                {item.subtitle && (
                  <div className={styles.resultSubtitle}>{item.subtitle}</div>
                )}
              </div>
              {null}
            </div>
          )
        }
      />
    </div>
  );
}
