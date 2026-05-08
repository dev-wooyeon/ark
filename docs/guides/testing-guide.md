# Testing Guide for eunu.log

## Test Stack

- Unit/컴포넌트: `Vitest + React Testing Library`
- E2E: `Playwright`

## 실행 스크립트

- `npm run test:unit` : 전체 Vitest 실행
- `npm run test:components` : UI 컴포넌트 중심 테스트 실행
- `npm run test:smoke` : 유닛 smoke + Playwright smoke
- `npm run test:e2e` : 전체 Playwright 시나리오
- `npm run verify:docs` : ADR과 핵심 문서 하네스 검사

## 단위 테스트 체크리스트

### lib

- `infra/analytics/lib/analytics.test.ts`
  - GA ID 부재/부재 조건에서 이벤트 미발송
  - trackEvent, trackPageView 실 발송 가드

- `blog/services/post-repository.test.ts`
  - 정렬/시리즈 조회/SKU 슬러그 수집

- `search/model/get-search-actions.test.ts`
  - 키워드 생성/nullable tags 처리

- `blog/services/markdown-parser.test.ts`
  - TOC ID 생성 및 중복 처리

### blog api

- `blog/api/view.test.ts`
  - 슬러그 정규화
  - Supabase 미연결 환경 fallback
  - RPC 실패 시 읽기 fallback 동작

### components

- `site/navigation/MobileBottomNav.test.tsx`
  - 아이템 수, active 상태, 토큰 기반 class, search action, analytics tracking
- `blog/ui/components/*.test.tsx`
  - PostCard/PostList/CategoryFilter 상태별 렌더/이벤트
- `ui/**/*.test.tsx`
  - Button/EmptyState/Route state 상태 검증

### styles

- `styles/tokens.test.ts`
- `styles/globals.test.ts`

## 문서 하네스

`npm run verify:docs`는 전체 Markdown 문서를 한 번에 검사하지 않는다. 현재
저장소에는 과거 글과 일부 guide에 남은 markdownlint 이슈가 있기 때문이다.
대신 의사결정과 작업 경계를 잡는 핵심 문서만 안정적으로 검증한다.

검증 범위:

1. `docs/README.md`에 명시된 문서 경로가 실제로 존재하는지 확인한다.
2. `AGENTS.md`와 `docs/adr/README.md`가 같은 ADR 작성 조건을 포함하는지
   확인한다.
3. `docs/adr/*.md` 파일이 ADR 인덱스에 등록되어 있는지 확인한다.
4. `AGENTS.md`, `docs/README.md`, `docs/adr/*.md`에 markdownlint를 실행한다.

문서 변경이 ADR, 저장소 규칙, 문서 인덱스에 닿으면 최소 검증으로
`npm run verify:docs`를 실행한다.

## Playwright 체크리스트

### 1) 모바일 내비 회귀

- 경로: `/`
- 기대:
  - 진입 즉시 하단 nav 가시
  - 스크롤 0/20/31/100 구간에서 y 값 기반 노출 변화
  - 라우트 이동 후 홈 복귀 시 다시 노출

### 2) 테마 토글

- 경로: `/`
- 기대:
  - 다크/라이트 토글 후 `html` 클래스 변경
  - nav 포커스 토큰 class 유지

### 3) safe-area / 여백

- `--mobile-bottom-nav-offset` 값 변경 시 body 패딩 값 변화

### 4) storage fallback

- `sessionStorage` 접근 불가 환경에서 진입 에러 없음
