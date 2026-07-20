# 0042. 경로 오류 상태를 콘텐츠 열의 텍스트 상태로 표현한다

Date: 2026-07-20
Status: Accepted

## 배경

기존 경로 오류 화면은 중앙 정렬된 Tossface 경고 이모지, 큰 제목, 둥근 버튼을
공통 `EmptyState`로 조합했다. 이 구성은 빠르게 실패를 알리지만, 무채색 종이
표면과 2-6-4 shell을 사용하는 Ark의 현재 화면 좌표 및 타이포그래피와 분리돼
보였다.

경로 오류는 일반적인 빈 상태와 다르다. 방문자가 현재 route의 콘텐츠 열에
머무른 채 복구 행동을 선택할 수 있어야 하며, 실패를 장식적인 일러스트보다
명확한 상태 정보로 전달해야 한다.

## 결정

- 공통 `RouteError`는 `EmptyState`를 조합하지 않고 자체 텍스트 상태를
  렌더링한다.
- 상태는 콘텐츠 열의 시작점에서 `UNAVAILABLE` 표식, 16px 제목, 설명, 밑줄
  `다시 시도` 행동 순서로 표시한다.
- 오류 상태는 `role="status"`와 polite live region을 유지한다.
- 재시도 행동은 버튼 의미를 유지하되, 배경색·반경·아이콘을 사용하지 않는
  텍스트 컨트롤로 표현한다.
- 일반적인 비어 있음은 기존 `EmptyState`를 계속 사용한다. 글 목록과 시리즈의
  안내성 빈 상태에는 이 변경을 적용하지 않는다.

## 결과

- 네 route error boundary가 동일한 실패 정보와 복구 행동을 제공하면서도,
  shell의 콘텐츠 열과 같은 좌표 및 대비 체계를 사용한다.
- 노란 경고 이모지가 제거되어 오류를 제외한 색상 체계의 무채색 원칙이
  유지된다.
- 빈 상태의 안내적 성격과 오류 상태의 복구적 성격이 UI 경계에서 분리된다.

## 검토한 대안

- 기존 `EmptyState`의 error variant만 다듬는다: 공통성은 유지하지만 일반
  빈 상태의 구성 제약까지 route error에 전달된다.
- 노란 또는 amber 경고 아이콘을 유지한다: 심각도 인지는 빨라지지만 현재
  팔레트 밖의 한 색이 오류 화면만 분리한다.
- 경로 오류를 자체 텍스트 상태로 분리한다: 컴포넌트 하나가 늘어나지만,
  상태 정보와 일반 빈 상태의 목적을 명확하게 나눈다.

## 검증

- `RouteError` 컴포넌트 테스트로 상태 표식, 제목, 이모지 부재, 텍스트
  재시도 행동을 검증한다.
- CSS syntax 검사로 새 shell 상태 스타일의 문법을 검증한다.
- production build로 App Router error boundary가 공통 컴포넌트를 계속
  로드하는지 확인한다.

## Related History

- [ADR 0034](0034-adopt-the-graphite-ink-palette.md): Graphite Ink 팔레트
- [ADR 0037](0037-adopt-zero-log-grid-site-shell.md): 전역 2-6-4 shell
- [ADR 0038](0038-use-jetbrains-mono-for-home-statement.md): 제한된 범위의
  JetBrains Mono 사용
