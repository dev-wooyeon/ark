# 0055. Quality CI 실행 환경을 Ubuntu 24.04로 고정한다

Date: 2026-11-03
Status: Accepted

## 배경

PR #134의 Quality CI에서 `ubuntu-latest`가 Ubuntu 26.04로 실행됐다.
Playwright 1.58.2가 해당 OS의 Chromium 의존성 설치를 지원하지 않아
콘텐츠 검증과 테스트를 시작하기 전에 실패했다.

## 결정

- Chromium을 설치하는 Quality job의 runner를 `ubuntu-24.04`로 고정한다.
- Playwright 버전과 기존 품질 검사 명령은 유지한다.
- 브라우저 설치가 없는 PR 제목 검사 job은 변경하지 않는다.

## 결과

runner의 기본 OS 변경과 브라우저 의존성 호환성을 분리한다. 향후 runner를
올릴 때는 Chromium 설치와 전체 Quality CI 통과를 함께 확인해야 한다.
OS의 최신 버전 자동 적용은 포기한다.

## 검토한 대안

- Playwright 업그레이드: 테스트 도구와 브라우저 변경까지 검증 범위가 넓어진다.
- 실패한 검사를 생략: 배포 전 품질 검증이 사라지므로 채택하지 않는다.

## Related History

- [실패한 CI 실행](https://github.com/dev-wooyeon/ark/actions/runs/41560509997)
- [PR #134](https://github.com/dev-wooyeon/ark/pull/134)
