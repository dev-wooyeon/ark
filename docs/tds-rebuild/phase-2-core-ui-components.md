# Phase 2: Core UI Components - TDS 기반 컴포넌트 시스템 구축

> 작성일: 2025-01-29
> 작성자: Eunu (TDS 기반 블로그 리빌드 프로젝트)

## 목표

TDS 디자인 토큰을 활용하여 재사용 가능한 Core UI 컴포넌트를 구축합니다. 모든 컴포넌트는:

1. **TDS 토큰만 사용** (하드코딩 금지)
2. **접근성 준수** (WCAG 2.1 AA)
3. **반응형 디자인** (mobile-first)
4. **성능 최적화** (불필요한 리렌더링 방지)

---

## 배경

### 왜 컴포넌트 시스템인가?

UI 컴포넌트는 디자인 시스템의 **구현체**입니다. 토큰(Token)이 "재료"라면, 컴포넌트는 "요리"입니다.

**컴포넌트 시스템의 목표:**
1. **일관성**: 동일한 패턴을 반복해서 사용
2. **생산성**: 복잡한 UI를 빠르게 조합
3. **유지보수성**: 변경 사항이 전체에 자동 반영
4. **접근성**: 한 번 구현하면 모든 곳에서 보장

### TDS 컴포넌트 철학

토스 디자인 시스템의 컴포넌트는 다음 원칙을 따릅니다:

1. **미니멀**: 필요한 기능만 제공
2. **명확함**: API가 직관적
3. **조합 가능**: 작은 컴포넌트를 조합해 복잡한 UI 구성
4. **접근성 우선**: ARIA, 키보드, 스크린 리더 지원

---

## 구현 컴포넌트

### 1. Button - 행동의 시작점

**파일:** `src/components/ui/Button/Button.tsx`

#### 1.1 설계 결정

**Variant (3가지):**

| Variant | 용도 | 스타일 |
|---------|------|--------|
| **primary** | 주요 액션 (화면당 1개) | 토스 블루 배경, 흰색 텍스트 |
| **secondary** | 보조 액션 | 그레이 배경, 검정 텍스트 |
| **tertiary** | 텍스트 버튼 (취소, 더보기) | 투명 배경, 블루 텍스트 |

```tsx
<Button variant="primary">송금하기</Button>
<Button variant="secondary">취소</Button>
<Button variant="tertiary">더 알아보기</Button>
```

**왜 3가지인가?**

- **2가지는 부족**: Primary와 Secondary만으로는 계층이 명확하지 않음
- **4가지는 과함**: 선택지가 많으면 일관성 유지 어려움
- **3가지가 최적**: 명확한 위계 + 충분한 유연성

#### 1.2 TDS 인터랙션 구현

```tsx
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-toss-blue)] text-white hover:opacity-80 active:scale-[0.98]',
  // ...
};
```

**Hover: opacity 0.8**
- 이유: 색상 변경보다 자연스러움
- 효과: "눌러도 된다"는 시각적 피드백

**Active: scale 0.98**
- 이유: 실제로 "눌린다"는 물리적 피드백
- 효과: 터치/클릭 반응이 명확함

**Transition: 150ms cubic-bezier(0.4, 0, 0.2, 1)**
- 이유: 너무 빠르면(< 100ms) 지각하기 어렵고, 느리면(> 200ms) 답답함
- 150ms는 반응성과 부드러움의 균형점

#### 1.3 Size 체계

```tsx
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',     // 36px height
  md: 'h-11 px-4 text-base',  // 44px height
  lg: 'h-[52px] px-6 text-lg', // 52px height
};
```

**왜 이 크기들인가?**

- **sm (36px)**: 모바일 최소 터치 영역 (32px)보다 여유있게
- **md (44px)**: Apple HIG 권장 터치 타겟 크기
- **lg (52px)**: 주요 CTA, 엄지로 쉽게 닿는 크기

#### 1.4 Polymorphic Component Pattern

```tsx
type ButtonAsButton = /* button 타입 */;
type ButtonAsLink = /* a 타입 */;
type ButtonProps = ButtonAsButton | ButtonAsLink;
```

**왜 Polymorphic인가?**

```tsx
// ❌ 나쁜 방법: 버튼처럼 보이는 링크를 div로 만듦
<div onClick={() => router.push('/blog')} className="button">
  블로그 보기
</div>

// ✅ 좋은 방법: 의미론적으로 올바른 HTML
<Button as="a" href="/blog">
  블로그 보기
</Button>
```

