# 0012. Next.js route adapter를 루트 `app/`에 둔다

Date: 2026-05-08
Status: Accepted

## 배경

ADR 0011에서 주요 도메인 모듈을 저장소 최상위로 올렸지만, Next.js App Router
진입점은 `src/app/`에 남겨 두었다. 그 결과 `src/` 아래에는 실질적으로 route
adapter만 남았고, 빈 `src/shared/` 하위 디렉터리도 로컬 작업 트리에 남아 있었다.

팀 차원에서 경계를 명확히 유지하려면 애매한 중간 그룹을 두기보다 파편화된
책임 경계를 먼저 드러내고, 필요할 때 합치는 편이 유지보수에 유리하다.
`src/app/`은 프레임워크 진입점이라는 의미는 있었지만, 현재 구조에서는 `src/`가
새로운 코드 경계처럼 오해될 수 있다.

## 결정

Next.js App Router route adapter를 `src/app/`에서 루트 `app/`으로 이동한다.
빈 `src/` 디렉터리는 제거하고, 새 코드 경계로 재도입하지 않는다.

저장소 최상위 경계는 다음 기준을 따른다.

- `app/`: Next.js route adapter, route handler, metadata entry.
- `blog/`, `resume/`, `search/`: 주요 도메인 모듈.
- `site/`: 도메인 조합과 앱 shell.
- `infra/`: 외부/런타임 인프라.
- `ui/`: 도메인 지식 없는 재사용 코드.
- `styles/`: 전역 스타일과 디자인 토큰.
- `posts/`: 앱 코드와 수명주기가 다른 콘텐츠.

`apps/web` 같은 monorepo형 앱 패키지 구조는 지금 도입하지 않는다. 현재 저장소는
단일 Next.js 앱이며, 여러 앱을 운영해야 할 때 별도 ADR로 전환한다.

## 결과

- 저장소 루트에서 앱 진입점, 도메인, 조합, 인프라, 콘텐츠 경계가 모두 보인다.
- `src/`라는 빈 중간 계층이 사라져 새 기여자가 코드를 어디에 둬야 하는지 덜
  헷갈린다.
- Next.js의 표준 `app/` 탐색 경로를 그대로 사용한다.
- `vitest`와 `tailwind` 탐색 범위는 `app/**`와 최상위 모듈 기준으로 갱신한다.
- 향후 여러 앱이 생기면 `apps/web`로 옮기는 변경은 별도 구조 결정이 된다.

## 검토한 대안

- `src/app/` 유지: Next.js 표준 중 하나지만 현재는 `src/`에 다른 책임이 없어
  중간 디렉터리의 의미가 약하다.
- `apps/web/app/` 도입: 블로그 시스템 템플릿이나 monorepo에는 자연스럽지만,
  현재 단일 앱 저장소에는 과한 패키지 계층을 만든다.
- 모든 도메인을 `apps/web/**` 아래로 이동: 앱과 콘텐츠 분리는 명확해지지만,
  ADR 0011에서 의도한 최상위 도메인 경계가 다시 앱 패키지 내부로 숨는다.

## 관련 히스토리

- `docs/adr/0011-adopt-frontend-modular-monolith.md`: 최상위 도메인 모듈 구조를
  도입한 결정. 이 ADR은 그 구조에서 route adapter 위치만 구체화한다.
