# 0010. Targeted Documentation Harness를 사용한다

Date: 2026-05-07
Status: Accepted

참고: ADR 0013에서 `ARCHITECTURE.md`를 제거했다. 현재 harness는 `AGENTS.md`,
`docs/README.md`, `docs/adr/*.md`를 검사한다.

## 배경

ADR 작성 조건이 `AGENTS.md`와 `docs/adr/README.md`에 추가되면서, 문서 규칙도
반복적으로 검증할 필요가 생겼다. 하지만 기존 `npm run lint:md`는 전체
`**/*.md`와 `**/*.mdx`를 검사한다. 과거 글과 일부 guide에 남아 있는
markdownlint 이슈 때문에, 현재 상태에서는 문서 변경 검증용 harness로 쓰기
어렵다.

문서 작업마다 전체 markdownlint 실패를 무시하면, 실제로 중요한 ADR/규칙 문서
오류도 함께 묻힌다.

## 결정

핵심 문서만 대상으로 하는 `npm run verify:docs`를 추가한다. 이 command는
`tooling/scripts/verify-docs.mjs`를 실행하며 다음을 검증한다.

- `docs/README.md`에 등록된 명시적 문서 경로가 실제로 존재하는지 확인한다.
- `AGENTS.md`와 `docs/adr/README.md`가 같은 ADR 작성 조건을 포함하는지
  확인한다.
- `docs/adr/*.md` 파일이 ADR 인덱스에 등록되어 있는지 확인한다.
- `AGENTS.md`, `docs/README.md`, `docs/adr/*.md`에 markdownlint를 실행한다.

`npm run test:ci`에도 `npm run verify:docs`를 포함한다.

## 결과

- ADR과 저장소 규칙 문서는 전체 Markdown 부채와 분리해 안정적으로 검증된다.
- ADR 파일을 추가하고 인덱스 갱신을 잊는 실수를 줄인다.
- 문서 인덱스의 stale path를 더 빨리 발견할 수 있다.
- 전체 Markdown lint 부채는 별도 정리 과제로 남는다.

## 검토한 대안

- 기존 `npm run lint:md`만 사용: 범위가 넓고 현재 실패가 많아 문서 변경용
  harness로 신뢰하기 어렵다.
- 모든 Markdown lint 이슈를 먼저 정리: 이상적이지만 이번 목표보다 범위가
  크고 글 콘텐츠까지 광범위하게 건드린다.
- PR 리뷰 체크리스트에만 의존: 자동 검증이 없어 반복 실수를 줄이기 어렵다.

## 관련 히스토리

- `ee9cb14` (2026-05-07): ADR 문서 체계와 ADR 작성 조건 추가.
