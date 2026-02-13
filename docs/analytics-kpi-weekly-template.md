# GA4 KPI Dashboard / Weekly Report Template

## KPI 정의

- 홈 -> 글 클릭률: `click(target=home_blog_cta)` / `view(page_path=/)`
- 검색 결과 클릭률: `click(target=command_palette_result)` / `search`
- 에러율: `error` / `view`
- 테마 전환율: `theme` / `view`

## 대시보드 구성 제안

- 기간: 최근 7일, 최근 28일 비교
- 분해 기준: `device`, `page_path`, `theme`
- 필수 차트
  - 일자별 `view` 추이
  - CTA 클릭률 추이
  - 검색 시도 대비 결과 클릭률
  - 에러 이벤트 추이

## 주간 리포트 템플릿

```md
# 주간 KPI 리포트 (YYYY-MM-DD ~ YYYY-MM-DD)

## 1) 이번 주 요약

- 핵심 변화 3줄

## 2) KPI 현황

- 홈 -> 글 클릭률: xx% (전주 대비 +x.x%p)
- 검색 결과 클릭률: xx% (전주 대비 +x.x%p)
- 에러율: xx% (전주 대비 -x.x%p)
- 테마 전환율: xx% (전주 대비 +x.x%p)

## 3) 원인 분석

- 상승/하락의 주요 화면과 이벤트

## 4) 다음 액션

- 액션 1 (담당/기한)
- 액션 2 (담당/기한)
```
