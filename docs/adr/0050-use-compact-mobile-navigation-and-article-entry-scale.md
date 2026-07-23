# 0050. 모바일 컴팩트 탐색과 글 상세 진입 스케일을 사용한다

Date: 2026-07-23
Status: Accepted

## 배경

현재 shell은 모바일에서도 `1fr 4fr` grid를 사용해 로고와 탐색을 왼쪽
열에 고정한다. 작은 화면에서 이 열이 본문 폭을 지속적으로 차지해 글을
읽을 수 있는 공간이 줄어든다.

또한 홈의 14px 소개 문장과 글 상세의 제목·17px 본문 사이의 대비가 커서,
사용자가 글에 진입할 때 본문이 갑자기 커진 것처럼 느낄 수 있다.

## 결정

- 데스크톱의 `2fr 6fr 4fr` shell과 sticky identity rail은 유지한다.
- 모바일은 단일 콘텐츠 열로 전환하고, `identity → 주요 탐색 → content`
  순서의 상단 영역을 사용한다.
- 모바일 identity 영역은 로고와 GitHub, Email, RSS를 가로로 배치한다.
  주요 탐색도 별도의 가로 행으로 항상 노출한다.
- 홈 소개 문장에는 16px `--text-entry` 토큰을 사용해 기존 14px보다 본문에
  가까운 진입 크기를 제공한다. JetBrains Mono와 24px line-height는
  유지한다.
- 글 상세 제목은 모바일 32px, 데스크톱 40px으로 두고, 본문 내부 제목은
  28px, 24px, 20px 순서로 글 제목과 중복되지 않게 한다. 메타데이터와
  본문 사이의 간격은 의미 토큰으로 관리하고, 본문은 17px과 1.72
  line-height를 유지한다.
- 글 상세의 시리즈 탐색, 댓글, 목차, 읽기 진행도와 MDX pipeline은
  변경하지 않는다.

## 결과

- 모바일 글 본문이 좌측 레일에 의해 축소되지 않는다.
- 로고와 주요 이동 경로는 글을 읽기 전 상단에서 계속 발견할 수 있다.
- 콘텐츠 읽기 baseline은 유지하면서 글 진입 시 제목과 본문의 시각적
  점프가 줄어든다.

## 검토한 대안

- 모바일 좌측 레일을 유지하고 폭만 줄인다: 본문 폭 문제를 근본적으로
  해결하지 못하므로 채택하지 않는다.
- 모바일에서 탐색을 접기 UI로 숨긴다: 본문 폭은 확보되지만 핵심 경로의
  발견 가능성이 낮아지므로 채택하지 않는다.
- 본문을 16px로 줄인다: 진입 대비는 낮아지지만 현재의 긴 글 가독성
  기준을 훼손하므로 채택하지 않는다.

## 검증

- AppShell 및 스타일 테스트로 링크 구조, 단일 열 규칙, 읽기 토큰을
  검증한다.
- Playwright mobile 프로젝트에서 상단 탐색, article 본문 폭, 표 가로
  스크롤을 검증한다.
- Playwright desktop 프로젝트에서 기존 2-6-4 좌표와 17px 본문 기준을
  검증한다.

## Related History

- [ADR 0037](0037-adopt-zero-log-grid-site-shell.md): 2-6-4 shell과
  기존 모바일 1-4 grid
- [ADR 0038](0038-use-jetbrains-mono-for-home-statement.md): 홈 소개
  문장의 JetBrains Mono 사용
- [ADR 0040](0040-keep-external-links-in-sticky-identity-rail.md):
  identity rail 외부 링크 배치
