# 0037. zero.log 형태의 2-6-4 사이트 shell을 사용한다

Date: 2026-07-20
Status: Accepted

## 배경

Ark의 철학 우선 홈과 Archive 분리는 완료했지만, 헤더와 본문이 일반적인 가로
내비게이션과 중앙 컨테이너에 남아 있었다. 이 구조는 소개 문장, 글 아카이브,
Resume의 관계를 한 화면에서 같은 위계로 보이지 못하게 했다.

참조한 zero.log는 데스크톱에서 정체성, 콘텐츠, 주요 탐색을 하나의 2-6-4
그리드에 두고, 모바일에서는 정체성과 주요 탐색을 왼쪽 열에 쌓아 콘텐츠 열을
보존한다. Ark도 같은 정보 구조에 맞는 shell이 필요하다.

## 결정

- 전역 shell은 데스크톱에서 `2fr 6fr 4fr` 세 열과 40px 열 간격을 사용한다.
- shell의 바깥 여백은 데스크톱 32px, 모바일 16px이며 상하 여백은 40px으로
  둔다.
- 첫 열에는 `ark` 워드마크를 둔다. 둘째 열에는 현재 route의 콘텐츠를 둔다.
  셋째 열에는 `Resume`, `Archive` 순서의 주요 탐색을 둔다.
- 모바일에서는 `1fr 4fr` 두 열로 전환한다. 주요 탐색은 워드마크 아래로
  이동하고, route 콘텐츠는 오른쪽 열의 상단에서 시작한다.
- 외부 링크는 화면 또는 문서의 좌하단에서 세로로 쌓는다. route 콘텐츠가
  길면 footer는 문서 흐름 아래로 이동한다.
- 홈은 둘째 열에서 두 줄의 소개 문장만 렌더링한다. Archive는 같은 열에서
  카테고리 필터 없이 날짜와 제목 행만 렌더링한다.
- 문서 흐름 스크롤을 사용한다. `data-page-scroll-container`는 읽기 진행도
  소비자에게 문서 스크롤 모드를 명시한다.
- Resume의 내용 구성은 바꾸지 않는다. Resume은 새 shell의 콘텐츠 열 안에서
  기존 데이터를 계속 렌더링한다.

## 결과

- 데스크톱과 모바일 모두 정체성, 증거, 다음 행동이 동일한 좌표 체계를
  공유한다.
- 홈과 Archive는 별도의 페이지 목적을 가지면서도 같은 콘텐츠 열을 사용한다.
- 기존 `/archive`, `/resume`, 상세 글, Engineering, Life route는 유지된다.

## 검토한 대안

- 이전의 가로 헤더를 유지한다: 주요 탐색은 빠르지만 소개 문장과 Archive가
  서로 다른 레이아웃 체계에 남는다.
- 홈만 참조 레이아웃으로 바꾼다: Archive와 Resume에서 사이트 정체성이
  끊긴다.
- 모바일에서 주요 탐색을 가로 헤더에 둔다: 짧은 화면에서 소개 문장에 쓸
  오른쪽 열의 폭을 줄인다.

## 검증

- AppShell 컴포넌트 테스트로 Resume과 Archive 순서 및 활성 상태를 검증한다.
- Playwright smoke test로 데스크톱의 2-6-4 좌표와 모바일의 1-4 좌표를
  검증한다.
- Playwright 회귀 테스트로 문서 스크롤 기반 읽기 진행도가 유지되는지
  검증한다.

## Related History

- [ADR 0030](0030-use-date-title-rows-for-home-archive.md): 날짜와 제목만의
  Archive 행
- [ADR 0036](0036-separate-philosophy-home-from-content-archive.md): 철학 우선
  홈과 Archive route 분리
