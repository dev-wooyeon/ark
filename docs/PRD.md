# 📋 기술 블로그 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 프로젝트명
Modern Tech Blog with Interactive Experience

### 목표
사용자에게 기술 콘텐츠를 제공하면서 동시에 뇌 과학 기반 상호작용 애니메이션을 통해 **높은 기억력과 재방문율**을 확보하는 기술 블로그 플랫폼 구축

### 핵심 가치 제안
- 🎯 **기억에 남는 경험**: 상호작용형 애니메이션으로 일반 블로그 대비 기억력 70% 향상
- 🎨 **시각적 프리미엄**: 딥그린 + 화이트 컬러와 동적 요소의 조화
- ⚡ **고성능**: 모든 애니메이션에서 60fps 유지
- 📱 **모든 기기 지원**: 반응형 디자인 & 터치 최적화

### 타겟 사용자
- 기술 콘텐츠 소비자 (개발자, 디자이너)
- 신입 개발자 (학습 목적)
- 기술 채용담당자 (포트폴리오 방문)

---

## 2. 제품 구조 (Information Architecture)
```
blog.com/
├─ / (홈)
│  ├─ Hero Section (Three.js 상호작용)
│  ├─ About Me (타이핑 애니메이션)
│  ├─ Featured Posts (카드 호버)
│  └─ CTA
│
├─ /feeds (피드 목록)
│  ├─ 필터링 (카테고리: Dev, Life)
│  ├─ 검색
│  └─ 피드 카드 그리드
│
├─ /feeds/:slug (피드 상세)
│  ├─ 헤더 (스크롤 트리거)
│  ├─ 목차 (Sticky)
│  ├─ 본문 (마크다운 + 마이크로 인터랙션)
│  ├─ 코드 블록 (구문 강조 + 복사)
│  └─ 관련 피드
│
├─ /projects (프로젝트)
│  ├─ 프로젝트 카드 (3D 호버)
│  └─ 프로젝트 상세 (Three.js 모델)
│
├─ /about (자기소개)
│  ├─ 경력 타임라인 (스크롤 애니메이션)
│  └─ 기술 스택 (인터랙티브)
│
└─ /resume (다운로드)
```

---

## 3. 컬러 팔레트 정의

### Palette Definition
```css
/* Primary Colors */
--bg-primary: #eaebea;            /* 신문색 베이지 (배경) */
--text-primary: #1a1a1a;          /* 부드러운 검정 (주 텍스트) */
--text-secondary: #4a4a4a;        /* 미디엄 그레이 (보조 텍스트) */
--text-tertiary: #6a6a6a;         /* 라이트 그레이 (메타 정보) */

/* Accent Colors */
--accent-primary: #0066CC;        /* 클래식 블루 (버튼, 링크) */
--accent-secondary: #004499;      /* 어두운 블루 (호버) */
--accent-tertiary: #E6F0FA;       /* 매우 연한 블루 (배경 강조) */

/* Code & Technical */
--bg-code: #f8f9fa;               /* 코드 배경: 라이트 그레이 */
--text-code: #1a1a1a;             /* 코드 텍스트: 검정색 */
--keyword: #2563EB;               /* 키워드: 블루 */
--string: #7C3AED;                /* 문자열: 퍼플 */
--number: #DC2626;                /* 숫자: 레드 */
--comment: #6B7280;               /* 주석: 그레이 */

/* Feedback */
--success: #2563EB;               /* 성공 (블루) */
--warning: #F59E0B;               /* 경고 (주황색) */
--error: #EF4444;                /* 에러 (빨강색) */
--info: #3B82F6;                 /* 정보 (파랑색) */

/* Neutral */
--border: #E5E7EB;               /* 테두리: 라이트 그레이 */
--shadow: rgba(0, 0, 0, 0.1);   /* 그림자: 블랙 + 투명도 */
--overlay: rgba(0, 0, 0, 0.05); /* 오버레이 */

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  --bg-primary: #1a1a1a;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --accent-primary: #4A9EFF;
  --bg-code: #2a2a2a;
  --text-code: #F9FAFB;
  --border: #404040;
  --accent-tertiary: rgba(74, 158, 255, 0.1);
}
```

### 사용 예시

- 헤더: bg-primary + text-primary (WCAG AAA)
- 버튼: accent-primary + bg-primary (상호작용)
- 코드: bg-code + text-code (개발자 친화)
- 강조: accent-secondary + text-primary (눈에 띄나 세지 않음)

