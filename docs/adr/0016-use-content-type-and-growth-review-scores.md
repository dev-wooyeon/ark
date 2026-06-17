# 0016. 글 형식과 성장 리뷰 점수를 분리한다

Date: 2026-06-17
Status: Accepted

## 배경

기존 글 메타데이터는 `category: Tech | Life`와 `qualityReview`를 사용했다.
하지만 `Life`에는 회고, 일기성 에세이, 책/여행 리뷰가 함께 들어가고, `Tech`
에도 회고형 글과 설명형 글이 함께 존재한다. `category`만으로 글의 형식과 독자
기대를 표현하면 주제 축과 형식 축이 섞인다.

또한 기존 `qualityReview`의 `philosophy`, `design`, `implementation`,
`brandFit`은 공개 기술 글 정책에는 유용하지만, Life 글과 전반적인 글쓰기 성장
피드백을 기록하기에는 축이 부족했다.

## 결정

- `category`는 계속 `Tech | Life` 주제 축으로 둔다.
- 글 형식은 `contentType: essay | retrospective | review`로 분리한다.
- `qualityReview`는 기존 점수를 유지하면서 `clarity`, `structure`, `evidence`,
  `usefulness`, `originality`, `polish`를 추가한다.
- 점수는 작성과 리뷰를 위한 내부 운영 도구로 사용하고, 공개 UI에는 노출하지
  않는다.
- repo-local skill `.agents/skills/blog-growth-review`를 두어 contentType 판정,
  점수 채점, 공개 가능성 판단, 개선 우선순위 제안을 반복 가능하게 한다.

## 결과

- Life 안에서 에세이, 회고, 리뷰를 구분할 수 있다.
- Tech 글도 설명형 글과 실제 작업 회고를 같은 기준으로 구분할 수 있다.
- `content:audit`는 contentType 분포, 미채점 글, 개선 우선순위를 출력한다.
- v1에서는 Life 점수 미달을 공개 차단 조건으로 사용하지 않는다.
- 공개 UI 필터나 배지는 충분히 안정된 뒤 별도 결정으로 다룬다.

## 검토한 대안

- `Life`를 top-level category로 쪼개기: 탐색은 단순해지지만 `Tech`에도 회고가
  있어 주제와 형식 축이 다시 섞인다.
- tag만 사용하기: 현재도 `회고`, `Book`, `Travel` 같은 tag가 있지만 필수성과
  검증이 약해 audit과 스킬이 안정적으로 사용하기 어렵다.
- 점수화를 공개 UI에 노출하기: 제품화 가능성은 있지만, v1에서는 작성 품질 개선
  목적이 먼저라 내부 운영 도구로 제한한다.
