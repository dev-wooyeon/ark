# eunu.log

[라이브 데모](https://eunu-log.vercel.app)

`eunu.log`는 장문 기술 글과 실무 회고를 다루는 Next.js 기반 개인 블로그다.
MDX 콘텐츠 파이프라인, 시리즈형 글 구조, 분석 이벤트 추적, 이력서와
검색 경험까지 한 저장소에서 관리한다.

## 핵심 구성

- **런타임:** Next.js App Router, React 19, TypeScript strict mode
- **콘텐츠:** `posts/**/index.mdx + meta.json`, 커스텀 webpack MDX 로더
- **UI:** Tailwind CSS, CSS variables, 필요한 구간만 CSS Modules 사용
- **시각화:** Three.js, `@react-three/fiber`, `@react-three/drei`,
  Framer Motion
- **품질:** ESLint, Prettier, Vitest, Playwright
- **데이터/분석:** Supabase 기반 조회수 집계, Umami 이벤트 추적

## 개발 시작

```bash
npm install
npm run dev
```

기본 개발 서버는 `internal/scripts/dev-with-agentation.mjs`를 통해 실행된다.
순수 Next.js 개발 서버가 필요하면 `npm run dev:next`를 사용한다.

## 자주 쓰는 명령어

```bash
npm run dev
npm run dev:next
npm run build
npm run lint
npm run lint:css:syntax
npm run test:unit
npm run test:components
npm run test:e2e
```

## 콘텐츠 모델

블로그 글은 폴더 단위로 관리한다.
중첩 디렉터리를 지원하므로 시리즈 글도 같은 규칙으로 다룬다.

```text
posts/
├── 어떤-글/
│   ├── index.mdx
│   └── meta.json
└── 시리즈/
    └── 에피소드/
        ├── index.mdx
        └── meta.json
```

- 메타데이터 스키마: `src/domains/post/model/frontmatter-schema.ts`
- 콘텐츠 로더: `src/features/blog/services/post-repository.ts`
- MDX 파이프라인: `next.config.mjs`

## 프로젝트 구조

```text
src/
├── app/                     # App Router 엔트리
├── core/                    # 전역 설정과 provider 조합
├── domains/                 # 도메인 계약, 타입, 스키마
├── features/                # blog, home, resume, search
├── shared/                  # analytics, layout, seo, ui, testing
├── components/visualization/# 시각화 전용 컴포넌트
└── styles/                  # 글로벌 스타일과 디자인 토큰

internal/
├── config/                  # lint, spell, markdown 설정
└── scripts/                 # 개발/콘텐츠 자동화 스크립트

tests/e2e/                   # Playwright 시나리오
docs/                        # 설계, 운영, 품질 문서
```

## 문서

- 저장소 개요와 아키텍처: `ARCHITECTURE.md`
- 문서 인덱스: `docs/README.md`
- 프런트엔드 기준: `docs/FRONTEND.md`
- 디자인 기준: `docs/DESIGN.md`
- 블로그 품질 기준: `docs/blog-quality-guide.md`

## 작업 원칙

- 콘텐츠 구조는 `posts/**/index.mdx + meta.json` 형태를 유지한다.
- MDX는 `next.config.mjs`의 커스텀 webpack 규칙을 유지한다.
- 시각화가 무거운 UI는 `src/components/visualization/`에 둔다.
- `any`와 임의 Tailwind 값은 추가하지 않는다.
