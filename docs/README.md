# 문서 인덱스

Last updated: 2026-07-22

이 인덱스는 현재 코드베이스와 함께 유지해야 하는 문서만 추적한다. 계속
업데이트할 문서가 아니라면 삭제하거나, 오래 남겨야 하는 결정만 ADR로 옮긴다.

새 독립 문서를 추가하기 전에 기존 ADR, guide, README로 흡수할 수 있는지 먼저
검토한다.

## 저장소 기준 문서

- `AGENTS.md`
- `README.md`

## 유지 대상 문서

- `docs/adr/README.md`
- `docs/adr/*.md` (도메인별 UI 경계와 같이 오래 유지될 결정 포함)
- `docs/adr/0019-use-content-first-typography-scale.md`
- `docs/adr/0020-use-runtime-daily-views-for-popular-feed.md`
- `docs/adr/0021-load-heavy-mdx-visualizations-on-demand.md`
- `docs/adr/0022-default-new-posts-to-private.md`
- `docs/adr/0023-run-the-release-quality-gate-in-ci.md`
- `docs/adr/0024-use-latest-only-home-feed.md`
- `docs/adr/0025-use-node-runtime-for-og-image-route.md`
- `docs/adr/0026-use-repo-local-title-review-skill.md`
- `docs/adr/0027-use-resume-specific-editorial-grid.md`
- `docs/adr/0028-retire-private-webgl-visualizations-and-adopt-selective-interactions.md`
- `docs/adr/0029-use-link-like-controls-for-home-category-filtering.md`
- `docs/adr/0030-use-date-title-rows-for-home-archive.md`
- `docs/adr/0031-adopt-a-single-paper-theme-and-retire-command-palette.md`
- `docs/adr/0032-reduce-desktop-rail-to-home-wordmark-and-utilities.md`
- `docs/adr/0033-use-a-white-canvas-without-content-cards.md`
- `docs/adr/0034-adopt-the-graphite-ink-palette.md`
- `docs/adr/0035-prioritize-mobile-archive-reading-order.md`
- `docs/adr/0036-separate-philosophy-home-from-content-archive.md`
- `docs/adr/0037-adopt-zero-log-grid-site-shell.md`
- `docs/adr/0038-use-jetbrains-mono-for-home-statement.md`
- `docs/adr/0039-use-summary-grid-for-public-resume.md`
- `docs/adr/0040-keep-external-links-in-sticky-identity-rail.md`
- `docs/adr/0041-use-two-level-project-summaries-in-resume.md`
- `docs/adr/0042-use-textual-route-error-state.md`
- `docs/adr/0043-include-one-evidence-backed-personal-project-in-resume.md`
- `docs/adr/0044-link-direct-project-retrospectives-from-resume.md`
- `docs/adr/0045-use-team-context-in-resume-company-column.md`
- `docs/adr/0046-use-main-as-the-primary-branch.md`
- `docs/adr/0047-isolate-publication-policy.md`
- `docs/blog-quality-guide.md`
- `docs/content-publication-candidates.md`
- `docs/database/db-schema.md`
- `docs/database/supabase-view-count.sql`
- `docs/guides/testing-guide.md`

## 관리 규칙

1. 문서에서는 저장소 기준 상대 경로만 사용한다.
2. 정책과 프로세스 문서를 수정하면 `Last updated`를 갱신한다.
3. 명령어는 저장소 루트에서 바로 실행할 수 있게 작성한다.
4. 참조 파일이 사라지면 stale link를 제거하거나 교체한다.
5. 글쓰기 또는 유지보수 흐름에서 쓰지 않는 일회성 research, 오래된 계획,
   생성 리포트는 삭제한다.