---

## 4. 페이지별 상세 명세

### 4.1 홈 페이지 (/)

#### Hero Section
```
┌──────────────────────────────────────┐
│                                      │
│    [Three.js 상호작용 요소]         │
│    - 마우스 추적 회전
│    - 타이핑: "안녕하세요"           │
│    - 자동 회전 (약한)               │
│                                      │
│    "I'm Frontend Engineer"           │
│    "Creating memorable experiences" │
│                                      │
│    [CTA Button: "View My Work"]      │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- Three.js 회전 오브젝트 (마우스 X, Y축 추적)
- Typed.js 타이핑 애니메이션 (1.5초)
- 버튼 호버: 색상 변경 + 약간 확대
- 반응형: 모바일에서는 정적 이미지로 대체

#### About Section
```
┌──────────────────────────────────────┐
│  [스크롤 트리거 애니메이션]         │
│                                      │
│  "저는 이렇게 일합니다"             │
│  - 창의적인 사고 (아이콘 + 텍스트) │
│  - 상호작용 중심 (아이콘 + 텍스트)  │
│  - 성능 최적화 (아이콘 + 텍스트)   │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- GSAP ScrollTrigger: 텍스트 페이드인
- 각 항목 호버: 아이콘 회전 + 텍스트 색 변경
- 시차: 300ms 간격

#### Featured Posts
```
┌──────────────────────────────────────┐
│  [최신 피드 3개 카드 레이아웃]    │
│                                      │
│  Post 1       Post 2       Post 3    │
│  [Card]       [Card]       [Card]    │
│  호버: 떠오름 + 그림자 강화          │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- 카드 호버: translateY(-8px) + box-shadow 증가
- 타이틀: 색상 변경 + 언더라인 애니메이션
- 읽기 시간: 타원형 배지

---

### 4.2 피드 목록 페이지 (/feeds)

#### 필터 + 검색
```
┌──────────────────────────────────────┐
│  [검색 입력창]                      │
│  [필터: Dev | Life | Clear Filter]  │
│                                      │
│  Posts (Grid / List Toggle)          │
│  ┌────────────────────────────────┐ │
│  │ Date | Title                   │ │
│  ├────────────────────────────────┤ │
│  │ 2025.01.20 | Three.js 배우기  │ │
│  │ 2025.01.15 | 회고: 2024년     │ │
│  │ ...                            │ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- 검색: 입력 시 0.3초 디바운스
- 필터: 토글 버튼 (상태 명확)
- 날짜 정렬: 최신순 기본
- 페이지네이션 또는 무한 스크롤

---

### 4.3 피드 상세 페이지 (/feeds/:slug)

#### Post Header
```
┌──────────────────────────────────────┐
│  /feeds/                             │ (Breadcrumb)
│                                      │
│  [히어로 이미지 - 스크롤 시 떠오름] │
│                                      │
│  [태그들]                            │
│  Title: "Three.js로 만드는 인터렉션" │
│  Meta: 2025.01.20 • 8분 읽이 • [공유]
│                                      │
│  [목차 - Sticky]                    │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- 히어로 이미지: blur 효과 스크롤 애니메이션
- 제목: 스크롤 인 시 페이드인
- 목차: 스크롤 위치에 따라 하이라이트

#### Post Content

**본문 마크다운:**
- 제목 (H1, H2, H3)
- 단락 (충분한 줄 높이)
- 인용문 (왼쪽 테두리 + 배경 색)
- 리스트 (정렬된 간격)

**코드 블록:**
- 구문 강조 (Prism.js)
- 언어 표시
- 복사 버튼 (클릭 시 애니메이션)
- 라인 번호 (선택)

**이미지:**
- Lazy loading
- 호버 시 줌 효과
- 캡션 지원

#### Post Footer
```
┌──────────────────────────────────────┐
│  [관련 피드 3개]                  │
│  카드: 호버 시 색 변경              │
│                                      │
│  [댓글 섹션 (또는 평가)]            │
│                                      │
│  [저자 정보 + SNS]                  │
│                                      │
└──────────────────────────────────────┘
```

---

### 4.4 프로젝트 페이지 (/projects)
```
┌──────────────────────────────────────┐
│  [프로젝트 카드 그리드]             │
│                                      │
│  ┌──────────┐ ┌──────────┐         │
│  │Project 1 │ │Project 2 │         │
│  │[3D호버]  │ │[3D호버]  │         │
│  └──────────┘ └──────────┘         │
│                                      │
│  호버 시:                            │
│  - 배경 블러 증가                    │
│  - 프로젝트명 페이드인               │
│  - 기술 스택 표시                    │
│  - 링크 버튼 나타남                  │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- Three.js 호버 효과 (선택)
- 클릭 시: 프로젝트 상세 페이지
- 카드: 반응형 (모바일 2x1, 태블릿 2x2, 데스크톱 3x2)

