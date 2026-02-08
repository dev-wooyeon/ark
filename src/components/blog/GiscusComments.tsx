'use client';

import Giscus from '@giscus/react';

interface GiscusCommentsProps {
  slug: string;
}

/**
 * Giscus 댓글 컴포넌트
 * GitHub Discussions 기반 댓글 시스템
 *
 * @note repo, repoId, category, categoryId 값을 실제 값으로 교체해야 합니다.
 * https://giscus.app 에서 설정 후 값을 확인하세요.
 */
export function GiscusComments({ slug }: GiscusCommentsProps) {
  return (
    <section className="mt-16 pt-8 border-t border-[var(--color-grey-200)]">
      <h2 className="text-xl font-bold text-[var(--color-grey-900)] mb-6">
        댓글
      </h2>
      <Giscus
        id="comments"
        repo="dev-wooyeon/eunu-log"
        repoId="R_kgDOQ9dweg"
        category="Announcements"
        categoryId="DIC_kwDOQ9dwes4C19H1"
        mapping="title"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}
