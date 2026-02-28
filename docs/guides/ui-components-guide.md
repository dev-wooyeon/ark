# UI Component Guide

## Button

### Variants

- `primary`: 핵심 CTA
- `secondary`: 보조 액션
- `tertiary`: 텍스트 버튼

### Sizes

- `sm`, `md`, `lg`

### States

- `loading`
- `disabled`
- `fullWidth`

## EmptyState

### Variants

- `default`: 일반 빈 상태
- `search`: 검색 빈 결과
- `error`: 오류 안내

### Sizes

- `sm`, `md`

### Action

- 클릭 액션: `action.onClick`
- 링크 액션: `action.href`

## Mobile Navigation Regression Check (TDS)

### Scope

- `src/shared/layout/Header/Header.tsx`
- `src/shared/layout/Header/MobileBottomNav.tsx`
- `src/shared/layout/Header/useScrollVisibility.ts`
- `src/styles/globals.css`
- `src/styles/tokens.css`

### Smoke scenarios (모바일 768px 이하)

#### 1. 홈 상단 진입(0~40px)

1. Navigate to `/`.
2. Verify header stays visible and bottom navigation is visible on first paint.
3. Verify all 5 bottom items are selectable and focusable.
4. Check bottom area gap is not overallocated (content should not look detached from nav).

#### 2. 홈 중간 스크롤(41~200px)

1. Scroll down from 홈 to around `41px`.
2. Verify top header hides on scroll-down and shows on small upward scroll.
3. Verify bottom nav can remain visible/hide according to the scroll direction rule and does not disappear on initial touch jitter.
4. Scroll from `41px` to `200px` and back; ensure behavior is stable and not flickering.

#### 3. 라우트 전환 복원성

1. From 홈, 이동 to `/blog`, `/blog/[slug]`, `/series`, `/resume` and back.
2. Verify 홈 재진입 시 하단 네비게이션은 다시 접근 가능한 상태로 시작.
3. Verify deep link 복귀 시 상단 헤더/바텀바가 과도하게 유지되지 않는지 확인.

#### 4. 블로그 글 상세 스크롤 UX (`/blog/*`)

1. Open any `/blog/...` 페이지.
2. Scroll down while header/bottom nav are shown -> confirm bottom nav hides on downward movement.
3. Scroll up -> confirm bottom nav reappears.
4. Confirm top header follows same hide/show rule.

#### 5. 다크 / 라이트 토글 상태

1. Toggle theme while on 모바일 뷰.
2. Verify nav active item bg/border and focus ring contrast is readable in both themes.
3. Verify active text and idle text colors are distinct and not washed out.

#### 6. 안전영역 / 여백 검증

1. Use iOS 시뮬레이터 or mobile device with home-indicator inset.
2. Verify bottom reserved space uses `env(safe-area-inset-bottom)` and does not double-apply when bottom nav is hidden.

#### 7. 저장소 접근 제한 대응

1. Simulate blocked or private mode with storage restrictions.
2. Confirm nav visibility still works without runtime errors.
3. Confirm no layout reserve gap remains when 바텀바가 닫힘 상태일 때.

## Automated QA Mapping

- `npm run test:unit`
  - Layout hook: `/`와 `/blog/*`에서 홈/스크롤 동작 회귀
- `npm run test:components`
  - 모바일 바텀 네비, Header, 버튼/빈상태/필터 컴포넌트의 상태/클래스 회귀
- `npm run test:e2e`
  - `tests/e2e/smoke/mobile-nav.smoke.spec.ts`
  - `tests/e2e/regression/theme-regression.spec.ts`
  - `tests/e2e/layout/safe-area.spec.ts`
  - `tests/e2e/resilience/session-storage-fallback.spec.ts`