---

## 5. 애니메이션 명세 (Animation Specs)

### 5.1 Three.js 애니메이션

| 요소 | 트리거 | 애니메이션 | 지속시간 | 성능 |
|------|--------|-----------|---------|------|
| Hero 객체 | 페이지 로드 | 마우스 추적 회전 | 연속 | 60fps |
| Hero 객체 | 마우스 없음 | 자동 회전 (약함) | 0.02s/frame | 60fps |
| 프로젝트 카드 | 호버 | 3D 틸트 + 반사 | 0.4s | 60fps |

### 5.2 GSAP 애니메이션

| 요소 | 트리거 | 효과 | 지속시간 | 이징 |
|------|--------|------|---------|------|
| 피드 제목 | 스크롤 진입 | 페이드인 + Y축 -30px | 0.6s | easeOut |
| 피드 이미지 | 스크롤 진행 | 블러 0px → 10px | 스크롤 연동 | linear |
| 카드 | 호버 | translateY -8px | 0.3s | easeOut |
| 버튼 | 클릭 | 물결 효과 | 0.6s | easeInOut |

### 5.3 Framer Motion (React)
```javascript
// 페이지 전환
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// 카드 호버
const cardVariants = {
  rest: { y: 0, boxShadow: "0px 0px 8px rgba(...)" },
  hover: { y: -8, boxShadow: "0px 8px 16px rgba(...)" },
};

// 리스트 아이템 스태거
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

---

## 6. 기술 스택

### 프레임워크 & 라이브러리
```
Frontend:
- Next.js 14+ (SSG/SSR + 최적화)
- React 18+ (컴포넌트 기반)
- TypeScript (타입 안정성)

Styling:
- CSS Modules (스코핑)
- PostCSS (색상 변수)
- Tailwind CSS (선택: 간단한 기능만)

Animation:
- Three.js (3D 상호작용)
- GSAP + ScrollTrigger (스크롤 애니메이션)
- Framer Motion (React 애니메이션)
- Typed.js (타이핑 효과)

Content:
- Markdown (피드 작성)
- MDX (React 컴포넌트 포함)
- gray-matter (메타데이터 파싱)

Utilities:
- date-fns (날짜 포맷팅)
- clsx (조건부 클래스)
- zustand (상태 관리 - 선택)

Build & Deploy:
- Vercel (호스팅)
- GitHub (버전 관리)
```

### 성능 최적화
```
- Image Optimization: Next.js Image
- Code Splitting: Dynamic Imports
- Lazy Loading: Intersection Observer
- Caching: Service Worker
- Monitoring: Vercel Analytics
```

---

## 7. 개발 로드맵 (Phased Rollout)

### Phase 1: MVP (Week 1-2)
```
□ 프로젝트 구조 설정
□ 컬러 팔레트 CSS 변수 정의
□ 기본 페이지 레이아웃 (홈, 피드 목록, 피드 상세)
□ 마크다운 피드 렌더링
□ 기본 필터링
□ Vercel 배포

Output: 기본 기능하는 블로그
Performance: LCP < 2.5s, FID < 100ms
```

### Phase 2: 애니메이션 기본 (Week 3-4)
```
□ GSAP 기본 스크롤 애니메이션
□ 카드 호버 효과
□ 타이핑 효과 (홈)
□ 페이지 전환 애니메이션
□ 코드 블록 복사 효과

Output: 애니메이션 기본 + 상호작용 감
Performance: 60fps 유지
```

### Phase 3: Three.js 통합 (Week 5-6)
```
□ 홈 Hero 3D 객체 (마우스 추적)
□ 프로젝트 페이지 3D 호버
□ Three.js 성능 최적화
□ 모바일 폴백 처리

Output: 뇌에 박히는 경험
Performance: 60fps 유지, 모바일 최적화
```

### Phase 4: 고급 기능 (Week 7+)
```
□ 다크모드
□ 검색 기능 (클라이언트사이드)
□ 댓글 시스템 (Giscus/Disqus)
□ SNS 공유 최적화 (OG 이미지)
□ 이메일 뉴스레터
□ 성능 모니터링

