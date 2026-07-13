# 0023. 배포 품질 gate를 CI에서 실행한다

Date: 2026-07-13
Status: Accepted

## 배경

저장소에는 lint, 문서 검증, 콘텐츠 감사, 단위 테스트, production build,
Playwright 시나리오가 있었지만 GitHub Actions는 PR 제목만 검사했다. 로컬에서
검사를 실행하지 않으면 인기순처럼 UI가 존재해도 운영 계약이 끊어진 변경이나,
모바일에서만 발생하는 레이아웃 회귀가 그대로 병합될 수 있었다.

## 결정

- pull request와 `master` push에서 같은 품질 gate를 실행한다.
- gate는 lint, CSS syntax, 문서 검증, 콘텐츠 감사, 단위 테스트, production
  build, Playwright 시나리오를 모두 포함한다.
- Playwright는 저장소가 지원하는 Chromium desktop·mobile·dark project를
  실행한다.
- 실패한 브라우저 결과는 7일 동안 artifact로 남긴다.
- 중복 실행은 새 commit이 올라오면 취소한다.

## 결과

- PR 제목뿐 아니라 실제 배포 가능성과 고객 경로가 병합 조건이 된다.
- 로컬과 CI는 `npm run test:ci`라는 같은 진입점을 사용한다.
- Chromium 설치와 production build 때문에 CI 시간이 늘어나지만, 현재 규모에서는
  병합 후 회귀 비용보다 작다.

## 검토한 대안

- lint와 단위 테스트만 실행: 빠르지만 MDX production build와 실제 viewport
  회귀를 잡지 못한다.
- Vercel preview만 신뢰: 배포 성공 여부는 알 수 있지만 콘텐츠 정책과 상호작용
  결과를 자동으로 판정하지 않는다.
- 브라우저 검사를 별도 수동 단계로 유지: 실행 여부가 사람의 기억에 의존한다.

## Related History

- `34d82f0`: 실제 article shell을 검증하는 Playwright 회귀 시나리오 추가
