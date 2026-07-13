# Architecture Decision Records

Last updated: 2026-07-13

이 디렉터리는 커밋 히스토리에서 복원한 아키텍처 의사결정을 기록한다.
ADR은 AI 협업 가이드와 별개의 문서다. 사람이 결정했든 AI가 초안을
도왔든, ADR의 목적은 제품과 엔지니어링 선택의 맥락을 남기는 것이다.

## 범위

- 검토한 히스토리: 2026-01-20 `521eae7`부터 2026-04-28 `939601a`까지.
- 글 발행, 문장 수정, 단일 버그 수정은 오래 유지될 시스템 제약을 만들지
  않는 한 ADR로 승격하지 않는다.
- 현재도 유효한 결정인지 확인하기 위해 `AGENTS.md`, `README.md`, 기존 문서,
  현재 소스 구조를 함께 대조했다.

## 기록

| ID                                                                | 상태       | 결정                                                         |
| ----------------------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| [0001](0001-use-nextjs-app-router.md)                             | Accepted   | 블로그 런타임으로 Next.js App Router를 사용한다              |
| [0002](0002-keep-custom-mdx-webpack-pipeline.md)                  | Accepted   | 커스텀 MDX webpack 파이프라인을 유지한다                     |
| [0003](0003-store-posts-as-folder-mdx-and-meta.md)                | Accepted   | 글을 중첩 가능한 `index.mdx`와 `meta.json` 폴더로 저장한다   |
| [0004](0004-preserve-feature-first-source-structure.md)           | Superseded | feature-first 소스 구조를 유지한다                           |
| [0005](0005-use-token-first-tailwind-styling.md)                  | Accepted   | token-first Tailwind 스타일링을 사용한다                     |
| [0006](0006-isolate-visualization-heavy-components.md)            | Accepted   | 시각화 중심 컴포넌트를 격리한다                              |
| [0007](0007-use-umami-and-supabase-view-counts.md)                | Accepted   | Umami 분석과 Supabase 조회수를 함께 사용한다                 |
| [0008](0008-enforce-publication-policy-in-content-ingestion.md)   | Accepted   | 콘텐츠 수집 경로에서 공개 정책을 강제한다                    |
| [0009](0009-use-app-shell-for-primary-navigation.md)              | Accepted   | 주요 탐색과 레이아웃에 AppShell을 사용한다                   |
| [0010](0010-use-targeted-documentation-harness.md)                | Accepted   | 핵심 문서 검증에 targeted documentation harness를 사용한다   |
| [0011](0011-adopt-frontend-modular-monolith.md)                   | Accepted   | Domain-first Modular Monolith를 사용한다                     |
| [0012](0012-use-root-app-route-adapter.md)                        | Accepted   | Next.js route adapter를 루트 `app/`에 둔다                   |
| [0013](0013-clarify-support-boundaries-and-docs.md)               | Accepted   | 지원 모듈, 유지 문서, 공개 route 경계를 명확히 한다          |
| [0014](0014-use-ark-as-public-site-identity.md)                   | Accepted   | 공개 사이트 정체성으로 아크를 사용한다                       |
| [0015](0015-skip-view-count-query-during-build.md)                | Superseded | 빌드 중 조회수 집계 쿼리를 건너뛴다                          |
| [0016](0016-use-content-type-and-growth-review-scores.md)         | Accepted   | 글 형식과 성장 리뷰 점수를 분리한다                          |
| [0017](0017-allow-private-post-preview-in-development.md)         | Accepted   | 개발 환경에서 private 글 상세 미리보기를 허용한다            |
| [0018](0018-use-semantic-surface-tokens-for-content-discovery.md) | Accepted   | 콘텐츠 탐색 표면에 의미 기반 반경과 무그림자 상태를 사용한다 |
| [0019](0019-use-content-first-typography-scale.md)                | Accepted   | 콘텐츠 읽기 흐름에 16px 기준과 17px 본문을 사용한다          |
| [0020](0020-use-runtime-daily-views-for-popular-feed.md)          | Superseded | 인기 피드를 런타임 일별 조회수로 계산한다                    |
| [0021](0021-load-heavy-mdx-visualizations-on-demand.md)           | Accepted   | 무거운 MDX 시각화를 글 단위로 로드한다                       |
| [0022](0022-default-new-posts-to-private.md)                      | Accepted   | 새 글을 명시적으로 검토한 뒤 공개한다                        |
| [0023](0023-run-the-release-quality-gate-in-ci.md)                | Accepted   | 배포 품질 gate를 CI에서 실행한다                             |
| [0024](0024-use-latest-only-home-feed.md)                         | Accepted   | 홈 피드를 최신순 단일 경로로 유지한다                        |
| [0025](0025-use-node-runtime-for-og-image-route.md)               | Accepted   | OG 이미지 route에 Node.js runtime을 사용한다                 |

## 작성 조건

아래 조건 중 하나라도 해당하면 ADR을 작성하거나 갱신한다.

1. 선택지가 2개 이상이고 트레이드오프가 존재한 경우.
2. 반복적으로 따라야 할 규칙이나 경계를 정의한 경우.
3. 테스트 전략이나 검증 방식이 결정의 핵심이었던 경우.

## 유지 규칙

1. 오래 유지될 제약을 만들거나 뒤집는 변경에는 새 ADR을 추가한다.
2. 과거를 지우기 위해 기존 ADR을 고쳐 쓰지 않는다. 이전 결정을 대체하는
   새 ADR을 작성한다.
3. `Related History`에 커밋 해시를 남겨 이후 독자가 원 변경을 확인할 수
   있게 한다.
4. ADR을 추가하면 이 인덱스와 `docs/README.md`를 함께 갱신한다.
