# 0046. 저장소의 주 브랜치를 main으로 통일한다

Date: 2026-07-22
Status: Accepted

## 배경

원격 기본 브랜치는 `master`였고 로컬 `main`은 `origin/master`를 추적했다.
이 상태에서는 브랜치 이름과 CI push 대상이 달라 새 작업의 기준을 혼동하기 쉽다.

## 결정

- GitHub 기본 브랜치와 `origin/HEAD`를 `main`으로 전환한다.
- 로컬 `main`은 `origin/main`을 추적한다.
- 품질 gate는 pull request와 `main` push에서 실행한다.
- 기존 `master`는 외부 참조를 확인하는 전환 기간 동안 유지한다.

## 결과

- 새 작업, CI, 원격 기본 브랜치가 모두 `main`을 기준으로 한다.
- `master`를 즉시 삭제하지 않아 기존 clone, 링크, 자동화의 중단을 피한다.
- 전환 기간이 끝나면 참조를 확인한 뒤 `master` 제거 여부를 별도로 결정한다.

## 검토한 대안

- `master`를 계속 사용: 현 상태를 유지하지만 로컬 `main`과의 혼동을 남긴다.
- 로컬 브랜치만 이름 변경: 원격 기본 브랜치와 CI 대상이 달라 문제가 지속된다.
- `master`를 즉시 삭제: 정리는 빠르지만 남은 외부 참조를 즉시 깨뜨릴 수 있다.

## Related History

- `9d7c0a9`: 품질 gate를 GitHub Actions에 추가
