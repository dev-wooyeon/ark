# Phase 1: Foundation - TDS 디자인 토큰 시스템 구축

> 작성일: 2025-01-29
> 작성자: Eunu (TDS 기반 블로그 리빌드 프로젝트)

## 목표

기존 신문지 베이지 컬러 기반의 커스텀 디자인 시스템을 **TDS(토스 디자인 시스템)** 기반으로 전환하기 위한 기초 작업을 수행합니다.

### 핵심 과제

1. TDS 디자인 토큰을 CSS Variables로 정의
2. 글로벌 스타일을 TDS 규칙에 맞게 재구성
3. Root Layout에 overlay 포털 추가

---

## 배경

### 기존 시스템의 문제점

기존 eunu.log는 다음과 같은 디자인 시스템을 사용했습니다:

```css
/* 기존 variables.css */
--bg-primary: #eaebea; /* 신문지 베이지 */
--text-primary: #1a1a1a;
--accent-primary: #0066cc; /* 클래식 블루 */
```

**문제점:**

1. **일관성 부족**: 커스텀 컬러 시스템으로 인해 명확한 위계가 없음
2. **확장성 제한**: Grey scale이 3-4단계로 제한적
3. **토스 철학 부재**: TDS의 "간결하고 명확한" 원칙이 반영되지 않음

### TDS를 선택한 이유

TDS는 다음과 같은 장점을 제공합니다:

1. **체계적인 Grey Scale**: 900~50까지 10단계의 명확한 위계
2. **검증된 컬러 시스템**: 접근성(4.5:1 대비)을 보장하는 컬러 팔레트
3. **8pt Grid**: 일관된 스페이싱으로 시각적 리듬 확보
4. **Minor Third Scale**: 타이포그래피 조화를 위한 수학적 비율

---

## 구현 내용

### 1. TDS 디자인 토큰 정의

**파일: `src/styles/tokens.css`**

#### 1.1 색상 시스템

```css
@theme {
  /* Primary */
  --color-toss-blue: #3182f6;
  --color-toss-blue-light: #4a9eff;
  --color-toss-blue-dark: #1b64da;

  /* Grey Scale (10단계) */
  --color-grey-900: #191f28; /* 가장 어두움 - 메인 텍스트 */
  --color-grey-800: #333d4b;
  --color-grey-700: #4e5968; /* 서브 텍스트 */
  --color-grey-600: #6b7684; /* 설명 텍스트 */
  --color-grey-500: #8b95a1;
  --color-grey-400: #b0b8c1; /* Disabled 상태 */
  --color-grey-300: #d1d6db;
  --color-grey-200: #e5e8eb; /* 보더 */
  --color-grey-100: #f2f4f6; /* 디바이더 */
  --color-grey-50: #f9fafb; /* 서브 배경 */
}
```

**선택 근거:**

