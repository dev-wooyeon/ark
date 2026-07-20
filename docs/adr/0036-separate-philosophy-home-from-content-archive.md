# 0036. 철학 우선 홈과 콘텐츠 Archive를 분리한다

Date: 2026-07-20
Status: Accepted

## 배경

기존 홈은 최신 글을 바로 훑는 날짜와 제목의 아카이브였다. 이 구조는 글을
찾아 읽는 방문자에게는 효율적이지만, 처음 방문한 사람이 Ark를 만든 사람의
관점과 역할을 파악할 단서를 제공하지 못했다.

Ark의 정체성은 불필요한 복잡함을 줄이면서 신뢰할 수 있는 서버 시스템을
만드는 엔지니어링 철학에 있다. 첫 화면은 그 관점을 짧게 전달하고, 더 알고
싶은 사람에게 글과 이력서라는 두 가지 검증 경로를 명시적으로 제공해야 한다.

## 결정

- `/`는 두 문장의 철학 중심 랜딩으로 둔다. 홈은 글 목록이나 카테고리 필터를
  렌더링하지 않는다.
- 기존 홈의 All, Tech, Life 필터와 날짜·제목 행 목록은 `/archive`로 옮긴다.
- 전역 주요 탐색에는 `Archive`와 `Resume`만 노출한다. `ark` 워드마크는 홈으로
  연결한다.
- 기존 `/engineering`, `/life`, `/blog/[slug]` route는 직접 URL로 계속 접근할 수
  있으며, 이 route에서는 `Archive`를 활성 상태로 표시한다.
- `/blog`는 중복된 목록 대신 `/archive`로 이동한다.
- `/series`는 기존처럼 Engineering의 시리즈 필터로 이동한다.
- 데스크톱의 GitHub, Email, RSS는 화면 좌하단 보조 링크로 유지한다. 모바일은
  `Archive`, `Resume`을 상단에 바로 노출하고 외부 링크는 하단에 둔다.
- 이력서의 본문과 레이아웃은 이 결정의 범위에 포함하지 않는다.

## 결과

- 첫 방문자는 짧은 문장으로 Ark의 관점을 먼저 읽고, 필요할 때만 Archive 또는
  Resume로 이동한다.
- 글을 자주 찾는 방문자는 `/archive`에서 이전과 동일한 최소 행 아카이브와
  카테고리 필터를 사용한다.
- 데스크톱과 모바일 모두 메뉴를 열거나 여러 분류를 해석하기 전에 두 핵심
  목적지에 도달할 수 있다.

## 검토한 대안

- 홈 상단에 짧은 소개와 아카이브를 함께 둔다: 철학 문장과 글 목록이 첫 화면의
  주목을 경쟁하게 된다.
- 프로젝트 카드 중심의 포트폴리오 홈을 만든다: 이력서와 글에 이미 있는 증거를
  중복하고, 현재의 간결한 사이트 정체성과 맞지 않는다.
- 모바일에서도 주요 목적지를 드로어에 숨긴다: 화면은 단순하지만 Archive와
  Resume로 가는 의도가 한 단계 늦어진다.

## 검증

- HomePage unit test로 철학 문장만 렌더링하고 아카이브 필터가 없음을 검증한다.
- ArchivePageClient와 archive-feed unit test로 기존 필터와 날짜·제목 목록
  동작을 검증한다.
- Playwright smoke test로 데스크톱과 모바일의 Archive, Resume 노출과
  `/archive` 필터 동작을 검증한다.

## Related History

- [ADR 0030](0030-use-date-title-rows-for-home-archive.md): 날짜와 제목만의
  아카이브 행은 Archive route에서 유지한다.
- [ADR 0032](0032-reduce-desktop-rail-to-home-wordmark-and-utilities.md):
  레일 탐색 범위를 Archive와 Resume으로 다시 정의한다.
- [ADR 0035](0035-prioritize-mobile-archive-reading-order.md): 모바일 드로어
  대신 상단의 명시적 주요 탐색을 사용한다.