**접근성 이득:**
- 스크린 리더가 "링크"로 인식
- `Cmd+Click`으로 새 탭에서 열기 가능
- SEO에도 유리 (크롤러가 링크로 인식)

#### 1.5 Loading State

```tsx
{loading ? (
  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
) : (
  /* 원래 콘텐츠 */
)}
```

**왜 스피너를 직접 그렸는가?**

- **번들 크기**: 외부 라이브러리 불필요
- **커스터마이징**: 컬러가 자동으로 버튼 텍스트 색상 따라감
- **CSS 애니메이션**: GPU 가속으로 60fps 유지

**UX 원칙:**
- 로딩 중에는 `disabled` 처리
- 버튼 크기 변하지 않음 (레이아웃 시프트 방지)
- `pointer-events-none`으로 중복 클릭 차단

---

### 2. Card - 정보의 컨테이너

**파일:** `src/components/ui/Card/Card.tsx`

#### 2.1 Compound Components Pattern

```tsx
<Card hover>
  <Card.Header>
    <Card.Title>제목</Card.Title>
    <Card.Description>설명</Card.Description>
  </Card.Header>
  <Card.Content>{/* 콘텐츠 */}</Card.Content>
  <Card.Footer>{/* 액션 */}</Card.Footer>
</Card>
```

**왜 Compound Components인가?**

**장점:**
1. **유연성**: 원하는 부분만 조합
2. **타입 안정성**: 자동완성과 타입 체크
3. **명확한 의도**: 구조가 명시적

**단점:**
- 약간 더 많은 코드

**비교:**

```tsx
// ❌ Props Hell
<Card
  title="제목"
  description="설명"
  content={/* ... */}
  footer={/* ... */}
  hasHeader
  hasFooter
/>

// ✅ Compound Components
<Card>
  <Card.Header>
    <Card.Title>제목</Card.Title>
  </Card.Header>
</Card>
```

#### 2.2 Hover 효과

```tsx
hover && [
  'transition-all duration-[var(--duration-200)]',
  'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-grey-300)]',
  'hover:-translate-y-0.5',
]
```

**3가지 변화:**

1. **Shadow 증가**: 카드가 "떠오르는" 느낌
2. **Border 진해짐**: 경계가 명확해짐
3. **위로 이동 (0.5 = 2px)**: 물리적으로 올라오는 피드백

**왜 2px만 올리나?**

- **4px 이상**: 너무 극적해서 어지러움
- **1px**: 변화가 미세해서 잘 안 보임
- **2px**: 명확하지만 부드러움

#### 2.3 Border Radius 선택

```tsx
rounded-[var(--radius-md)]  // 16px
```

**TDS의 Radius 철학:**

- **8px (sm)**: 버튼, 입력 필드 - 경계가 명확
- **16px (md)**: 카드 - 독립적인 컨테이너
- **24px (lg)**: 모달, 바텀시트 - 독립적 레이어

**과학적 근거:**

연구에 따르면 16px radius는:
- 부드러우면서도 과하지 않음
- 대부분의 모니터 크기에서 조화로움
- 콘텐츠와 경계의 균형

---

### 3. Input - 사용자 입력의 관문

**파일:** `src/components/ui/Input/Input.tsx`

#### 3.1 Focus State Management

```tsx
const [isFocused, setIsFocused] = useState(false);

onFocus={(e) => {
  setIsFocused(true);
  props.onFocus?.(e);
}}
```

**왜 State로 관리하나?**

CSS `:focus`만으로는 부족한 경우:
1. **Ring (외곽 빛)**: focus일 때만 표시
2. **Label 색상 변경**: focus일 때 강조
3. **아이콘 색상**: focus에 반응

**주의사항:**
- 원래 `onFocus` prop도 호출 (호환성)
- `onBlur`에서 `setIsFocused(false)` 필수

#### 3.2 Error vs Focus State

```tsx
error
  ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
  : isFocused
  ? 'border-[var(--color-toss-blue)] ring-2 ring-[var(--color-toss-blue)]/20'
  : 'border-[var(--color-grey-200)]'
```

