# 0040. 외부 링크는 sticky 정체성 레일에 둔다

Date: 2026-07-20
Status: Accepted

## 배경

Ark의 외부 링크는 문서 흐름의 footer에 있었다. Home처럼 짧은 route에서는
좌하단에 보이지만, Archive처럼 콘텐츠가 긴 route에서는 모든 글 목록 뒤에
배치되어 연락 경로를 바로 찾을 수 없었다.

Ark의 `ark` 워드마크는 좌측 열에서 사이트 정체성을 전달한다. GitHub, Email,
RSS도 같은 정체성 레일 안에 두면 콘텐츠 길이와 무관하게 처음부터 확인할 수
있다.

## 결정

- 외부 링크는 문서 흐름의 footer에서 제거하고, `ark` 워드마크와 같은 좌측
  identity rail에 둔다.
- identity rail은 shell의 상하 여백을 제외한 viewport 높이를 사용하고 sticky로
  고정한다.
- 워드마크는 rail 상단에, GitHub, Email, RSS는 rail 하단에 세로로 쌓는다.
- 데스크톱에서는 2-6-4 shell의 첫 열을 사용한다. 모바일에서는 기존 1-4 grid의
  첫 열을 사용하며, 주요 탐색은 워드마크 아래에 그대로 둔다.

## 결과

- Archive의 길이와 관계없이 외부 링크가 첫 화면 좌하단에 표시된다.
- 사이트 정체성, 주요 탐색, 외부 연락 경로의 역할이 각각 좌측, 우측, 좌측에
  고정되어 읽기 순서가 예측 가능해진다.
- footer를 기다리지 않아도 GitHub와 Email로 이동할 수 있다.

## 검토한 대안

- footer를 유지한다: 문서의 끝에는 자연스럽지만 긴 Archive에서 발견이 늦다.
- 외부 링크를 우측 주요 탐색 아래에 둔다: 탐색과 연락의 역할이 섞이고, Resume과
  Archive의 우선순위가 약해진다.
- 별도 floating 버튼을 둔다: 즉시성은 높지만 Paper shell의 정적인 편집 구조와
  맞지 않는다.

## 검증

- AppShell 테스트로 외부 링크가 identity rail 안에 있고 footer가 없는지
  검증한다.
- Playwright로 Archive에서 데스크톱과 모바일 모두 외부 링크가 좌하단에
  표시되는 좌표를 검증한다.

## Related History

- [ADR 0009](0009-use-app-shell-for-primary-navigation.md): AppShell의
  주요 탐색 책임
- [ADR 0037](0037-adopt-zero-log-grid-site-shell.md): 2-6-4 shell과
  좌측 외부 링크 배치
