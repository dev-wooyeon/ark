# 0050. 시리즈 탐색을 제거하고 발행 정책을 repository 목록 경계에서 강제한다

Date: 2026-07-22
Status: Accepted

## 배경

시리즈 탐색 UI, `/engineering/series` route, 글 상세의 시리즈 네비게이션은
이미 제거됐지만 redirect, sitemap, 컴포넌트, model helper가 남아 있었다.
`/series`는 더 이상 의미 있는 목적지가 없는데 legacy query parameter로
리다이렉트되고 있었다.

Archive는 ADR 0036에서 카테고리 필터를 옮긴다고 했지만, ADR 0030의 날짜·제목
행 목록만 유지하는 쪽으로 정리됐다. `CategoryFilter`는 사용처 없이 남아
있었다.

발행 정책의 Tech core 점수 하한과 featured 자격은 `policy.test.ts`와 content
audit에서만 검증됐다. `visibility: public`만 잘못 설정하면 repository가 그대로
피드, RSS, sitemap, static path에 노출할 수 있었다.

## 결정

- 시리즈 탐색 surface를 제거한다.
  - `/series`는 `/engineering`으로 리다이렉트한다.
  - `/engineering/series/[seriesId]`, `SeriesNavigation`, `series-group` helper,
    sitemap의 series URL을 제거한다.
  - `meta.json`의 `series` 필드는 과거 원고와 audit 경고를 위해 schema에
    남긴다.
- Archive는 날짜·제목 행 목록만 유지하고 카테고리 필터 UI를 두지 않는다.
  - 사용되지 않는 `CategoryFilter` 컴포넌트를 제거한다.
- `blog/services/policy.ts`에 `isListedPost`와 `filterListedPosts`를 추가한다.
  - public 글은 repository 목록, 상세 조회, static params에서 policy threshold를
    통과해야 한다.
  - `includePrivate: true`는 개발 preview와 audit용으로 private 글과 policy
    미달 public 글을 함께 본다.
- ADR 0036의 `/series`와 Archive 카테고리 필터 기대는 이 결정으로 대체된다.

## 결과

- 시리즈 관련 dead route와 UI가 사라지고 `/series` 북마크는 Engineering으로
  정리된다.
- Archive는 단순한 전체 아카이브로 유지된다.
- public Tech 글의 점수 미달이나 잘못된 featured 설정이 production listing에
  새지 않는다.
- policy 숫자의 단일 원본은 계속 `policy.ts`와 `policy.json`이다.

## 검토한 대안

- 시리즈 인덱스만 복원: 이미 제거한 탐색 경험을 되살리므로 채택하지 않는다.
- Archive에 카테고리 필터 복원: Engineering/Life route가 이미 분류 탐색을 담당한다.
- policy 검증을 test-only로 유지: 실수 한 번으로 public 노출이 가능해 남는
  위험이 크다.

## Related History

- [ADR 0030](0030-use-date-title-rows-for-home-archive.md): Archive 행 표현
- [ADR 0031](0031-adopt-a-single-paper-theme-and-retire-command-palette.md):
  검색 도메인 제거
- [ADR 0036](0036-separate-philosophy-home-from-content-archive.md): 홈과 Archive
  분리
- [ADR 0048](0048-centralize-blog-publication-rules.md): policy 모듈 단일화
- [ADR 0049](0049-share-publication-policy-data-with-audit.md): audit와 policy
  데이터 공유
