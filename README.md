# Eunu.log

Modern Tech Blog with Interactive Experience

## 프로젝트 개요

기술 콘텐츠를 제공하면서 동시에 뇌 과학 기반 상호작용 애니메이션을 통해 **높은 기억력과 재방문율**을 확보하는 기술 블로그 플랫폼입니다.

## 핵심 기능

- 🎯 **기억에 남는 경험**: 상호작용형 애니메이션
- 🎨 **시각적 프리미엄**: 딥그린 + 화이트 컬러 시스템
- ⚡ **고성능**: 모든 애니메이션에서 60fps 유지
- 📱 **모든 기기 지원**: 반응형 디자인 & 터치 최적화

## 기술 스택

### 프레임워크 & 라이브러리
- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: CSS Modules, CSS Variables
- **Content**: Markdown, MDX, gray-matter
- **Utilities**: date-fns, clsx

### 개발 계획
- **Animation**: Three.js, GSAP, Framer Motion (추후 추가)
- **Build & Deploy**: Vercel

## 프로젝트 구조

```
eunu.log/
├─ src/
│  ├─ app/              # Next.js App Router
│  ├─ components/       # React 컴포넌트
│  ├─ styles/           # CSS 스타일
│  ├─ lib/              # 유틸리티 함수
│  ├─ types/            # TypeScript 타입
│  └─ hooks/            # Custom Hooks
├─ feeds/               # 마크다운 피드
├─ public/              # 정적 파일
└─ docs/                # 문서
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm run start
```

## 개발 로드맵

### Phase 1: MVP (진행 중)
- [x] 프로젝트 구조 설정
- [x] 컬러 팔레트 CSS 변수 정의
- [x] 기본 페이지 레이아웃 (사용자 디자인 유지하며 통합 필요)
- [x] 마크다운 피드 렌더링 (로직 구현 완료)
- [x] Vercel 배포

### Phase 2: 애니메이션 기본
- [x] GSAP 스크롤 애니메이션
- [x] 타이핑 효과
- [ ] 페이지 전환 애니메이션

### Phase 3: Three.js 통합
- [ ] Hero 3D 객체
- [ ] 프로젝트 페이지 3D 호버
- [ ] 성능 최적화

### Phase 4: 고급 기능
- [x] 다크모드
- [ ] 검색 기능
- [ ] 댓글 시스템
- [ ] SEO 최적화

## 성능 목표

| 지표 | 목표 |
|------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Animation FPS | 60fps |

## 라이선스

MIT
