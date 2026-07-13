# 0021. 무거운 MDX 시각화를 글 단위로 로드한다

Date: 2026-07-13
Status: Accepted

## 배경

Ark의 공용 MDX 컴포넌트 매핑은 모든 글에 적용된다. Three.js와
React Three Fiber를 사용하는 알고리즘 시각화까지 이 매핑에 등록하면,
시각화가 없는 일반 글도 해당 dynamic import와 클라이언트 chunk 경계를
공유한다. 콘텐츠와 무관한 무거운 렌더링 라이브러리가 기본 글 읽기
경로에 포함될 이유가 없다.

현재 `@mdx-js/loader` 기반 커스텀 webpack 파이프라인과
`blog/ui/visualization/` 경계는 유지해야 한다.

## 결정

- 제목, 문단, 이미지, Mermaid처럼 대부분의 글이 공유하는 컴포넌트만
  `getMDXComponents` 기본 매핑에 두다.
- Three.js 기반 시각화는 `blog/ui/mdx/visualization-components.tsx`의
  client-side `React.lazy` 경계에서 각 컴포넌트를 개별
  `dynamic import`한다.
- 시각화를 사용하는 MDX만 해당 모듈을 명시적으로 import한다.
- 현재 커스텀 MDX webpack rule과 시각화 구현 위치는 변경하지 않는다.
- 공용 매핑에 무거운 시각화가 다시 등록되지 않도록 경계 테스트를
  유지한다.

## 결과

- 일반 글은 시각화와 Three.js 모듈 경계를 로드하지 않는다.
- 시각화 글은 MDX import 한 줄로 사용 의도와 번들 비용을 드러낸다.
- 시각화를 새로 추가할 때 공용 매핑 등록 대신 글 단위 import가
  필요하다.
- 글 소스에 명시적 import가 추가되지만, 불필요한 초기 번들 비용을
  피하는 편이 읽기 경로에 더 적합하다.

## 검토한 대안

- 모든 시각화를 공용 매핑에 유지하기: 글 작성은 편하지만 일반
  글의 모듈 그래프에 무거운 의존성이 연결된다.
- 로더가 MDX 본문을 스캔해 시각화를 자동 등록하기: 작성 편의는
  높지만 빌드 로더와 콘텐츠 문법의 암묵적 결합을 추가한다.
- 시각화를 각 글 폴더로 옮기기: 재사용 경계가 사라지고
  `blog/ui/visualization/` 모듈 규칙을 훼손한다.

## Related History

- [ADR 0002](0002-keep-custom-mdx-webpack-pipeline.md): 커스텀 MDX webpack 파이프라인
  유지
- [ADR 0006](0006-isolate-visualization-heavy-components.md): 시각화 전용 모듈 경계
- `5ddb51b`, `f4d14df`: 시각화를 공용 MDX 매핑으로 노출한 기존
  구현
