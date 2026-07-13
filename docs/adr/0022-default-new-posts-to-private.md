# 0022. 새 글을 명시적으로 검토한 뒤 공개한다

Date: 2026-07-13
Status: Accepted

## 배경

기존 공개 정책은 새 글과 `visibility`가 없는 글을 `public`으로 처리했다. 글을
만드는 즉시 placeholder 본문과 비어 있는 품질 점수가 공개 후보가 되어, 작성자가
공개 상태를 되돌리는 방식으로 운영해야 했다.

Ark는 작성 중인 글을 저장소에 오래 보관하고 개발 환경에서 private 글을 미리 볼
수 있다. 이 흐름에서는 누락을 공개로 해석하는 것보다 명시적인 승격을 요구하는
편이 안전하다.

## 결정

- 새 글 생성기는 `visibility: private`를 기록한다.
- frontmatter에 `visibility`가 없으면 `private`로 해석한다.
- 콘텐츠 감사도 누락된 `visibility`를 `private`로 해석한다.
- 공개할 때는 리뷰를 마친 작성자가 `visibility: public`을 명시한다.

## 결과

- placeholder와 검토 전 원고가 실수로 피드, 검색, RSS, sitemap에 포함되지 않는다.
- 기존 공개 글은 `visibility: public`이 명시되어 있어 상태가 바뀌지 않는다.
- 공개는 생성의 부수 효과가 아니라 의도적인 편집 결정이 된다.

## 검토한 대안

- 기존 public 기본값 유지: 추가 작업은 없지만 실수 한 번으로 미완성 글이 공개될
  수 있다.
- 디렉터리 이름으로 draft 구분: repository와 작성 도구가 같은 규칙을 중복해서
  알아야 하고 이름 변경 비용이 생긴다.
- 품질 점수만으로 자동 공개: 정량 점수로 NDA, 출처, 현재성 같은 편집 판단을
  대체할 수 없다.

## Related History

- `21a4a6a`: 공개 정책과 메타데이터 도입
- `17aee8f`: 개발 환경 private 글 미리보기 허용
