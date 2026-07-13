# 0018. 콘텐츠 탐색 표면에 의미 기반 반경과 무그림자 상태를 사용한다

Date: 2026-07-13
Status: Accepted; sort-control clause amended by
[0024](0024-use-latest-only-home-feed.md)

## 배경

홈은 모든 공개 글을 탐색하는 첫 화면이다. 기존 구현은 카드와 필터 패널에
drop shadow, hover 이동, 28px 패널 반경을 함께 사용했다. 글 목록은 읽기와
비교가 중심인 표면인데도, 상호작용마다 표면이 떠오르는 느낌이 강해졌다. 또한
모바일에서 공용 container 24px과 카드 20px의 이중 가로 여백으로 읽기 폭이
불필요하게 줄었다.

토스 웹 분석에서는 콘텐츠 카드에 12~16px 반경과 얇은 경계를 쓰고, 그림자보다
여백과 border로 깊이를 구분했다. 반면 filter와 segmented control은 pill 반경을
유지한다. 이 원칙을 그대로 브랜드 복제로 사용하지 않고, Ark의 탐색 화면에서
읽기 우선의 표면 규칙으로 채택한다.

## 결정

- `--radius-action`, `--radius-content`, `--radius-selection`을 각각 액션,
  콘텐츠, 선택 컨트롤의 의미 토큰으로 둔다.
- 홈의 글 카드와 필터 패널은 `--radius-content`와 1px border를 사용하고,
  hover에서 shadow나 translate를 사용하지 않는다.
- 공용 `Container`는 모바일에서 16px, `md` 이상에서 32px의 가로 거터를
  사용한다. 홈 목록 카드는 모바일 내부 가로 여백을 16px로 둔다.
- 카테고리와 정렬 컨트롤은 `--radius-selection`을 사용한다. 선택 상태는
  색과 border로만 표현한다.
- modal, drawer처럼 실제로 배경 위에 떠야 하는 overlay와 블로그 시각화는
  이 규칙의 적용 대상이 아니다.
- 정렬은 `aria-pressed` 상태와 항목 순서가 함께 바뀌는 컴포넌트 테스트로
  회귀를 막는다.

## 결과

- 홈 피드는 카드별 이동 효과 없이도 hover와 선택 상태를 읽을 수 있다.
- 같은 종류의 UI가 크기가 아닌 역할로 반경을 선택한다.
- 모바일 홈의 첫 글 카드는 화면 가장자리에서 16px만 떨어져 읽기 폭을 보존한다.
- 최신순과 인기순 전환이 실제 순서 변경까지 검증된다.

## 검토한 대안

- 모든 표면에서 shadow를 제거하기: drawer와 command palette의 elevation
  단서까지 사라지므로 채택하지 않는다.
- 모든 컴포넌트에 하나의 16px 반경을 사용하기: filter와 segmented control의
  조작 의미가 약해지므로 채택하지 않는다.
- hover translate와 shadow를 유지하기: 상호작용은 더 눈에 띄지만, 읽기 중심
  탐색 화면에는 과도한 장식이 된다.
