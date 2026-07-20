<div align="center">

# Ark

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

아크는 오래 건너갈 생각들을 싣는 개인의 방주입니다.

[https://ark-log.vercel.app](https://ark-log.vercel.app)

</div>

## 🛠 기술 스택

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="CSS" />
<br>Tailwind
</td>
</tr>
</table>

**코어 스택:**

- **프레임워크:** Next.js 16+ (App Router, SSG/SSR)
- **언어:** TypeScript (Strict Mode)
- **스타일링:** Tailwind CSS + CSS Variables (필요한 영역에만 CSS Modules 사용)

**애니메이션:**

- **모션:** Framer Motion

**콘텐츠 처리:**

- **포맷:** MDX + `meta.json` (폴더 기반 콘텐츠 구조)
- **파이프라인:** `@mdx-js/loader` + remark/rehype + syntax highlighting

<br />

## 🏗 시스템 아키텍처

현재 운영 기준 아키텍처는 아래와 같습니다.

![flow](/public/flow.png)

핵심 포인트:

- 블로그 앱(`아크`)과 분석 대시보드(`Umami`)는 각각 Vercel에 분리 배포합니다.
- 블로그 코드에서는 `NEXT_PUBLIC_UMAMI_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`만 설정하면 Umami 스크립트가 자동 로드됩니다.
- Umami 커스텀 이벤트는 스크립트 초기화 전 큐에 적재되고, 로드 완료 후 자동으로 flush됩니다.

<br />

## 📂 프로젝트 구조

```text
ark/
├── 📁 app/                     # Next.js route adapter
├── 📁 blog/                    # 글 도메인
├── 📁 resume/                  # 이력서 도메인
├── 📁 site/                    # 홈, AppShell, provider, site config
├── 📁 infra/                   # Supabase, Umami, SEO integration
├── 📁 ui/                      # 도메인 지식 없는 UI/레이아웃/모션
├── 📁 styles/                  # 전역 스타일과 토큰
├── 📁 tests/
│   ├── 📁 e2e/                 # Playwright E2E 테스트
│   └── 📁 support/             # Vitest support helper
├── 📁 tooling/
│   ├── 📁 config/              # lint/spell 설정
│   └── 📁 scripts/             # 자동화/유틸 스크립트
├── 📁 posts/                   # 블로그 글(MDX + 메타데이터)
│   └── 📁 [slug]/              # 글 단위 폴더
│       ├── index.mdx           # 글 본문
│       └── meta.json           # 글 메타데이터
├── 📁 public/                  # 정적 에셋
└── 📁 docs/                    # 문서
```
