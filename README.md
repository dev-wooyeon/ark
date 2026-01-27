<div align="center">

# ✨ Eunu.log

**Interactive Tech Blog with 3D Particle Animations**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r150+-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*기술 콘텐츠와 인터랙티브 3D 애니메이션이 만나는 곳*

[Live Demo](https://eunu.log) · [Features](#-features) · [Getting Started](#-getting-started)

</div>

---

## 🎯 Overview

**Eunu.log**는 뇌 과학 기반의 상호작용 애니메이션을 통해 **높은 기억력과 재방문율**을 목표로 하는 모던 기술 블로그입니다.

신문에서 영감을 받은 클래식한 디자인(베이지 + 클래식 블루)과 Three.js 기반의 파티클 애니메이션이 결합되어 독특한 사용자 경험을 제공합니다.

<br />

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **3D Particle Text** | 마우스 인터랙션에 반응하는 텍스트 파티클 애니메이션 |
| 🌐 **Interactive Sphere** | 마우스를 따라가는 3D 구체 히어로 씬 |
| 📰 **Newspaper Design** | 베이지 + 클래식 블루의 프리미엄 컬러 시스템 |
| 🌙 **Dark Mode** | 시스템 설정에 따른 자동 테마 전환 |
| 📖 **Smart TOC** | 스크롤에 따라 현재 섹션을 하이라이트하는 목차 |
| ⚡ **60fps Animation** | 최적화된 애니메이션 성능 |
| 📱 **Responsive** | 모든 디바이스에서 완벽한 반응형 디자인 |

<br />

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 14+
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 18+
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
<img src="https://skillicons.dev/icons?i=css" width="48" height="48" alt="CSS" />
<br>CSS Modules
</td>
</tr>
</table>

**Core:**
- **Framework:** Next.js 14+ (App Router, SSG)
- **Language:** TypeScript (Strict Mode)
- **Styling:** CSS Modules + CSS Variables

**Animation:**
- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **Motion:** Framer Motion

**Content:**
- **Format:** Markdown + gray-matter
- **Processing:** remark + rehype + syntax highlighting

<br />

## 📂 Project Structure

```
eunu.log/
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 feeds/           # Blog feed pages
│   │   └── 📁 resume/          # Resume page
│   ├── 📁 components/
│   │   ├── 📁 animations/      # Three.js components
│   │   │   ├── HeroScene.tsx       # 3D sphere animation
│   │   │   └── TextParticleScene.tsx  # Particle text effect
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── TableOfContents.tsx # Interactive TOC
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

### Development

```bash
# Start development server
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### Build

```bash
# Create production build
npm run build

# Start production server
npm run start
```

<br />

## 🎨 Design System

### Color Palette

| Mode | Background | Text | Accent |
|------|------------|------|--------|
| ☀️ Light | `#EAEBEA` Newspaper Beige | `#1A1A1A` Soft Black | `#0066CC` Classic Blue |
| 🌙 Dark | `#1A1A1A` Deep Gray | `#F5F5F5` Off White | `#4A9EFF` Bright Blue |

### Typography

- **Font Family:** Geist Sans & Geist Mono
- **Scale:** 12px ~ 48px (design tokens)

<br />

## 📈 Performance

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| Animation | 60fps | ✅ |

<br />

## 📝 Writing a Post

1. `/content` 디렉토리에 slug 이름으로 폴더 생성 (예: `2025-01-20-my-post`)
2. 폴더 내에 `meta.json` 파일 생성:

```json
{
  "title": "포스트 제목",
  "description": "간단한 설명",
  "date": "2025-01-20",
  "category": "Dev",
  "tags": ["Tag1", "Tag2"]
}
```

3. 폴더 내에 `index.mdx` 파일 생성하고 Markdown으로 내용 작성
4. 자동으로 피드 목록에 표시됨

<br />

## 🗺 Roadmap

- [x] Next.js 14+ App Router 설정
- [x] Three.js 파티클 텍스트 애니메이션
- [x] 3D 히어로 씬
- [x] 마크다운 피드 시스템
- [x] 다크모드 지원
- [x] 반응형 목차 (TOC)
- [ ] 검색 기능
- [ ] 댓글 시스템
- [ ] RSS 피드
- [ ] i18n 지원

<br />

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ Back to Top](#-eunulog)**

Made with ❤️ by [dev-wooyeon](https://github.com/dev-wooyeon)

</div>
