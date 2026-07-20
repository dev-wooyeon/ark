# 0045. Resume 회사 열에는 팀 맥락만 표시한다

Date: 2026-07-20
Status: Accepted

## 배경

Resume 상단은 백엔드 엔지니어와 데이터 플랫폼이라는 역할을 이미 제공한다.
홈은 현재 만드는 서비스인 9.81park와 해당 링크를 설명한다.

회사 열에서 역할과 서비스 링크를 다시 반복하면 좁은 열의 밀도가 높아지고,
각 화면이 담당하는 정보가 겹친다.

## 결정

- Resume의 회사 열은 회사명, 팀명, 재직 기간만 표시한다.
- 모노리스는 `IoT Team`, 엑심베이는 `PG Platform Team`으로 팀 맥락을 표시한다.
- 9.81park 서비스 링크는 Resume에서 제거하고 홈의 소개 문장에만 둔다.
- Resume의 프로젝트 행은 여전히 프로젝트 설명과 직접 대응하는 회고글 링크를
  제공한다.

## 결과

- 상단 Role, 홈 서비스 소개, Resume 회사 열의 정보 책임이 분리된다.
- 회사 열은 어떤 조직 맥락에서 프로젝트를 수행했는지 빠르게 보여준다.
- 서비스·회사 링크보다 프로젝트와 회고글의 증거 연결이 우선된다.

## 검토한 대안

- 회사와 서비스 링크를 모두 표시한다: 탐색성은 높지만 역할과 서비스 설명이
  반복된다.
- 회사 링크만 표시한다: 조직 정보는 늘지만 프로젝트 맥락을 즉시 보여주지
  못한다.
- 회사명과 팀명만 표시한다: 가장 작은 정보로 조직 맥락을 제공한다.

## 검증

- ResumePage 컴포넌트 테스트로 팀명 표시와 9.81park 링크의 부재를 검증한다.
- Playwright 모바일 Resume에서 `IoT Team` 표시를 검증한다.

## Related History

- [ADR 0038](0038-use-jetbrains-mono-for-home-statement.md): 홈 소개 문장의
  서체 범위
- [ADR 0041](0041-use-two-level-project-summaries-in-resume.md): Resume 프로젝트의
  간략 소개와 상세 설명 분리
- [ADR 0044](0044-link-direct-project-retrospectives-from-resume.md): 프로젝트와
  직접 대응하는 회고글 연결
