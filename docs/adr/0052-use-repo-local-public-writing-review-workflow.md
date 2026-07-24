# 0052. 공개 글 검토에 repo-local writing review workflow를 사용한다

Date: 2026-07-24
Status: Accepted

## 배경

에세이와 회고글은 기술 문서와 다른 공개 기준을 가진다. 문장 품질만
확인하면 독자 약속, 개인 경험의 구체성, 공개 위험, 제목과 도입의 적합성을
놓칠 수 있다.

기존 `blog-growth-review`는 점수화와 개선 우선순위를 담당하지만, 공개 가능
여부를 판단하는 전체 편집 흐름과 기술 문서 라우팅을 담당하지 않는다.

## 결정

- `.agents/skills/ark-public-writing-review`를 에세이와 회고글의 공개 전
  검토 workflow로 사용한다.
- workflow는 `docs/blog-quality-guide.md`, 대상 글, `meta.json`을 먼저 읽고
  독자 약속, 구조, 구체성, 독창성, 유용성, 문장, 공개 안전성을 검토한다.
- 결과는 `publish`, `revise`, `block`으로 구분한다. `visibility`는 자동으로
  바꾸지 않는다.
- Tech 글은 `philosophy`, `design`, `implementation` 점수 누락을
  `verify`로 처리한다. 공개 결정에서는 `block`, private 상태에서는
  `revise`로 판정한다.
- 기술 문서는 `technical-writing-pipeline`으로 라우팅하고, 제목과 성장
  점수 검토는 각 repo-local skill의 책임으로 유지한다.
- release readiness 요청에서는 `content:audit`, 필요한 경우 `lint`와
  `build`를 실행한다.

## 결과

- 에세이와 회고글도 작성 후 공개까지 같은 검토 기준을 반복 적용할 수 있다.
- 점수화 결과와 편집 판정을 분리해, 점수 평균이 공개 위험을 가리지 않는다.
- private 기본 정책을 유지하면서 공개 전 확인 항목을 명시할 수 있다.
- 기술 문서용 workflow와 개인 글용 workflow가 서로의 범위를 침범하지 않는다.

## 검토한 대안

- 하나의 generic prompt 사용: 빠르지만 저장소 정책과 검토 결과 형식이
  고정되지 않는다.
- `blog-growth-review`에 공개 판정까지 추가: 점수화와 편집 안전성의 책임이
  섞인다.
- 기술 문서와 에세이를 하나의 workflow로 통합: 독자 약속과 검증 기준이
  달라 불필요한 분기와 누락이 생긴다.

## 검증

- 대상 글에 `npm run content:audit`, `npm run lint`, `npm run build`를
  실행한다.
- skill 문서의 출력 형식과 Tech 점수 누락 규칙을 리뷰한다.

## Related History

- `7d09712`: 공개 글 리뷰 skill과 말하기 에세이 추가
- [ADR 0022](0022-default-new-posts-to-private.md): 새 글 private 기본값
- [ADR 0023](0023-run-the-release-quality-gate-in-ci.md): release quality gate
- [ADR 0026](0026-use-repo-local-title-review-skill.md): repo-local 제목 리뷰
- [ADR 0016](0016-use-content-type-and-growth-review-scores.md): 글 형식과 성장 점수 분리
