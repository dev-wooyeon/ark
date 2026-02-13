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
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

export const CommandPalette = () => {
  return (
    <KBarPortal>
      <KBarPositioner className={styles.positioner}>
        <KBarAnimator className={styles.animator}>
          <div className={styles.searchWrapper}>
            <KBarSearch
              className={styles.search}
              defaultPlaceholder="무엇을 찾으시나요?"
            />
            <div className={styles.shortcutHint}>ESC</div>
          </div>
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

function RenderResults() {
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
        <div className={styles.suggestionGroup} role="list">
          {['Redis', 'Flink', '회고'].map((keyword) => (
            <button
              key={keyword}
              type="button"
              className={styles.suggestionButton}
              onClick={() => query.setSearch(keyword)}
            >
              {keyword}
            </button>
          ))}
        </div>
        <div className={styles.recoveryActions}>
          <button
            type="button"
            className={styles.recoveryButton}
            onClick={() => query.setSearch('')}
          >
            검색 초기화
          </button>
          <a href="/blog" className={styles.recoveryButton}>
            전체 글 보기
          </a>
        </div>
      </div>
    );
  }

  return (
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
            {item.shortcut?.length ? (
              <div className={styles.resultShortcuts}>
                {item.shortcut.map((sc) => (
                  <kbd key={sc} className={styles.resultShortcut}>
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}
