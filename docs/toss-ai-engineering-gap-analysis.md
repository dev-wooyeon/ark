# Toss-Inspired AI Engineering Gap Analysis

## Baseline Snapshot

- codebase files scanned: 68 (`src/**/*.{ts,tsx,js,jsx,css}`)
- corpus processed: 100 articles
- `use client` files: 24
- app route directories: 4
- route-level `loading.tsx`: 0
- route-level `error.tsx`: 0
- test files: 2

## Priority Findings

### P0

1. **`any` 타입 사용 남아있음**

- risk: 검색/SEO 경계에서 타입 안정성이 약해져 회귀 가능성 증가
- evidence:
  - `/Users/noah/workspace/personal/eunu.log/src/components/providers/KBarProvider.tsx:10`
  - `/Users/noah/workspace/personal/eunu.log/src/components/seo/JsonLd.tsx:1`
  - `/Users/noah/workspace/personal/eunu.log/src/lib/search.ts:7`
- action: `PostSummary`/`JsonLdData` 타입 정의 후 `any` 제거

2. **상태 완결 경계 부족 (`loading.tsx`/`error.tsx` 부재)**

- risk: 네트워크/렌더링 실패 시 사용자 복구 경로가 약함
- evidence:
  - `/Users/noah/workspace/personal/eunu.log/src/app`
- action: `blog`, `resume`, `home`에 route-level loading/error 경계 추가

### P1

3. **임의값 기반 스타일 다수 존재**

- risk: 디자인 시스템 확장 시 일관성/유지보수성 저하
- evidence:
  - `/Users/noah/workspace/personal/eunu.log/src/mdx-components.tsx:77`
  - `/Users/noah/workspace/personal/eunu.log/src/mdx-components.tsx:90`
  - `/Users/noah/workspace/personal/eunu.log/src/app/resume/page.tsx:154`
- action: 반복되는 `w-[2px]`, `rounded-[16px]`, `h-[500px]`를 토큰/유틸 클래스로 치환

4. **하드코딩 색상 분산**

- risk: 다크모드/브랜드 컬러 변경 시 영향 범위 예측 어려움
- evidence:
  - `/Users/noah/workspace/personal/eunu.log/src/app/api/og/route.tsx:30`
  - `/Users/noah/workspace/personal/eunu.log/src/components/visualization/TwoPointerVisualization.tsx:47`
- action: 시각화/OG 전용 색상 토큰 분리 (`--color-og-*`, `--color-viz-*`)

### P2

5. **테스트 커버리지가 낮음**

- risk: 리팩토링 속도 대비 회귀 탐지력이 약함
- evidence:
  - `/Users/noah/workspace/personal/eunu.log` 내 test 파일 2개
- action: 검색 액션 생성, 날짜/기간 계산, 토큰 매핑 로직 우선 단위 테스트 추가

6. **접근성 체계 점검 자동화 부족**

- risk: UI 변경 누적 시 접근성 품질 편차 발생
- evidence:
  - aria attribute 사용은 있으나 체계적 a11y 테스트 부재
- action: axe 기반 스모크 테스트와 PR 체크리스트 추가

## Recommended Roadmap

1. `P0` 주간: 타입 안전성 + route 경계 구축
2. `P1` 주간: 토큰화 리팩토링 + 색상 체계 분리
3. `P2` 주간: 테스트 확장 + 접근성 자동 검사 도입

## Done Definition (for each refactor)

- `npm run build` 통과
- 관련 테스트 통과 또는 신규 테스트 추가
- 다크/라이트, 모바일/데스크톱 영향 검토
- 변경 근거와 영향 범위가 PR 본문에 기록됨
