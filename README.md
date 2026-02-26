<div align="center">

# ✨ Eunu.log

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r150+-black?style=flat-square&logo=three.js)](https://threejs.org/)

개인 블로그입니다!

[Live Demo](https://eunu-log.vercel.app)

</div>

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 16+
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 19+
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript 5.0+
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=threejs" width="48" height="48" alt="Three.js" />
<br>Three.js
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="CSS" />
<br>Tailwind CSS
</td>
</tr>
</table>

**Core:**

- **Framework:** Next.js 16+ (App Router, SSG/SSR)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + CSS Variables (with selective CSS Modules)

**Animation:**

- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **Motion:** Framer Motion

**Content:**

- **Format:** MDX + `meta.json` (folder-based content)
- **Processing:** `@mdx-js/loader` + remark/rehype + syntax highlighting

<br />

## 📂 Project Structure

```
eunu.log/
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router pages/routes
│   │   ├── 📁 blog/            # Blog list/detail routes
│   │   ├── 📁 resume/          # Resume page
│   │   ├── 📁 series/          # Series index page
│   │   └── 📁 api/og/          # OG image route
│   ├── 📁 components/
│   │   ├── 📁 blog/            # Post UI (TOC, comments, cards)
│   │   ├── 📁 layout/          # Header, Footer, Container
│   │   ├── 📁 ui/              # Reusable primitives
│   │   └── 📁 visualization/   # Interactive algorithm visualizations
│   ├── 📁 lib/                 # Utilities
│   ├── 📁 styles/              # Global styles & variables
│   └── 📁 types/               # TypeScript definitions
├── 📁 content/                  # Blog posts (MDX + metadata)
│   └── 📁 [slug]/              # Each post in its own folder
│       ├── index.mdx           # Post content
│       └── meta.json           # Post metadata
├── 📁 public/                  # Static assets
└── 📁 docs/                    # Documentation
```

<br />

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-wooyeon/eunu.log.git

# Navigate to the project
cd eunu.log

# Install dependencies
npm install
```

### Supabase Setup (View Count)

```bash
cp .env.example .env.local
```

`.env.local`에 아래 값을 채워주세요.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Supabase SQL Editor에서 `docs/supabase-view-count.sql`을 실행하면
조회수 집계를 위한 테이블/정책/함수가 생성됩니다.

### Development

```bash
# Start development server
npm run dev  # alias: npm run serve
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### Environment Variables

GA4를 사용하려면 `.env.local`에 아래 값을 추가하세요.

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Ops Docs

- PR 운영 가이드: `docs/pr-workflow.md`
- UI 컴포넌트 가이드: `docs/ui-components-guide.md`
- GA4 이벤트 스키마: `docs/analytics-ga4-schema.md`
- 주간 KPI 리포트 템플릿: `docs/analytics-kpi-weekly-template.md`

<br />

## 🎨 Design System

### Color Palette

| Mode     | Background                | Text                 | Accent                 |
| -------- | ------------------------- | -------------------- | ---------------------- |
| ☀️ Light | `#EAEBEA` Newspaper Beige | `#1A1A1A` Soft Black | `#0066CC` Classic Blue |

### Typography

- **Font Family:** Pretendard (Base), JetBrains Mono (Code/Mono), TossFace (Emoji)
- **Scale:** Minor Third Scale (TDS Standard)

<br />

## ✨ Key Features (New)

- **TDS Integration**: Applied Toss Design System tokens (Colors, Spacing, Typography).
- **Interactive Scroll Hint**: Clickable arrow button with smooth scrolling.
- **Glassmorphism**: "True Black Glass" effect on navigation elements.
- **Layout Stability**: "Invisible Reservation" pattern to prevent layout shifts during typing effects.

## 📈 Performance

| Metric    | Target  | Status |
| --------- | ------- | ------ |
| LCP       | < 2.5s  | ✅     |
| FID       | < 100ms | ✅     |
| CLS       | < 0.1   | ✅     |
| Animation | 60fps   | ✅     |

<br />

## 📝 Writing a Post

1. `/content` 디렉토리에 slug 이름으로 폴더 생성 (예: `2025-01-20-my-post`)
2. 폴더 내에 `meta.json` 파일 생성:

```json
{
  "title": "포스트 제목",
  "slug": "2025-01-20-my-post",
  "description": "간단한 설명",
  "date": "2025-01-20",
  "category": "Dev",
  "tags": ["Tag1", "Tag2"]
}
```

3. 폴더 내에 `index.mdx` 파일 생성하고 Markdown으로 내용 작성
4. 자동으로 피드 목록에 표시됨

<br />

---

<div align="center">

**[⬆ Back to Top](#-eunulog)**

</div>
