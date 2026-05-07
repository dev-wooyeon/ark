# 0004. Feature-first 소스 구조를 유지한다

Date: 2026-02-28
Status: Accepted

## 배경

소스 트리는 여러 차례 구조 변경을 거쳤다. 초기 코드는 route-local 구조와
일반 컴포넌트 폴더에 섞여 있었다. 이후 라우트, feature 모듈, shared
인프라, domain 계약, app-level provider를 분리했다.

나중에 일반적인 Next.js 구조로 평탄화하자는 실행 계획도 있었지만, 저장소
가이드와 충돌했기 때문에 superseded 상태로 정리됐다.

## 결정

다음 feature-first 구조를 유지한다.

- `src/app/**`: App Router 진입점.
- `src/features/**`: 기능 구현.
- `src/domains/**`: feature 사이에서 공유되는 계약과 스키마.
- `src/shared/**`: 재사용 가능한 layout, UI, analytics, SEO, provider,
  integration.
- `src/core/**`: 앱 수준 설정과 provider 조합.

## 결과

- flat shared component 디렉터리보다 소유권이 명확하다.
- 라우트 파일은 얇게 유지하고 feature page를 조합할 수 있다.
- shared 코드로 올릴 때는 feature-local 코드보다 높은 재사용 기준이 필요하다.
- 리팩터링 시 import와 테스트를 이 경계에 맞춰 유지해야 한다.

## 검토한 대안

- route-local 구현: 작은 앱에는 유용하지만 blog, resume, search, home
  기능이 커지면서 중복이 늘었다.
- flat `components/`, `lib/`, `types/`: 처음에는 단순하지만 feature 소유권과
  계약이 흐려진다.
- 일반적인 Next.js 평탄화: 실행 계획 아카이브에서 명시적으로 superseded
  처리됐다.

## 관련 히스토리

- `e17fe0f` (2026-01-25): 첫 feature 기반 컴포넌트 재구성.
- `5be50b5` (2026-02-28): FSD 스타일 마이그레이션 정리.
- `2c92fdc` (2026-02-26): 아키텍처 기준 문서 추가.
- `9545057` (2026-03-30): 평탄화 계획을 superseded 상태로 completed에 이동.
