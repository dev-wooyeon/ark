# 0005. Token-first Tailwind 스타일링을 사용한다

Date: 2026-01-27
Status: Accepted

## 배경

초기 UI는 CSS Modules와 global CSS를 사용했다. 1월 리디자인 과정에서
프로젝트는 Next.js 16, Tailwind CSS v4, 로컬 폰트, CSS variables로
이동했다. 이후 TDS 영향을 받은 작업을 통해 shared token과 스타일 규칙이
강화됐다.

현재 가이드는 일회성 값보다 표준 Tailwind utility, CSS variables, token을
우선한다.

## 결정

Tailwind CSS와 CSS variables를 주요 스타일링 시스템으로 사용한다. 디자인
token은 `src/styles/tokens.css`에 두고, 전역 base style은
`src/styles/globals.css`에 둔다.

## 결과

- 시각적 선택을 검토하고 재사용하기 쉬워진다.
- 스타일 시스템을 의도적으로 확장하는 경우가 아니라면 arbitrary Tailwind
  value를 피해야 한다.
- global CSS는 token과 base style 중심으로 유지해야 한다.
- 컴포넌트별 스타일은 기존 utility와 shared token 패턴을 따라야 한다.

## 검토한 대안

- CSS Modules 중심 시스템: 익숙하고 scope가 명확하지만 리디자인 과정에서
  이미 주요 경로에서 제거됐다.
- inline style: 빠른 일회성 구현에는 좋지만 통제와 테스트가 어렵다.
- 컴포넌트 라이브러리 도입: 커스텀 시각 방향을 가진 개인 블로그에는
  지나치게 무겁다.

## 관련 히스토리

- `1df701f` (2026-01-27): Tailwind v4 업그레이드와 사이트 리디자인.
- `c987764` (2026-01-28): CSS Modules를 Tailwind로 전환.
- `e3bee05` (2026-01-28): 스타일링 접근 표준화.
- `420a5bb` (2026-02-07): TDS token 설정 추가.
- `5be50b5` (2026-02-28): 문서와 token 구조 정리.
