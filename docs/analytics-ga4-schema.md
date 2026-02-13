# GA4 Event Schema

## Measurement ID

- 환경변수: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- 적용 위치: `/Users/noah/workspace/personal/eunu.log/src/app/layout.tsx`

## Event Names

- `view`: 페이지 조회
- `click`: CTA/결과 클릭
- `search`: 검색 실행 및 결과 수
- `error`: 라우트/검색 오류 이벤트
- `theme`: 다크/라이트 전환

## Common Params

- `page_path`: 현재 경로
- `device`: `mobile` | `desktop`
- `theme`: `light` | `dark`

## Screen Hook Points

- 페이지 조회: `PageViewTracker`
- 클릭: `HeroSection`, 검색 결과 클릭
- 검색: `CommandPalette` 쿼리 변경(디바운스)
- 오류: route-level `error.tsx`, 검색 빈결과
- 테마: `ThemeToggle`

## DebugView 점검 체크리스트

- [ ] 홈 진입 시 `view` 확인
- [ ] Hero CTA 클릭 시 `click` 확인
- [ ] 검색어 입력 시 `search` 확인
- [ ] 빈결과 검색 시 `error` 확인
- [ ] 테마 전환 시 `theme` 확인
