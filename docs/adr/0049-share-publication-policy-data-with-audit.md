# 0049. 발행 정책 데이터를 content audit과 공유한다

Date: 2026-07-22
Status: Accepted

## 배경

`blog/services/policy.ts`는 앱과 테스트의 발행 기준을 소유하지만,
`content:audit`은 Node가 직접 실행하는 `.mjs` 스크립트다. 이 스크립트에 core
점수 하한과 featured 기준을 다시 쓰면 정책 변경 후 release check와 앱 검증이
서로 다른 결과를 낼 수 있다.

## 결정

- `blog/services/policy.json`을 Node와 TypeScript가 함께 읽는 발행 정책 데이터의
  원본으로 둔다.
- `policy.ts`는 JSON을 import하고 visibility, 점수, featured 자격 helper를
  제공한다.
- `content:audit`은 같은 JSON을 import해 core 평가 항목, 점수 하한, featured
  자격과 요약을 계산한다.

## 결과

- 정책 기준을 바꾸면 앱, policy test, content audit이 같은 값을 사용한다.
- Node audit에 TypeScript runtime loader를 추가하지 않는다.
- 글별 featured 선택은 계속 `meta.json`의 책임이다.

## 검토한 대안

- audit에 숫자를 유지: 정책 변경 시 기준 불일치가 다시 생긴다.
- audit에서 `policy.ts`를 직접 import: plain Node 실행에 TypeScript loader가
  필요하다.
- JSON 대신 별도 build 산출물 생성: 현재 한 정책 파일에는 불필요한 build 단계다.

## Related History

- `0f3d806`: 발행 정책을 `policy.ts`로 중앙화
