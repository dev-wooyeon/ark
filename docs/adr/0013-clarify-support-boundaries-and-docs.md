# 0013. 지원 모듈, 유지 문서, 공개 route 경계를 명확히 한다

Date: 2026-05-08
Status: Accepted

## 배경

ADR 0011과 ADR 0012로 주요 도메인과 Next route adapter는 최상위에 드러났다.
하지만 `platform/`, `shared/`, `docs/`, `tooling/scripts/`에는 아직 의미가
넓거나 사용 여부가 불명확한 항목이 남아 있었다.

팀 단위 유지보수에서는 이름만 보고 소유권과 생명주기를 예측할 수 있어야 한다.
`platform`은 제품 플랫폼 도메인처럼 읽힐 수 있지만 실제로는 Supabase, Umami,
SEO 같은 외부 런타임 연동을 담고 있었다. `shared`는 바운디드 컨텍스트가 아니라
공용 덤프가 되기 쉬운 이름이었다. 문서와 스크립트도 글 작성/검증 파이프라인에
직접 쓰이지 않는다면 다음 기여자에게 맥락 비용을 만든다.

추가로 `app/` 아래 route handler는 프레임워크가 찾는 진입점이지만, 실제 기능
책임까지 같이 들어가면 도메인 경계가 다시 흐려진다. RSS는 `feed.xml` 이름으로
제공되고 있어 구현이 RSS인지 탐색하기 어려웠고, OG image route는 `app/api/og`
아래에 남아 있어 삭제 가능 여부를 별도로 판단해야 했다.

## 결정

- 루트 디렉터리는 바운디드 컨텍스트와 지원 영역을 함께 드러낸다.
  - 바운디드 컨텍스트: `blog/`, `resume/`, `search/`
  - route adapter: `app/`
  - 사이트 조합 layer: `site/`
  - 외부 연동 adapter: `infra/`
  - 도메인 없는 UI primitive: `ui/`
  - 콘텐츠 저장소: `posts/`
  - 검증과 자동화: `tests/`, `tooling/`
- `site/`는 infra가 아니다. home, AppShell, navigation, provider 조합,
  site metadata처럼 여러 도메인과 adapter를 하나의 웹사이트로 조립하는
  composition layer로 둔다.
- `app/`은 Next.js route adapter로 제한한다. URL, metadata, request/response
  진입점만 맡고, 도메인 정책과 직렬화 로직은 외부 모듈에 위임한다.
- 빈 `app/components/**` 계층은 제거한다. `app` 아래에 프레임워크 진입점이
  아닌 코드 배치 공간을 만들지 않는다.
- `platform/`은 `infra/`로 이름을 바꾼다.
  - `infra`는 `ui`처럼 통용되는 짧은 약어라 루트 이름으로 사용한다.
- `shared/`는 제거하고 책임별로 나눈다.
  - 도메인 없는 UI primitive, layout primitive, motion helper는 `ui/`에 둔다.
  - 블로그 MDX 시각화 컴포넌트는 `blog/ui/visualization/`에 둔다.
  - Vitest support helper는 `tests/support/`에 둔다.
- Agentation overlay, route handler, dev script, dependency, guide는 제거한다.
- OG 이미지는 `next/og`의 `ImageResponse`를 사용한다. 직접 import하지 않는
  `@vercel/og` dependency는 제거한다. `app/api/og`는 글 상세 metadata와
  JSON-LD가 참조하므로 유지한다.
- Next.js 내장 MDX adapter인 `@next/mdx`는 사용하지 않으므로 제거한다. MDX는
  ADR 0002에 따라 `next.config.mjs`의 `@mdx-js/loader` 기반 custom webpack
  pipeline으로 유지한다.
- RSS는 구현 포맷이 드러나도록 canonical route를 `/rss.xml`로 둔다.
  - route adapter: `app/rss.xml/route.ts`
  - RSS XML 직렬화: `blog/services/rss-feed.ts`
  - legacy `/feed.xml` route는 유지하지 않는다. 현재 구독자 호환 요구가 없고,
    남겨두면 다시 탐색 비용을 만든다.
- `tooling/scripts`에는 현재 글 작성/퇴고/검증 파이프라인에서 쓰는 스크립트만
  남긴다.
  - 유지: `new-post`, `content:audit`, `localize:images`, CSS/doc 검증
  - 제거: Agentation dev server, 일회성 research corpus generation
- `docs/`는 계속 갱신될 문서만 남긴다.
  - 유지: ADR, 글 품질 가이드, DB 스키마/SQL, 테스트 가이드
  - 제거: 오래된 실행 계획, research dump, archive dump, product/design 초안,
    Agentation guide, 중복 PR workflow
- `ARCHITECTURE.md`는 삭제한다. 사람에게는 `README.md`와 `docs/adr/**`를,
  AI 작업자에게는 `AGENTS.md`를 기준 문서로 둔다.

## 결과

- 지원 모듈 이름이 실제 책임에 가까워진다.
- `shared`라는 모호한 루트 경계가 사라진다.
- `app/`이 다시 일반 코드 배치 공간처럼 쓰일 가능성이 줄어든다.
- Agentation은 더 이상 런타임, 개발 서버, 의존성에 남지 않는다.
- 글별 OG image는 유지되지만, 미사용 OG dependency는 사라진다.
- RSS 기능은 `/rss.xml`과 `blog/services/rss-feed.ts`에서 더 직접적으로
  발견된다.
- `/feed.xml`은 더 이상 제공하지 않는다. 호환성보다 구조 단순성과 탐색성을
  우선한다.
- 문서 수가 줄고, 유지해야 하는 문서의 기준이 `docs/README.md`에 명시된다.
- 일회성 research 산출물을 다시 추가하려면 유지 주체와 사용 경로를 먼저
  설명해야 한다.

## 검토한 대안

- `site/`를 infra로 취급: provider 조합과 navigation, home은 외부 시스템 연동이
  아니라 웹사이트 composition 책임이므로 제외했다.
- `platform/` 유지: 이름은 짧지만 제품 플랫폼 도메인과 인프라 연동 책임이
  섞여 보인다.
- `shared/` 유지: import 경로는 적게 바뀌지만 공용 덤프가 되기 쉽고, 바운디드
  컨텍스트 기준 점검에 실패한다.
- `app/api/og` 제거: 단순해지지만 글 상세 OpenGraph image와 JSON-LD image가
  깨진다. 동적 OG 이미지는 공유 품질에 영향을 주므로 유지한다.
- `/feed.xml` redirect 유지: 기존 구독자를 보호할 수 있지만 현재 호환 요구가
  없고, `feed`와 `rss` 이름이 공존해 다시 혼란을 만든다.
- 문서를 archive로 이동: 삭제보다 안전하지만, 유지되지 않는 문서를 계속
  탐색하게 만드는 비용이 남는다.
- Agentation을 feature flag로 보존: 더 이상 사용하지 않는 도구라면 dependency와
  route surface를 유지할 이유가 없다.