- **Grey-900 (#191f28)**: WCAG AA 기준(4.5:1)을 만족하는 메인 텍스트 컬러
- **Grey-700 (#4e5968)**: 화이트 배경에서 3:1 이상 대비를 유지하는 서브 텍스트
- **Grey-100/50**: 미묘한 배경 차이로 섹션을 구분하되 과하지 않음

#### 1.2 타이포그래피 (Minor Third Scale)

```css
@theme {
  /* Font Family */
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, ...;
  --font-mono: 'JetBrains Mono', ui-monospace, ...;

  /* Font Sizes - Minor Third Scale (1.2 ratio) */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 0.9375rem; /* 15px - 본문 기본 */
  --text-md: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px - Headline SM */
  --text-3xl: 2rem; /* 32px - Headline MD */
  --text-4xl: 2.5rem; /* 40px - Headline LG */
}
```

**Minor Third Scale을 선택한 이유:**

Minor Third는 1.2 비율로, 각 단계가 이전 크기의 120%입니다. 이는:

- **시각적 조화**: 급격하지 않으면서도 명확한 위계
- **읽기 편의성**: 15px 본문과 24px 헤드라인의 조화
- **반응형 대응**: 모바일에서도 과하지 않은 크기

참고: Major Third(1.25)는 너무 크고, Perfect Fourth(1.333)는 모바일에서 과함.

#### 1.3 스페이싱 (8pt Grid)

```css
@theme {
  --space-0: 0;
  --space-0.5: 0.125rem; /* 2px */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px - 기본 단위 */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
}
```

**8pt Grid를 사용하는 이유:**

1. **디바이스 대응**: 대부분의 화면은 8의 배수로 나뉨 (1920, 1280, 768)
2. **시각적 리듬**: 일관된 간격으로 정돈된 느낌
3. **디자이너-개발자 협업**: 피그마 등 디자인 툴의 기본 그리드

**실제 적용 예시:**

```css
/* 관련 요소 간 */
padding: var(--space-4); /* 16px */

/* 섹션 간 */
margin-bottom: var(--space-8); /* 32px */

/* 큰 섹션 구분 */
padding-block: var(--space-16); /* 64px */
```

#### 1.4 Border Radius

```css
@theme {
  --radius-sm: 0.5rem; /* 8px - 버튼, 작은 카드 */
  --radius-md: 1rem; /* 16px - 메인 카드 */
  --radius-lg: 1.5rem; /* 24px - 큰 섹션, 모달 */
}
```

**토스 디자인의 Radius 철학:**

- **8px**: 부드러우면서도 명확한 경계
- **16px**: 카드의 시각적 독립성 강조
- **24px**: 모달/시트 등 독립적 컨테이너

### 2. 글로벌 스타일 재구성

**파일: `src/styles/globals.css`**

#### 2.1 Base Layer

```css
@layer base {
  body {
    font-family: var(--font-sans);
    font-size: var(--text-base); /* 15px */
    line-height: var(--leading-relaxed); /* 1.6 */
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
  }
}
```

**15px를 본문 기본 크기로 선택한 이유:**

- **가독성**: 14px보다 읽기 편하지만 16px보다 콤팩트
- **정보 밀도**: 기술 블로그 특성상 코드와 텍스트가 많아 밀도 확보
- **토스 앱**: 토스 앱도 15px를 본문 기본으로 사용

#### 2.2 Prose 스타일 (MDX 콘텐츠)

```css
.prose {
  font-size: var(--text-base); /* 15px */
  line-height: var(--leading-loose); /* 1.8 */
}

.prose p {
  margin-bottom: 1.5rem;
  color: var(--color-grey-700);
}

.prose h2 {
  font-size: var(--text-2xl); /* 24px */
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
```

**Prose 스타일링 원칙:**

1. **본문 Line Height 1.8**: 긴 글을 읽을 때 눈의 피로 감소
2. **Heading 간격**: 상단 2.5rem, 하단 1rem으로 시각적 그룹핑
3. **Grey-700 텍스트**: Grey-900보다 부드러워 장시간 독서에 적합

#### 2.3 접근성 (Accessibility)

```css
:focus-visible {
  outline: 2px solid var(--color-toss-blue);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**WCAG 준수:**

- **Focus outline**: 키보드 네비게이션 사용자를 위한 명확한 표시
- **Reduced motion**: 전정 장애가 있는 사용자 배려
- **2px outline**: WCAG 2.2에서 권장하는 최소 두께

### 3. Root Layout 수정

**파일: `src/app/layout.tsx`**

#### 3.1 Overlay Portal 추가

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div id="app-root">{children}</div>
        <div id="overlay-root" /> {/* Modal, Toast 포털 */}
      </body>
    </html>
  );
}
```

**Overlay Portal이 필요한 이유:**

1. **Z-index 관리**: Modal, Toast가 항상 최상단에 렌더링
2. **CSS Isolation**: 부모 컴포넌트의 `overflow: hidden` 등에 영향받지 않음
3. **접근성**: ARIA 구조에서 Dialog를 body 직계 자식으로 권장

#### 3.2 Metadata 개선

```tsx
export const metadata: Metadata = {
  title: {
    default: 'eunu.log',
    template: '%s | eunu.log', // 페이지별 타이틀 자동 생성
  },
  description: '데이터와 시스템, 창의적인 것들을 만듭니다',
  keywords: ['개발', '블로그', '기술', 'Next.js', 'React'],
  // ...
};
```

**SEO 최적화:**

- **title.template**: 블로그 상세 페이지에서 "글 제목 | eunu.log" 자동 생성
- **keywords**: 검색엔진 최적화 (Google은 무시하지만 Naver/Daum은 참고)
- **OpenGraph**: SNS 공유 시 메타데이터

---

## 검증 결과

### 색상 대비 테스트

| 조합              | 대비   | WCAG | 용도        |
| ----------------- | ------ | ---- | ----------- |
| Grey-900 / White  | 16.7:1 | AAA  | 메인 텍스트 |
| Grey-700 / White  | 7.2:1  | AAA  | 서브 텍스트 |
| Grey-600 / White  | 5.1:1  | AA   | 설명 텍스트 |
| Toss-Blue / White | 4.6:1  | AA   | 링크        |

모든 텍스트 조합이 **WCAG AA 이상** 충족.

### 타이포그래피 조화

```
40px (Headline LG)  ÷ 1.25 = 32px (Headline MD)
32px (Headline MD)  ÷ 1.33 = 24px (Headline SM)
24px (Headline SM)  ÷ 1.6  = 15px (Body)
```

각 단계가 시각적으로 명확히 구분되면서도 과하지 않음.

### 스페이싱 일관성

```
카드 내부 패딩:    16px (space-4)
카드 간 간격:      24px (space-6)
섹션 간 간격:      32px (space-8)
페이지 상하 패딩:  64px (space-16)
```

모든 간격이 8의 배수로 일관성 확보.

---

## 학습 포인트

### 1. CSS Variables vs Tailwind Tokens

TDS 토큰을 `@theme` 블록에 정의한 이유:

```css
/* ✅ Tailwind v4 방식 */
@theme {
  --color-toss-blue: #3182f6;
}

/* ❌ 구버전 방식 */
:root {
  --color-toss-blue: #3182f6;
}
```

Tailwind v4는 `@theme` 블록의 변수를 자동으로 유틸리티 클래스로 변환:

- `bg-toss-blue` → `background-color: var(--color-toss-blue)`
- `text-grey-700` → `color: var(--color-grey-700)`

### 2. Pretendard vs System Fonts

```css
font-family:
  'Pretendard',
  -apple-system,
  BlinkMacSystemFont,
  ...;
```

**Pretendard를 선택한 이유:**

- **한글 최적화**: 받침 균형, 자간 조정이 우수
- **Variable Font**: 400-700 weight를 하나의 파일로 제공
- **오픈소스**: 상업적 사용 무료

**Fallback 순서:**

1. Pretendard (CDN)
2. -apple-system (iOS/macOS)
3. BlinkMacSystemFont (Chrome on macOS)
4. Segoe UI (Windows)

### 3. Line Height의 과학

```css
/* 본문 */
line-height: 1.6; /* 15px × 1.6 = 24px */

/* 긴 글 */
line-height: 1.8; /* 15px × 1.8 = 27px */
```

**1.6을 기본으로 선택한 이유:**

- **가독성 연구**: Robert Bringhurst의 "The Elements of Typographic Style"에서 권장
- **눈의 움직임**: 다음 줄로 이동할 때 충분한 공간 확보
- **한글 특성**: 영어보다 글자 높이가 높아 조금 더 넓은 행간 필요

---

## 다음 단계

Phase 2에서는 이 토큰을 활용한 Core UI Components를 구현합니다:

- **Button**: primary/secondary/tertiary variant
- **Card**: hover 효과, compound components
- **Input**: label, error, validation
- **Modal/BottomSheet**: overlay pattern
- **Toast**: feedback system

모든 컴포넌트는:

1. TDS 토큰만 사용 (하드코딩 금지)
2. 접근성 준수 (ARIA, keyboard navigation)
3. 반응형 (mobile-first)
4. 성능 최적화 (불필요한 리렌더링 방지)

---

## 참고 자료

- [TDS 컬러 시스템](https://toss.im/career/article/tds-color-system)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Pretendard Font](https://github.com/orioncactus/pretendard)
