# 0032. 데스크톱 레일을 홈 워드마크와 보조 링크로 축소한다

Date: 2026-07-19
Status: Accepted

## 배경

홈은 전체 아카이브를 보여 주고 Tech와 Life 필터를 제공한다. 데스크톱 레일의
Home, Tech, Life 항목은 이 탐색 경로를 반복해 콘텐츠보다 앱 내비게이션의
비중을 키웠다.

이력서와 외부 연락 채널은 글 분류와 다른 성격의 목적지다. 이들은 아카이브의
주요 경로와 경쟁하지 않도록 레일 하단에 모으는 편이 자연스럽다.

## 결정

- 데스크톱 레일 상단에는 홈으로 연결되는 `ark` 워드마크 링크 하나만 둔다.
- Resume, GitHub, Email, RSS는 레일 하단의 보조 링크로 둔다.
- Tech와 Life route 및 홈의 카테고리 필터는 유지하되, 데스크톱 레일에서는
  직접 노출하지 않는다.
- 모바일 드로어는 좁은 화면에서의 명시적 탐색 수단으로 유지한다.

## 결과

- 홈이 아카이브의 단일 진입점이라는 정보 구조가 선명해진다.
- 레일은 서비스 메뉴가 아니라 사이트 정체성과 보조 목적지를 담는 여백으로
  동작한다.
- 직접 URL, 기존 Tech·Life route, 모바일 탐색은 보존되어 링크와 검색 엔진
  경로에 영향을 주지 않는다.

## 검토한 대안

- Home, Tech, Life를 모두 유지한다: 카테고리 필터와 같은 목적의 컨트롤이
  반복된다.
- 모든 화면에서 Tech와 Life 진입점을 제거한다: 모바일과 목적별 목록에서
  빠른 이동 경로까지 잃는다.
- Resume를 별도 상단 메뉴로 둔다: 아카이브 탐색과 개인 정보 목적지가 같은
  위계를 갖게 된다.

## Related History

- [ADR 0009](0009-use-app-shell-for-primary-navigation.md): AppShell 기반 탐색
- [ADR 0029](0029-use-link-like-controls-for-home-category-filtering.md): 홈
  카테고리 필터
- [ADR 0031](0031-adopt-a-single-paper-theme-and-retire-command-palette.md):
  Paper 테마와 명령 팔레트 제거
