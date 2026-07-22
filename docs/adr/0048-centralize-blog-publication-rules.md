# 0048. 블로그 발행 규칙을 단일 policy 모듈로 확장한다

Date: 2026-07-22
Status: Accepted

## 배경

ADR 0047은 public/private visibility 판단을 `publication-policy.ts`로 분리했다.
그러나 공개 Tech 글의 core 점수 하한과 featured 자격 조건은 테스트 안에 남아
있어, 사람이 읽는 guide와 실행되는 검증의 기준값을 함께 바꿔야 했다.

## 결정

- `blog/services/publication-policy.ts`를 `blog/services/policy.ts`로 바꾼다.
- `policy.ts`는 visibility, 공개 Tech 글의 core 리뷰 하한, featured 자격 조건을
  함께 소유한다.
- `meta.json`은 글별 visibility, 점수, featured 선택을 계속 소유한다. featured
  slug 목록이나 series의 현재 공개 상태를 policy에 복제하지 않는다.
- frontmatter의 값 범위 검증은 입력 schema 책임으로, 개발 환경 preview는 상세
  route의 단일 호출 책임으로 유지한다.

## 결과

- 실행되는 공개 기준값은 `policy.ts` 한 곳에서 바꾼다.
- guide는 정책의 의미와 운영 절차를 설명하고, threshold 숫자의 별도 원본이 되지
  않는다.
- 수동 큐레이션 데이터와 발행 규칙이 이중 관리되지 않는다.

## 검토한 대안

- featured slug를 policy에 등록: frontmatter의 `featured`와 두 원본이 된다.
- 점수 기준을 frontmatter schema로 이동: 유효한 입력값과 공개 판단을 섞는다.
- route별 preview 조건까지 이동: 현재 한 파일의 두 호출만 공유하므로 불필요한
  wrapper가 된다.

## Related History

- `c43af1e`: visibility 정책을 `publication-policy.ts`로 분리
