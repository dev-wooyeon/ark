# 0011. Domain-first Modular Monolith를 사용한다

Date: 2026-05-07
Status: Accepted

## 배경

기존 구조는 `src/features`, `src/domains`, `src/core`, `src/shared` 안에서
책임을 나눴다. 하지만 실제 변경을 검토해 보니 주요 도메인이 독립된 모듈로
분리됐다기보다 `src` 아래 하위 디렉터리를 다시 나눈 수준에 가까웠다.

이 프로젝트에서 원하는 경계는 Next.js 소스 폴더 내부의 분류가 아니라,
`posts/`처럼 저장소 최상단에서 주요 도메인이 눈에 보이는 구조다. 글, 이력서,
검색은 서로 다른 변경 이유와 언어를 가진다. 반면 홈, AppShell, provider,
analytics, Supabase, 공통 UI는 도메인이 아니라 조합 또는 인프라 책임이다.

## 결정

DDD의 전략적 설계 개념을 차용한 domain-first modular monolith를 사용한다.
다만 Entity, Aggregate, Repository 같은 tactical DDD pattern을 모든 모듈에
강제하지 않는다.

최상위 모듈 경계는 다음과 같이 둔다.

- `src/app/`: Next.js App Router route adapter, route handler, metadata entry.
- `posts/`: 블로그 원문 콘텐츠 저장소. `index.mdx`와 `meta.json` 구조를 유지한다.
- `blog/`: 글 도메인. post schema, repository, publication policy, series,
  blog UI, view-count use case를 소유한다.
- `resume/`: 이력서 도메인. resume data, ordering, resume UI를 소유한다.
- `search/`: 검색 도메인. command palette, search action, recommendation을
  소유한다.
- `site/`: 도메인 조합 layer. home, AppShell, navigation, provider, site config를
  소유한다.
- `platform/`: 외부/런타임 인프라. Supabase, Umami analytics, SEO helper,
  devtool integration을 소유한다.
- `shared/`: 도메인 지식이 없는 UI primitive, motion helper, testing helper,
  visualization widget만 둔다.
- `styles/`: design token과 global style을 둔다.

의존 방향은 `src/app -> site -> domain -> platform/shared`를 기본으로 한다.
`blog`는 `posts/`를 읽을 수 있는 유일한 도메인 모듈이다. `site`는 여러 도메인을
조합할 수 있지만, 도메인 내부 정책을 대신 구현하지 않는다.

## 결과

- 저장소 최상단에서 주요 도메인과 조합/인프라 책임이 구분된다.
- `src/app`은 Next.js route adapter 역할에 집중한다.
- 기존 `src/features`, `src/domains`, `src/core`, `src/shared` 경계는 이 결정으로
  대체된다.
- 단순 폴더 이동만으로 경계가 보장되지는 않는다. import 경계는 public API와
  테스트로 우선 관리하고, lint 기반 강제는 별도 결정으로 추가할 수 있다.
- `shared`로 올리는 코드는 도메인 언어를 포함하지 않아야 한다.

## 검토한 대안

- 기존 feature-first 구조 유지: 변경량은 적지만 사용자가 기대한 최상위 도메인
  경계를 만들지 못한다.
- 모든 코드를 `src/shared` 또는 `src/features` 안에 재분류: import는 단순하지만
  도메인 소유권이 흐려진다.
- DDD tactical pattern 전면 적용: 작은 블로그 프로젝트에는 추상화 비용이 크고,
  실제 문제인 모듈 경계보다 형식이 앞설 수 있다.
- `home`을 독립 도메인으로 승격: 홈은 자체 도메인보다 `blog`, `resume`, `search`를
  엮는 조합 화면이므로 `site/home`에 둔다.

## 관련 히스토리

- `docs/adr/0004-preserve-feature-first-source-structure.md`: 이전 feature-first
  소스 구조 결정. 이 ADR이 대체한다.
- `docs/design-docs/adr-001-modular-monolith.md`: 최상위 도메인 경계가 아닌
  `src/features` 재분류를 modular monolith로 설명하던 초안. 이 ADR로 대체하고
  제거한다.
