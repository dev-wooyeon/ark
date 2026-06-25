# 0017. 개발 환경에서 private 글 상세 미리보기를 허용한다

Date: 2026-06-19
Status: Accepted

## 배경

블로그 글은 `visibility: private`이면 공개 목록, RSS, sitemap, static route
params에서 제외된다. 이 정책은 초안이 실수로 공개되는 일을 막는다.

문제는 같은 필터가 개발 환경의 상세 페이지에도 적용되어 private 초안을 직접
URL로 열 수 없다는 점이다. 새 글의 이미지, MDX 렌더링, 목차, 본문 레이아웃을
로컬에서 확인하려고 해도 상세 페이지가 404가 되어 실제 렌더링 문제와 공개 정책
문제를 구분하기 어렵다.

## 결정

- `generateStaticParams`는 계속 public 글만 반환한다.
- 목록, RSS, sitemap, 일반 feed 조회도 계속 public 글만 사용한다.
- `NODE_ENV === 'development'`일 때만 `BlogPostPage` 상세 페이지와 metadata
  생성에서 private 글 조회를 허용한다.
- production에서는 private 글 상세 페이지도 계속 404로 처리한다.

## 결과

- 초안은 production 공개 표면에 노출되지 않는다.
- 로컬 개발 서버에서는 private 글의 MDX와 이미지를 직접 URL로 검증할 수 있다.
- 이미지 렌더링 문제와 private 공개 정책 문제를 분리해서 디버깅할 수 있다.
- 검증은 repository의 private 필터 단위 테스트와 로컬 개발 서버 HTTP 응답
  확인을 함께 사용한다.

## 검토한 대안

- 초안 검증 때마다 `visibility`를 `public`으로 바꾸기: preview는 쉽지만, 변경을
  되돌리지 않고 배포할 위험이 있다.
- 별도 preview route 추가: 정책 분리는 더 명확하지만 현재 규모에서는 route와
  테스트가 늘어난다.
- 기존처럼 private 상세를 항상 404로 유지하기: 공개 안전성은 높지만, 로컬에서
  이미지와 MDX 문제를 검증하기 어렵다.

## Related History

- 초안 작성 중 `llm-wiki-build-retrospective` private 글의 이미지 파일은
  정적으로 200 응답했지만 상세 페이지가 404여서 렌더링을 확인할 수 없었다.
