# 0047. 공개 정책을 blog 도메인 모듈로 분리한다

Date: 2026-07-22
Status: Accepted

## 배경

글 목록의 visibility 필터와 상세 조회의 private 거부가 repository 안에 따로
있었다. 두 조건이 갈라져 있으면 목록, static params, production 상세 경로가
서로 다른 공개 범위를 판단할 수 있다.

ADR 0008의 새 글 public 기본값은 ADR 0022에서 private 기본값으로 대체됐다.
과거 ADR은 보존하되, 현재 정책과 구현 경계를 이 기록으로 명확히 한다.

## 결정

- `blog/services/publication-policy.ts`가 visibility 판단과 목록 필터를 소유한다.
- visibility가 없는 글은 schema 기본값과 같은 private로 해석한다.
- repository는 파일 탐색과 MDX import만 맡고, 목록과 상세 조회 모두 정책
  모듈을 통해 공개 범위를 판단한다.
- 공개 정책 테스트는 private 기본값과 명시적인 development preview를 검증한다.

## 결과

- public 목록, static params, production 상세 조회가 같은 visibility 규칙을 쓴다.
- 품질 점수와 featured 기준은 기존 문서와 검증의 책임으로 유지한다.
- 새 공개 조건을 추가할 때는 repository 호출부를 수정하지 않고 정책 모듈에서
  검토할 수 있다.

## 검토한 대안

- repository에 조건을 유지: 파일 접근은 가깝지만 목록과 상세의 정책 중복이 남는다.
- route별 필터링: route, RSS, sitemap이 같은 규칙을 반복해야 한다.
- 품질 점수를 즉시 runtime 차단 조건으로 이동: 기존 수동 공개 검토의 범위를
  넓히므로 별도 결정이 필요하다.

## Related History

- `21a4a6a`: visibility 기반 공개 정책 도입
- `17aee8f`: private 기본값과 development preview 도입
