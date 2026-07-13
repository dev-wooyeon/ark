# 0025. OG 이미지 route에 Node.js runtime을 사용한다

Date: 2026-07-13
Status: Accepted

## 배경

`/api/og`는 한글 제목을 안정적으로 렌더링하기 위해 2.72MB
`Pretendard-Bold.ttf`를 번들에 포함한다. Edge runtime으로 생성한 Vercel
함수는 1.86MB였고, Preview 배포의 1MB 제한을 초과했다. Next.js
production build는 성공했지만 출력물을 배포하는 단계에서 실패했다.

한글 글리프를 줄인 폰트 subset은 크기를 낮출 수 있지만, 블로그 제목과 태그에
필요한 문자가 빠질 위험과 별도 생성 절차가 생긴다. 외부 URL에서 폰트를 읽으면
함수 크기는 줄지만 OG 이미지 생성이 네트워크 상태에 의존한다.

## 결정

- `/api/og` Route Handler는 `nodejs` runtime을 명시한다.
- 번들된 Pretendard 폰트는 `node:fs/promises`의 `readFile`로 지연 로드한다.
- 폰트 데이터 Promise를 module scope에 캐시해 같은 인스턴스에서 반복해서
  파일을 읽지 않는다.
- route 테스트는 실제 번들 폰트로 PNG를 생성하고 Node.js runtime 설정을 함께
  검증한다.
- 배포 검증은 Vercel Preview가 `Ready` 상태인지와 실제 OG endpoint가 PNG를
  반환하는지 확인한다.

## 결과

- Edge Function 크기 제한과 무관하게 전체 한글 폰트를 유지할 수 있다.
- OG 이미지 생성에 외부 폰트 서버가 필요하지 않다.
- Edge runtime 대비 실행 위치와 cold start 특성은 달라질 수 있다.
- 폰트 파일 크기 자체는 저장소와 Node.js 함수 산출물에 남는다.

## 검토한 대안

- 한글 폰트 subset 생성: Edge runtime을 유지할 수 있지만 글리프 누락 방지와
  생성 절차를 지속해서 관리해야 한다.
- 외부 폰트 URL을 runtime에 fetch: Edge bundle은 작아지지만 네트워크 장애가
  OG 이미지 생성 실패로 이어진다.
- 커스텀 폰트 제거: 배포는 단순해지지만 한글 렌더링의 일관성과 기존 테스트
  의도를 잃는다.

## Related History

- `5c4bcaf`: OG 이미지에 번들 한글 폰트 도입