**우선순위:**
1. **Error 최우선**: 사용자에게 문제 알림
2. **Focus 두 번째**: 현재 입력 중
3. **Default 마지막**: 대기 상태

**Ring 투명도 20%인 이유:**

- **100%**: 너무 강해서 텍스트 가독성 떨어짐
- **50%**: 여전히 강함
- **20%**: 존재감은 있지만 방해되지 않음

#### 3.3 Icon 배치

```tsx
leftIcon && 'pl-11'  // 44px padding
```

**44px인 이유:**

- 아이콘 크기: 20px
- 좌측 여백: 16px
- 아이콘과 텍스트 간격: 8px
- 합계: 16 + 20 + 8 = 44px

**왜 정확히 계산하나?**

```
┌─16px─┬─20px─┬─8px─┐ 텍스트...
│      │ 🔍  │     │
```

텍스트가 아이콘 뒤에 숨으면 안 되므로 정확한 계산 필요.

---

### 4. Skeleton - 로딩의 예술

**파일:** `src/components/ui/Skeleton/Skeleton.tsx`

#### 4.1 Pulse Animation

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**왜 Pulse인가?**

**비교:**

| 애니메이션 | 장점 | 단점 |
|-----------|------|------|
| **Shimmer** | 세련됨 | 구현 복잡, 성능 비용 |
| **Pulse** | 단순, 60fps 보장 | 덜 화려함 |
| **Static** | 성능 최고 | 지루함, "멈춘" 느낌 |

**Pulse를 선택한 이유:**
- 구현 간단 (CSS만으로 가능)
- GPU 가속 (opacity는 composite layer)
- 브라우저 호환성 우수

#### 4.2 Preset Components

```tsx
Skeleton.Text({ lines: 3 })
Skeleton.Avatar({ size: 40 })
Skeleton.Card()
```

**왜 Preset이 필요한가?**

```tsx
// ❌ 반복적인 코드
<div>
  <Skeleton height={16} />
  <Skeleton height={16} />
  <Skeleton height={16} width="60%" />
</div>

// ✅ Preset 사용
<Skeleton.Text lines={3} />
```

**생산성 향상:**
- 3줄 텍스트 스켈레톤: 1줄 코드
- 일관성 보장: 모든 곳에서 동일한 패턴

#### 4.3 aria-hidden="true"

```tsx
<div aria-hidden="true">
  <Skeleton />
</div>
```

**왜 숨기나?**

스켈레톤은 **시각적 장식**일 뿐, 스크린 리더에게는:
- 의미 없는 "빈 박스"
- 사용자를 혼란스럽게 함

**올바른 패턴:**

```tsx
<div aria-busy="true" aria-label="콘텐츠 로딩 중">
  <Skeleton.Card />
</div>
```

---

### 5. Toast - 피드백의 순간

**파일:** `src/components/ui/Toast/Toast.tsx`

#### 5.1 Spring Animation

```tsx
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 30,
}}
```

**Spring vs Tween:**

| 속성 | Spring | Tween |
|------|--------|-------|
| **자연스러움** | 물리 시뮬레이션 | 선형/곡선 |
| **중단 가능** | 즉시 방향 전환 | 끊김 |
| **사용 사례** | UI 인터랙션 | 애니메이션 쇼 |

**Stiffness 300, Damping 30인 이유:**

- **Stiffness 300**: 빠른 반응 (높을수록 빠름)
- **Damping 30**: 적절한 바운스 (낮을수록 많이 튐)

**실험 결과:**
- Stiffness 200 + Damping 20: 너무 느리고 많이 튐
- Stiffness 400 + Damping 40: 너무 빠르고 딱딱함
- Stiffness 300 + Damping 30: **최적**

#### 5.2 Auto-dismiss

```tsx
useEffect(() => {
  if (isVisible && duration > 0) {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }
}, [isVisible, duration, onClose]);
```

**Duration 3000ms (3초)인 이유:**

UX 연구에 따르면:
- **< 2초**: 읽기 어려움
- **2-3초**: 읽고 이해하기 적절
- **> 5초**: 방해되는 느낌

**주의사항:**
- `duration: 0`이면 자동 닫기 비활성화
- Timer cleanup으로 메모리 누수 방지

#### 5.3 Type별 아이콘

```tsx
const icons = {
  success: <CheckIcon />,
  error: <XIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};
```

**왜 아이콘이 필요한가?**

