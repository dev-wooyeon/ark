<div align="center">

# eunu.log

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

개인 블로그입니다.

[라이브 데모](https://eunu-log.vercel.app)

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
<img src="https://skillicons.dev/icons?i=threejs" width="48" height="48" alt="Three.js" />
<br>Three.js
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

- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **모션:** Framer Motion

**콘텐츠 처리:**

- **포맷:** MDX + `meta.json` (폴더 기반 콘텐츠 구조)
- **파이프라인:** `@mdx-js/loader` + remark/rehype + syntax highlighting

<br />

## 🏗 시스템 아키텍처

현재 운영 기준 아키텍처는 아래와 같습니다.

![flow](/public/flow.png)

핵심 포인트:

- 블로그 앱(`eunu.log`)과 분석 대시보드(`Umami`)는 각각 Vercel에 분리 배포합니다.
- 블로그 코드에서는 `NEXT_PUBLIC_UMAMI_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`만 설정하면 Umami 스크립트가 자동 로드됩니다.
- Umami 커스텀 이벤트는 스크립트 초기화 전 큐에 적재되고, 로드 완료 후 자동으로 flush됩니다.

<br />

## 📂 프로젝트 구조

```text
eunu.log/
├── 📁 src/
│   ├── 📁 app/                 # 라우트 엔트리 전용 (Next App Router)
│   ├── 📁 core/                # 앱 전역 설정/프로바이더 조합
│   ├── 📁 domains/             # 도메인 계약/타입/스키마
│   ├── 📁 features/            # 기능 모듈(ui/model/services)
│   │   ├── 📁 blog/
│   │   ├── 📁 resume/
│   │   ├── 📁 search/
│   │   └── 📁 home/
│   ├── 📁 shared/              # 공용 모듈(analytics/integrations/layout/seo/testing/ui/types)
│   ├── 📁 components/
│   │   └── 📁 visualization/   # 인터랙티브 알고리즘 시각화 전용
│   └── 📁 styles/              # 전역 스타일과 토큰
├── 📁 tests/
│   └── 📁 e2e/                 # Playwright E2E 테스트
├── 📁 internal/
│   ├── 📁 config/              # 내부 lint/spell 설정
│   └── 📁 scripts/             # 내부 자동화/유틸 스크립트
├── 📁 posts/                   # 블로그 글(MDX + 메타데이터)
│   └── 📁 [slug]/              # 글 단위 폴더
│       ├── index.mdx           # 글 본문
│       └── meta.json           # 글 메타데이터
├── 📁 public/                  # 정적 에셋
└── 📁 docs/                    # 문서
```