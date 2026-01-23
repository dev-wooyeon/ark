# 🚀 Eunu.log Action Plan

이 문서는 `README.md`, `refactoring-backlog.md`, `PRD.md`를 기반으로 정리된 통합 개발 계획입니다.

## 📋 우선순위 작업 순서

### 1단계: 기반 다지기 (Refactoring Focus)
안정적인 기능 확장을 위해 기술 부채를 먼저 해결합니다.
- [ ] **타입 시스템 개선** `High`
    - `Feed`와 `FeedData` 인터페이스 통합
    - `gray-matter` 파싱 결과의 엄격한 타입 정의 (any 제거)
- [ ] **데이터 유틸리티 모듈화** `High`
    - `feeds.ts`의 로직 분리 및 에러 처리 강화
    - `useFeedData` 커스텀 훅 개발 (데이터 페칭 추상화)
    - `useFeedFilter` 커스텀 훅 개발 (필터링 로직 분리)

### 2단계: MVP 기능 완성 (Feature Focus)
Phase 1 및 Phase 4 일부 기능을 완성하여 기본 사용성을 확보합니다.
- [ ] **피드 필터링 시스템** `Medium`
    - 카테고리/태그 기반 필터링 UI 구현
    - URL 쿼리 파라미터와 필터 상태 동기화
- [ ] **SEO 및 메타 태그** `Medium`
    - 페이지별 메타 태그 적용 점검
    - 사이트맵 생성

### 3단계: 인터랙티브 경험 (Visual Focus)
"기억에 남는 경험"이라는 핵심 가치를 전달하기 위한 애니메이션 작업을 진행합니다.
- [ ] **페이지 전환 애니메이션** `Medium`
    - Framer Motion 도입 및 페이지 진입/이탈 효과 구현
- [ ] **마이크로 인터랙션** `Low`
    - 버튼 및 카드 호버 효과 고도화

### 4단계: 3D 및 고급 기능 (Advanced)
- [ ] **Three.js Hero 섹션** `Low`
    - 마우스 반응형 3D 오브젝트 구현
- [ ] **다크 모드** `Low` (Phase 4)

---

## 📅 세부 작업 계획 (Immediate Next Steps)

가장 먼저 **1단계: 기반 다지기**의 **타입 시스템 개선**부터 시작하는 것을 제안합니다.

1. `src/types` 디렉토리 점검 및 인터페이스 통합
2. `feeds.ts` 리팩토링 및 테스트
3. `useFeedData` 훅 구현 및 컴포넌트 적용
