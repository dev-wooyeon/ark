# 0051. viewport별 읽기 레이아웃과 타이포그래피 스케일을 사용한다

Date: 2026-07-24
Status: Accepted

## 배경

브라우저 창의 폭에 따라 identity rail, 주요 탐색, 글 본문이 서로 다른
읽기 맥락을 갖는다. 모든 breakpoint 규칙을 하나의 stylesheet에 두면 같은
selector의 적용값을 추적하기 어렵고, 글 본문과 홈의 레이아웃 요구도
혼합된다.

## 결정

- 공통 및 데스크톱 기본값은 `styles/globals.css`에 둔다.
- 모바일 규칙은 `styles/viewport/mobile.css`에서 `639px` 이하로 관리한다.
- 중간 폭 규칙은 `styles/viewport/tablet.css`에서 `640px`부터 관리한다.
- 글 본문 페이지의 non-mobile rail 배치는
  `styles/viewport/content.css`에서 관리한다.
- 글 본문 페이지는 웹과 태블릿 모두 좌측 identity 아래에 Resume와
  Archive를 두고, 우측 열을 본문에 사용한다.
- 글 상세 화면에는 조회수와 태그를 표시하지 않는다. 태그 데이터는
  검색·OG·분석 등 콘텐츠 메타데이터 용도로 유지한다.

## 결과

- viewport별 수정 위치가 명확해져 반복적인 폰트 조정과 레이아웃 점검이
  쉬워진다.
- 글 본문은 웹과 태블릿에서 동일한 rail 구조를 사용한다.
- 글 상세 헤더는 로고와 같은 상단선에서 시작하고, 메타 정보 뒤에 본문이
  자연스럽게 이어진다.

## 검증

- viewport stylesheet의 단위 테스트로 breakpoint와 selector를 확인한다.
- 전체 Vitest, ESLint, CSS syntax 검사를 실행한다.
- Playwright에서 855px 중간 폭과 모바일 홈·글 상세 경로를 검증한다.
