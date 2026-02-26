# Testing Guide for eunu.log

## Test Stack

- Unit/컴포넌트: `Vitest + React Testing Library`
- E2E: `Playwright`

## 실행 스크립트

- `npm run test:unit` : 전체 Vitest 실행
- `npm run test:components` : UI 컴포넌트 중심 테스트 실행
- `npm run test:smoke` : 유닛 smoke + Playwright smoke
- `npm run test:e2e` : 전체 Playwright 시나리오

## 단위 테스트 체크리스트

### lib

- `src/lib/analytics.test.ts`
  - GA ID 부재/부재 조건에서 이벤트 미발송
  - trackEvent, trackPageView 실 발송 가드

- `src/lib/mdx-feeds.test.ts`
  - 정렬/시리즈 조회/SKU 슬러그 수집

- `src/lib/search.test.ts`
  - 키워드 생성/nullable tags 처리

- `src/lib/markdown.test.ts`
  - TOC ID 생성 및 중복 처리

### app actions

- `src/app/actions/view.test.ts`
  - 슬러그 정규화
  - Supabase 미연결 환경 fallback
  - RPC 실패 시 읽기 fallback 동작

### components

- `src/components/layout/Header/useScrollVisibility.test.ts`
  - 홈/블로그 경로별 top/bottom visibility 동작, 스크롤 임계값
  - 바텀바 오프셋 CSS 변수 동기화
- `src/components/layout/Header/MobileBottomNav.test.tsx`
  - 아이템 수, active 상태, 토큰 기반 class, search action, analytics tracking
- `src/components/layout/Header/Header.test.tsx`
  - 헤더 하위 컴포넌트 연결 및 top header 상태 반영
- `src/components/blog/*.test.tsx`
  - PostCard/PostList/CategoryFilter 상태별 렌더/이벤트
- `src/components/ui/*.test.tsx`
  - Button/EmptyState/Route state 상태 검증

### styles

- `src/styles/tokens.test.ts`
- `src/styles/globals.test.ts`

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
