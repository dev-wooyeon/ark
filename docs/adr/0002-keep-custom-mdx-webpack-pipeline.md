# 0002. 커스텀 MDX webpack 파이프라인을 유지한다

Date: 2026-01-27
Status: Accepted

## 배경

블로그는 Markdown 파일에서 MDX로 이동했다. 글 안에서 더 풍부한 콘텐츠,
커스텀 컴포넌트, 코드 하이라이팅, heading, 인터랙티브 위젯을 렌더링하기
위해서였다. 현재 파이프라인은 `next.config.mjs`에서 `@mdx-js/loader`,
`remark-gfm`, `rehype-slug`, `rehype-pretty-code`를 직접 연결한다.

이 파이프라인은 콘텐츠 시스템의 일부다. Next.js 내장 MDX로 교체하면
heading 생성, 코드 렌더링, 컴포넌트 매핑, 글 import 방식이 달라질 수
있다.

## 결정

MDX는 `next.config.mjs`의 커스텀 webpack rule로 유지한다. 커스텀
컴포넌트 매핑은 `src/features/blog/ui/mdx/components.tsx`에 집중한다.

## 결과

- MDX 동작을 하나의 Next.js 설정 파일에서 명시적으로 검토할 수 있다.
- 코드 하이라이팅과 slug 동작이 글 전체에서 안정적으로 유지된다.
- Next.js 빌드는 webpack 경로를 계속 사용해야 한다.
- 향후 MDX를 바꾸려면 패키지 교체가 아니라 콘텐츠 파이프라인 마이그레이션
  작업으로 다뤄야 한다.

## 검토한 대안

- Next.js 내장 MDX: 로컬 설정은 줄어들지만 현재 글 렌더링 계약을 바꿀
  위험이 있다.
- Plain Markdown: 수집은 단순하지만 React 컴포넌트와 인터랙티브 시각화
  지원을 잃는다.

## 관련 히스토리

- `e97330d` (2026-01-27): 피드 콘텐츠를 MDX로 마이그레이션.
- `fc500c6` (2026-01-27): MDX 처리 인프라 추가.
- `90a22b0` (2026-01-27): 피드 페이지를 MDX 렌더링으로 전환.
- `cf1c9cb` (2026-01-28): Next 설정을 `next.config.mjs`로 이동.
- `5be50b5` (2026-02-28): 소스 구조 개편 중 커스텀 MDX 유지.
- `9545057` (2026-03-30): 현재 저장소 규칙과 충돌하던 구조 평탄화 계획
  폐기.