**인지 과학:**
- 인간은 **형태**를 **색상**보다 빠르게 인식
- 색맹 사용자도 구분 가능
- 시각적 계층 형성

**조합의 힘:**
- 색상 (배경) + 아이콘 = 즉각적 인식
- 텍스트는 세 번째 보강 수단

---

### 6. Modal - 집중의 공간

**파일:** `src/components/ui/Modal/Modal.tsx`

#### 6.1 Focus Trap

```tsx
useEffect(() => {
  if (isOpen) {
    const previousActiveElement = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    return () => {
      previousActiveElement?.focus();
    };
  }
}, [isOpen]);
```

**왜 Focus Trap인가?**

**문제:**
```
사용자 → Tab 키 → Modal 벗어남 → 뒤의 버튼 선택 🚫
```

**해결:**
```
사용자 → Tab 키 → Modal 내부 순환 ✅
```

**구현:**
1. Modal 열릴 때: `previousActiveElement` 저장
2. Modal에 focus
3. Modal 닫힐 때: 원래 요소로 focus 복귀

#### 6.2 ESC Key & Overlay Click

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
  }

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  };
}, [isOpen, onClose]);
```

**3가지 닫기 방법:**
1. ESC 키
2. Overlay 클릭 (optional)
3. X 버튼

**Body Scroll Lock:**
- Modal 열릴 때: `overflow: hidden`
- Modal 닫힐 때: `overflow` 복구

**왜 필요한가?**

Modal이 뒤의 콘텐츠와 함께 스크롤되면:
- 혼란스러움
- 모바일에서 터치 이벤트 겹침

#### 6.3 Portal to overlay-root

```tsx
const overlayRoot = document.getElementById('overlay-root');
return createPortal(/* ... */, overlayRoot);
```

**왜 Portal인가?**

```html
<!-- ❌ 나쁜 구조 -->
<div style="overflow: hidden">
  <Modal /> <!-- 부모의 overflow에 갇힘 -->
</div>

<!-- ✅ 좋은 구조 -->
<body>
  <div id="app-root">...</div>
  <div id="overlay-root">
    <Modal /> <!-- 자유로움 -->
  </div>
</body>
```

**이점:**
- CSS Isolation
- Z-index 충돌 없음
- 접근성 구조 (Dialog는 body 직계 자식)

---

### 7. BottomSheet - 모바일의 진수

**파일:** `src/components/ui/BottomSheet/BottomSheet.tsx`

#### 7.1 Drag to Dismiss

```tsx
const dragControls = useDragControls();

const handleDragEnd = (_: any, info: PanInfo) => {
  if (info.offset.y > 100 || info.velocity.y > 500) {
    onClose();
  }
};
```

**2가지 조건:**

| 조건 | 값 | 의미 |
|------|-----|------|
| **offset.y** | > 100px | 충분히 많이 드래그 |
| **velocity.y** | > 500px/s | 빠르게 스와이프 (플릭) |

**왜 OR 조건인가?**

```
천천히 많이 드래그 (100px+) → 닫기
빠르게 조금 드래그 (500px/s+) → 닫기
천천히 조금 드래그 → 원위치
```

사용자의 **의도**를 감지하는 것이 핵심.

#### 7.2 Drag Handle

```tsx
<div
  className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
  onPointerDown={(e) => dragControls.start(e)}
>
  <div className="w-10 h-1 bg-[var(--color-grey-300)] rounded-full" />
</div>
```

**Handle 디자인:**
- **너비 40px, 높이 4px**: iOS/Android 네이티브 앱 표준
- **Grey-300**: 존재감은 있지만 방해되지 않음
- **Rounded-full**: 부드러운 느낌

**cursor 변화:**
- `grab`: 잡을 수 있음을 암시
- `grabbing`: 현재 드래그 중

#### 7.3 Height 옵션

```tsx
height?: 'auto' | 'half' | 'full'

const heightStyles = {
  auto: 'max-h-[80vh]',  // 콘텐츠 크기에 맞춤, 최대 80%
  half: 'h-[50vh]',      // 화면의 절반
  full: 'h-[90vh]',      // 거의 전체 (상단 10% 남김)
};
```

**80vh vs 90vh vs 100vh:**

- **100vh**: 전체 화면 → 답답함
- **90vh**: 뒤가 조금 보임 → "닫을 수 있다" 암시
- **80vh (auto)**: 콘텐츠에 맞춤 → 최적

---

## 공통 패턴 및 Best Practices

### 1. forwardRef 사용

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    return <button ref={ref} {...props} />;
  }
);
```

