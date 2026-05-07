# 0007. Umami와 Supabase 조회수를 사용한다

Date: 2026-03-03
Status: Accepted

## 배경

분석 스택은 두 단계로 변했다. 먼저 Supabase 조회수와 GA4 이벤트 추적이
추가됐다. 이후 self-hosted Umami 분석이 들어왔고, 처음에는 GA4와 함께
동작했다. 뒤따른 리팩터링에서 GA4는 제거됐고 Umami가 유일한 클라이언트
분석 provider가 됐다.

조회수는 분석 이벤트와 분리되어 있다. 조회수는 사용자에게 보이는 글
메타데이터이며 서버 측 중복 방지가 필요하기 때문이다.

## 결정

클라이언트 분석에는 Umami를 사용하고, 공개 글 조회수 저장에는 Supabase
RPC 기반 저장소를 사용한다.

## 결과

- 클라이언트 분석은 `NEXT_PUBLIC_UMAMI_URL`과
  `NEXT_PUBLIC_UMAMI_WEBSITE_ID`로 제어되는 더 가벼운 경로가 된다.
- 분석 이벤트는 Umami 준비 전까지 큐에 쌓을 수 있다.
- 조회수는 Supabase 환경 변수에 의존하며, 누락 시 graceful degradation이
  필요하다.
- 조회수 중복 방지 동작은 RPC가 소유한다.

## 검토한 대안

- GA4-only 분석: 중복 추적과 외부 의존면을 줄이기 위해 제거했다.
- 보이는 조회수까지 Umami에 의존: 공개 카운터에는 애플리케이션이 소유한
  read와 dedupe semantics가 필요해 부족하다.
- DB-only 분석: 가벼운 페이지와 인터랙션 이벤트 추적을 잃는다.

## 관련 히스토리

- `1cd4e06` (2026-02-13): Supabase 블로그 조회수와 분석 문서 추가.
- `42e7592` (2026-02-27): self-hosted Umami 분석 추가.
- `243e32e` (2026-03-03): GA4 제거와 Umami-only 전환.
- `b4ae7c2` (2026-04-21): 24시간 조회수 중복 방지 추가.
