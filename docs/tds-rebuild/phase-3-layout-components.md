# Phase 3: Layout Components - 페이지 구조의 기초

> 작성일: 2025-01-29
> 작성자: Eunu (TDS 기반 블로그 리빌드 프로젝트)

## 목표

Core UI Components를 활용하여 모든 페이지에서 공통으로 사용할 Layout Components를 구축합니다.

---

## 구현 내용

### 1. Header - 네비게이션의 중심

**핵심 기능:**
- 로고 링크 (eunu.log)
- 데스크톱 네비게이션 (Home, Blog, Resume)
- 모바일 햄버거 메뉴
- Active indicator (Framer Motion layoutId)

**TDS 적용:**
- Sticky Header: `backdrop-blur-md`로 부드러운 반투명
- Active 색상: toss-blue
- Hover 효과: grey-600 → grey-900 transition

**모바일 UX:**
- 44px 최소 터치 영역
- 메뉴 열릴 때 애니메이션 (height: 0 → auto)
- 메뉴 항목 클릭 시 자동 닫힘

---

### 2. Footer - 정보와 링크

**구성:**
- 저작권 표시
- 소셜 링크 (GitHub, Email)

**TDS 적용:**
- Grey-50 배경으로 섹션 구분
- 링크 hover시 toss-blue
- 반응형: 모바일은 세로, 데스크톱은 가로

---

### 3. Container - 콘텐츠 너비 관리

**Size 옵션:**
- sm: 640px (좁은 텍스트)
- md: 800px (블로그 포스트)
- lg: 1000px (일반 페이지)
- xl: 1200px (대시보드)

**반응형 패딩:**
- 모바일: 24px (`px-6`)
- 데스크톱: 32px (`md:px-8`)

---

## 다음 단계

Phase 4에서는 블로그 전용 컴포넌트를 구현합니다:

- **PostCard**: default/featured variant
- **PostList**: stagger 애니메이션
- **CategoryFilter**: All/Dev/Life 필터링
- **TableOfContents**: 스크롤 추적 목차
- **ReadingProgress**: 진행률 바
