# 0009. 주요 탐색에 AppShell을 사용한다

Date: 2026-04-21
Status: Accepted, path amended by [0011](0011-adopt-frontend-modular-monolith.md)

Note: ADR 0011 moves AppShell from `src/ui/layout/AppShell/**` to
`site/shell/AppShell/**` while preserving the single app-shell navigation
decision.

## 배경

탐색과 홈 경험은 여러 번 바뀌었다. header 기반 블로그 탐색, 모바일 bottom
navigation, Engineering/Life IA, 이후 Linear 스타일 shell이 있었다. 정리
후 살아남은 장기 결정은 AppShell 레이아웃 모델이다.

AppShell이 실제 렌더링 구조가 된 뒤에는 예전 header, home section, logo,
motion toggle이 제거됐다.

## 결정

앱 경험의 주요 레이아웃과 탐색 프레임으로 `src/ui/layout/AppShell/**`을
사용한다. feature page는 navigation chrome을 다시 만들지 않고 이 shell
안에 조합된다.

## 결과

- 탐색 동작은 하나의 주요 소유자를 가진다.
- 모바일과 데스크톱 레이아웃 결정을 shell 기준으로 테스트할 수 있다.
- feature page는 콘텐츠에 집중하고 app chrome 중복을 피해야 한다.
- legacy header나 home section 코드는 새 ADR 또는 명시적인 결정 반전 없이
  다시 도입하지 않는다.

## 검토한 대안

- 페이지별 탐색: 유연하지만 페이지마다 동작이 중복되고 회귀가 생기기 쉽다.
- header-only 탐색: 단순하지만 현재 app-like IA와 모바일 상호작용에는
  덜 맞는다.
- 마케팅 스타일 home section: product-like shell이 기본 경험이 된 뒤
  제거됐다.

## 관련 히스토리

- `6acdcac` (2026-04-21): Linear 스타일 AppShell 도입.
- `d10d2b1` (2026-04-21): 블로그 shell과 탐색 동작 개선.
- `8d2f78f` (2026-04-22): 모바일 탐색과 레이아웃 문제 수정.
- `6c962cc` (2026-04-23): 사용하지 않는 예전 레이아웃 코드 제거.