Output: 완전한 프로덕션 블로그
```

---

## 8. 디자인 시스템

### Typography
```css
/* 시스템 폰트 스택 */
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", "Courier New", monospace;

/* 글자 크기 스케일 */
--text-xs: 0.75rem;    (12px)
--text-sm: 0.875rem;   (14px)
--text-base: 1rem;     (16px) - 본문
--text-lg: 1.125rem;   (18px)
--text-xl: 1.25rem;    (20px)
--text-2xl: 1.5rem;    (24px)
--text-3xl: 1.875rem;  (30px)
--text-4xl: 2.25rem;   (36px)
--text-5xl: 3rem;      (48px)

/* 가중치 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing (8px Grid)
```css
--space-1: 0.25rem;  (4px)
--space-2: 0.5rem;   (8px)
--space-3: 0.75rem;  (12px)
--space-4: 1rem;     (16px)
--space-6: 1.5rem;   (24px)
--space-8: 2rem;     (32px)
--space-12: 3rem;    (48px)
--space-16: 4rem;    (64px)
```

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
--radius-xl: 1.5rem;
--radius-full: 9999px;
```

### Shadow
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## 9. 성능 목표 (Performance Targets)

| 지표 | 목표 | 구현 방법 |
|------|------|---------|
| LCP | < 2.5s | Image Optimization, Code Splitting |
| FID | < 100ms | Debounce, Lazy Animation Init |
| CLS | < 0.1 | Fixed Layout, No Layout Shift |
| FCP | < 1.8s | Critical CSS, Preload |
| TTI | < 3.5s | Code Splitting, Tree Shaking |
| Animation FPS | 60fps | requestAnimationFrame, GPU Acceleration |

---

## 10. 접근성 (Accessibility)
```
WCAG 2.1 AA 준수:
□ 색상 대비 (4.5:1 이상)
□ 키보드 네비게이션 (Tab, Enter, Esc)
□ 스크린 리더 지원 (ARIA 레이블)
□ 포커스 표시 (outline)
□ 애니메이션 리듀스 (prefers-reduced-motion)
□ 폰트 크기 조절
□ 이미지 alt 텍스트

구현:
- alt 텍스트 필수
- ARIA labels on interactive elements
- Semantic HTML (nav, main, article)
- Color not only means of communication
```

---

## 11. SEO 최적화
```
□ Meta 태그 (title, description, og:image)
□ Canonical URLs
□ XML Sitemap
□ robots.txt
□ Structured Data (Schema.org)
□ Open Graph (공유 최적화)
□ 빠른 로딩 (Core Web Vitals)
□ 모바일 반응형
```

---

## 12. 모니터링 & 분석
```
Tools:
- Vercel Analytics (성능)
- Google Analytics (트래픽)
- Sentry (에러 추적)
- Lighthouse CI (자동 성능 검사)

KPIs:
- 페이지 뷰
- 평균 체류 시간
- 피드 읽기 완료율
- 구독 전환율
- 재방문율
```

---

## 13. 콘텐츠 관리

### 피드 메타데이터 (Front Matter)
```yaml
---
title: "Three.js로 만드는 상호작용 경험"
description: "Three.js를 활용한 웹 인터랙션 완벽 가이드"
date: "2025-01-20"
updated: "2025-01-20"
category: "Dev"
tags: ["Three.js", "WebGL", "Animation"]
image: "/images/three-js.jpg"
readingTime: 8
featured: true
---
```

### 피드 구조
```markdown
# 제목

## 개요
- 짧은 설명

## 목차 (자동 생성)

## 본문
### 섹션 1
내용...

### 섹션 2
내용...

## 결론

## 참고 자료
```

---

## 14. 예외 처리 & 에러 페이지
```
Pages:
- 404: 피드 없음
- 500: 서버 에러
- Offline: 네트워크 끊김

Design:
- 일관된 스타일
- 홈으로 돌아가기 버튼
- 검색 기능
- 추천 피드
```

---

## 15. 마이그레이션 & 백업
```
Version Control:
- GitHub 사용
- main, develop 브랜치 관리
- PR 기반 코드 리뷰

Backup:
- 피드: GitHub에 저장
- 데이터: 월 1회 백업
- 데이터베이스: 자동 백업 (필요시)
```

---

## 16. 성공 지표 (Success Metrics)
```
Technical:
✅ 60fps 애니메이션 유지율: 95%
✅ 페이지 로딩 속도: 평균 2초 이하
✅ 모바일 성능: 좋음 등급 (Lighthouse)
✅ 에러율: 0.1% 미만

User Engagement:
✅ 평균 체류 시간: 3분 이상
✅ 피드 읽기 완료율: 70% 이상
✅ 재방문율: 40% 이상
✅ 소셜 공유: 월 10회 이상

Business:
✅ 포트폴리오 효과: 회사 조회 증가
✅ 기술 인지도: SNS 팔로워 성장
✅ 커뮤니티: 댓글/피드백 활성화
```

---

## 17. 배포 & 유지보수

### 배포 전략
```
CI/CD:
- GitHub Actions 자동 테스트
- Vercel 자동 배포
- 프로덕션 배포: main 브랜치 push

Rollback:
- Vercel 자동 재배포
- 이전 배포 버전 복원 가능
```

### 유지보수
```
주간:
- 피드 발행
- 댓글 모니터링

월간:
- 성능 리뷰
- 오래된 피드 업데이트
- 의존성 업데이트

분기:
- 큰 기능 추가
- 디자인 개선
```

---

## 18. 문서화
```
필요한 문서:
□ README.md (프로젝트 설명)
□ CONTRIBUTING.md (기여 가이드)
□ Architecture.md (기술 아키텍처)
□ API.md (내부 API 문서)
□ DEPLOYMENT.md (배포 가이드)
□ TROUBLESHOOTING.md (문제 해결)
```

---

## 부록 A. 폴더 구조
```
tech-blog/
├─ public/
│  ├─ images/
│  ├─ fonts/
│  │  └─ JetBrainsMono-*.woff2
│  └─ feeds/
│
├─ src/
│  ├─ pages/
│  │  ├─ index.tsx
│  │  ├─ feeds/
│  │  │  ├─ index.tsx
│  │  │  └─ [slug].tsx
│  │  ├─ projects/
│  │  ├─ about/
│  │  └─ 404.tsx
│  │
│  ├─ components/
│  │  ├─ Header.tsx
│  │  ├─ Footer.tsx
│  │  ├─ PostCard.tsx
│  │  ├─ HeroSection.tsx
│  │  ├─ animations/
│  │  │  ├─ ThreeScene.tsx
│  │  │  ├─ ScrollAnimation.tsx
│  │  │  └─ TypingText.tsx
│  │  └─ ...
│  │
│  ├─ styles/
│  │  ├─ globals.css
│  │  ├─ variables.css
│  │  ├─ animations.css
│  │  └─ [component].module.css
│  │
│  ├─ lib/
│  │  ├─ posts.ts (피드 읽기)
│  │  ├─ analytics.ts
│  │  └─ utils.ts
│  │
│  ├─ types/
│  │  └─ index.ts
│  │
│  └─ hooks/
│     ├─ useScrollAnimation.ts
│     └─ useMousePosition.ts
│
├─ feeds/ (마크다운)
│  ├─ 2025-01-20-first-post.md
│  └─ ...
│
├─ .github/
│  └─ workflows/
│     └─ ci.yml
│
├─ next.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 부록 B. 검사 리스트 (Pre-Launch)
```
코드 품질:
□ TypeScript strict mode
□ ESLint 통과
□ Prettier 포맷팅
□ 유닛 테스트 커버리지 > 70%

성능:
□ Lighthouse 90점 이상
□ Core Web Vitals 우수
□ 번들 크기 < 200KB (gzip)
□ 이미지 최적화 완료

접근성:
□ WCAG 2.1 AA 준수
□ 스크린 리더 테스트
□ 키보드 네비게이션
□ 색상 대비 테스트

SEO:
□ Meta 태그 완성
□ Open Graph 설정
□ Sitemap 생성
□ robots.txt 설정

콘텐츠:
□ 초기 피드 5개 이상
□ About 페이지 작성
□ 프로젝트 설명 완성

배포:
□ 도메인 설정
□ SSL 인증서
□ 이메일 설정 (연락처용)
□ Analytics 설정
```

---

## 최종 요약

이 PRD를 바탕으로 개발을 시작하면 **전문적이고 기억에 남는 기술 블로그**를 구축할 수 있습니다! 🚀

각 페이즈별로 진행하면서 필요에 따라 항목을 추가/수정하세요.
