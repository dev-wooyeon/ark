# Repository Guidelines

## 항상 지킬 규칙

- 변경은 작업 범위에 맞게 최소화한다. 관련 없는 파일은 수정하지 않는다.
- 현재 MDX 파이프라인을 보존한다. MDX는 `next.config.mjs`의 `@mdx-js/loader`
  기반 커스텀 webpack rule에 남겨둔다. 전체 콘텐츠 파이프라인을 의도적으로
  마이그레이션하지 않는 한 Next.js 내장 MDX로 바꾸지 않는다.
- 시각화 중심 UI는 `blog/ui/visualization/`에 둔다. 블로그 MDX가 재사용하는
  시각화 컴포넌트는 블로그 콘텐츠 렌더링 책임으로 관리한다.
- `any`를 사용하지 않는다. 구체 타입을 쓰거나 `unknown`과 narrowing을
  사용한다.
- `p-[13px]` 같은 arbitrary Tailwind value를 사용하지 않는다. 표준 utility,
  ui token, 기존 스타일 패턴을 사용한다.
- DDD의 전략적 설계 개념을 차용한 domain-first modular monolith 구조를
  유지한다. `app/`은 Next.js route adapter로 제한하고, 주요 도메인은
  저장소 최상위 모듈로 분리한다.
- `src/` 디렉터리를 재도입하지 않는다. 새 코드 경계는 `app/`, 도메인 모듈,
  `site/`, `infra/`, `ui/`, `styles/` 중 하나에 둔다.
- 블로그 콘텐츠 구조는 `posts/**/index.mdx`와 주변 `meta.json`으로 유지한다.
  중첩된 series 디렉터리도 보존한다.
- 변경이 아래 ADR 작성 조건에 걸리면 반드시 ADR을 작성하거나 갱신한다.

## ADR 작성 조건

아래 조건 중 하나라도 해당하면 `docs/adr/`에 ADR을 작성하거나 갱신한다.

- 선택지가 2개 이상이고 트레이드오프가 존재한 경우.
- 반복적으로 따라야 할 규칙이나 경계를 정의한 경우.
- 테스트 전략이나 검증 방식이 결정의 핵심이었던 경우.

ADR 작성 기준:

- `docs/adr/` 아래에 번호가 붙은 파일을 만들고 `docs/adr/README.md`를
  갱신한다.
- 배경, 결정, 결과, 검토한 대안, 가능하면 관련 커밋 히스토리를 기록한다.
- 과거를 지우기 위해 기존 ADR을 고쳐 쓰지 않는다. 이전 결정을 대체하는 새
  ADR을 작성한다.
- ADR은 AI 협업 노트와 분리한다. ADR은 누가 초안을 작성했는지와 무관하게
  엔지니어링 결정을 기록하는 문서다.

## 프로젝트 구조

- `app/`: Next.js App Router route adapter, route handler, metadata entry
- `blog/`: 글 도메인. post schema, repository, publication policy, series,
  blog UI, RSS feed serialization, view-count use case
- `resume/`: 이력서 도메인. resume data, ordering, resume UI
- `search/`: 검색 도메인. command palette, search action, recommendation
- `site/`: 도메인 조합 layer. home, AppShell, navigation, provider, site config
- `infra/`: 외부/런타임 인프라. Supabase, Umami analytics, SEO helper,
  integration adapter
- `ui/`: 도메인 지식 없는 UI primitive, layout primitive, motion helper
- `styles/`: design token과 global style
- `posts/`: 중첩 가능한 `index.mdx`와 `meta.json` 기반 블로그 콘텐츠
- `tests/`: Playwright E2E 테스트와 Vitest support helper
- `tooling/`: script와 tool configuration

## 개발 명령

- `npm run dev`: webpack 기반 로컬 개발 서버 실행
- `npm run build`: production build 생성
- `npm run lint`: source file ESLint 실행
- `npm run lint:css:syntax`: CSS syntax rule 검사
- `npm run verify:docs`: ADR과 핵심 문서 하네스 검사
- `npm run test:unit`: Vitest unit test 실행
- `npm run test:components`: component 중심 Vitest test 실행
- `npm run test:e2e`: Playwright scenario 실행
- `npm run test:ci`: 주요 CI-equivalent validation set 실행

## 스타일과 테스트

TypeScript를 사용하고 2-space indentation, semicolon, single quote, trailing
comma(`es5`), 80-column width를 따른다. Prettier가 이를 강제한다. Component는
`PascalCase`, hook은 `use` prefix가 붙은 `camelCase`, test는 `*.test.ts`
또는 `*.test.tsx`로 작성한다. Logic, UI behavior, parser, app action을 바꿀
때는 대상 Vitest 또는 Playwright coverage를 추가한다. PR 전에는
`npm run build`와 변경에 가장 관련 있는 test command를 실행한다.

## AI 작업 운영

- AI가 제안했더라도 이 저장소의 구조, ADR, 테스트 규칙을 우선한다.
- 사용자나 다른 작업자가 만든 변경을 명시 요청 없이 되돌리지 않는다.
- 작업 전 관련 문서와 현재 구현을 먼저 확인하고, 추측으로 구조를 바꾸지
  않는다.
- 작업 후 변경 내용, 이유, 검증 방법을 짧게 요약한다.
- 반복되는 AI 작업 절차는 새 중복 가이드보다 `AGENTS.md`, ADR, 실행 계획,
  또는 기존 guide 중 가장 직접적인 문서에 흡수한다.

## 커밋과 PR

커밋 메시지는 `type(scope): concise description` 형식을 사용한다. 예:
`fix(home): preview 배포 타입 오류 수정`. 주로 쓰는 type은 `feat`, `fix`,
`refactor`, `test`, `chore`다. Branch name은 `codex/<task>` 형태를 사용한다.
`.github/pull_request_template.md`를 따르고 관련 issue나 PR을 연결한다. UI 변경이
보이면 screenshot을 포함한다. Layout이나 navigation이 바뀌면 mobile/desktop,
dark/light 동작을 확인한다.