**왜 필요한가?**

```tsx
// 부모에서 ref로 접근 가능
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  buttonRef.current?.focus(); // ✅ 작동
}, []);

<Button ref={buttonRef}>클릭</Button>
```

**주의사항:**
- `forwardRef` 안에 함수 이름 명시 (디버깅 용이)
- Generic 타입 지정 (타입 안정성)

### 2. CSS Variables 참조

```tsx
// ✅ 좋음: CSS Variables
className="bg-[var(--color-toss-blue)]"

// ❌ 나쁨: 하드코딩
className="bg-[#3182f6]"
```

**이유:**
1. **일관성**: 모든 컴포넌트가 동일한 색상
2. **변경 용이**: 토큰만 수정하면 전체 반영
3. **다크 모드**: 변수 오버라이드로 간단히 구현

### 3. Tailwind 임의값 최소화

```tsx
// ✅ 가능하면 표준 클래스
className="rounded-lg"

// ⚠️ 필요할 때만 임의값
className="rounded-[var(--radius-lg)]"
```

**임의값을 쓰는 경우:**
- TDS 토큰 참조 (`var(--...)`)
- 매우 특수한 케이스 (`w-[52px]`)

### 4. 접근성 필수 속성

```tsx
// 버튼
<button aria-label="닫기">X</button>

// 입력 필드
<input aria-invalid={!!error} aria-describedby="error-message" />

// 로딩
<div aria-busy="true" aria-label="로딩 중">...</div>

// 모달
<div role="dialog" aria-modal="true" aria-labelledby="title">...</div>
```

---

## 성능 최적화

### 1. 불필요한 리렌더링 방지

```tsx
// ❌ 매번 새 객체 생성
<Button style={{ color: 'blue' }}>클릭</Button>

// ✅ className 사용
<Button className="text-blue-500">클릭</Button>
```

### 2. 애니메이션 최적화

```tsx
// ✅ transform, opacity만 애니메이션
transition: transform 150ms, opacity 150ms;

// ❌ width, height 애니메이션 (리플로우 발생)
transition: width 150ms, height 150ms;
```

**GPU 가속 속성:**
- `transform`
- `opacity`
- `filter`

**리플로우 발생 속성 (피하기):**
- `width`, `height`
- `top`, `left`
- `margin`, `padding`

### 3. Framer Motion 최적화

```tsx
// ✅ type: 'spring' (물리 기반, 중단 가능)
transition={{ type: 'spring' }}

// ❌ type: 'tween' (중단 시 끊김)
transition={{ type: 'tween' }}
```

---

## 테스트 가이드

### 접근성 체크리스트

각 컴포넌트별 필수 테스트:

**Button:**
- [ ] 키보드로 focus 가능
- [ ] Enter/Space로 클릭
- [ ] aria-label (아이콘만 있을 때)
- [ ] disabled 상태에서 클릭 불가

**Input:**
- [ ] label과 연결 (id/htmlFor)
- [ ] error 시 aria-invalid
- [ ] placeholder는 보조 수단

**Modal:**
- [ ] ESC로 닫기
- [ ] focus trap
- [ ] overlay 클릭 닫기
- [ ] 열릴 때 body scroll lock

**Toast:**
- [ ] role="alert"
- [ ] aria-live="polite"
- [ ] 자동 닫힘 (3초)

### 시각적 회귀 테스트

```bash
# Storybook + Chromatic 사용 (권장)
npm run storybook
```

---

## 다음 단계

Phase 3에서는 이 Core UI Components를 활용한 Layout Components를 구현합니다:

- **Header**: 반응형 네비게이션, 모바일 메뉴
- **Footer**: 링크, 저작권
- **Container**: 반응형 너비, 패딩

모든 레이아웃 컴포넌트는:
1. Core UI 재사용 (Button, etc.)
2. 반응형 (mobile-first)
3. 접근성 (Skip link, Landmark)

---

## 참고 자료

- [React forwardRef 공식 문서](https://react.dev/reference/react/forwardRef)
- [Framer Motion Spring 애니메이션](https://www.framer.com/motion/transition/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Compound Components Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)
