# 0038. 홈 소개 문장에 JetBrains Mono를 사용한다

Date: 2026-07-20
Status: Accepted

## 배경

Ark의 홈은 두 줄의 소개 문장만으로 현재의 작업과 다음 탐색을 전달한다. 기본
Pretendard만 사용하면 shell의 다른 텍스트와 같은 밀도로 읽혀, 개발자로서의
정체성과 서비스 링크가 첫 화면에서 충분히 구분되지 않는다.

저장소에는 이미 자체 호스팅한 JetBrains Mono 서체와 `--font-mono` 토큰이
있다. 새 외부 폰트를 추가하지 않고도, 기술적인 문장을 한정된 범위에서 다르게
보이게 할 수 있다.

## 결정

- 홈의 소개 문장만 `--font-mono`를 사용한다. 본문, Archive, Resume의 기본
  Pretendard 서체는 유지한다.
- 소개 문장은 14px, medium weight, 24px line-height로 둔다. 데스크톱 1200px
  기준 콘텐츠 열에서 첫 문장과 현재 작업 문장이 각각 한 줄에 머물도록 한다.
- `@9.81park`는 밑줄 링크로 표현하고 `https://www.981park.com`을 새 창에서
  연다. 새 창 링크에는 `noopener noreferrer`를 설정한다.

## 결과

- 첫 화면의 소개 문장은 단순한 인터페이스 레이블과 구분되며, 서버 시스템을
  만드는 정체성을 짧고 기술적인 인상으로 전달한다.
- 전체 사이트의 읽기용 기본 서체와 콘텐츠 밀도는 바뀌지 않는다.
- 서비스의 실제 웹사이트는 현재 페이지를 이탈하지 않고 확인할 수 있다.

## 검토한 대안

- 기본 Pretendard를 유지한다: 현재 shell과 자연스럽지만 소개 문장의 구분감이
  약하다.
- 홈 전체를 16px JetBrains Mono로 둔다: 더 강한 인상은 만들지만 1200px
  콘텐츠 열에서 첫 문장이 줄바꿈되어 두 줄 구성이 깨진다.
- 다른 외부 monospace 서체를 로드한다: 별도 네트워크 비용과 fallback 검증이
  필요하지만, 이미 검증된 자체 호스팅 서체로 얻는 이점보다 작다.

## 검증

- HomePage 컴포넌트 테스트로 서비스 링크 URL, 새 창 이동, 보안 rel 속성을
  검증한다.
- Playwright smoke test로 렌더된 소개 문장이 JetBrains Mono를 사용하는지와
  서비스 링크의 새 창 이동을 검증한다.

## Related History

- [ADR 0019](0019-use-content-first-typography-scale.md): 콘텐츠 읽기용 기본
  typography scale
- [ADR 0036](0036-separate-philosophy-home-from-content-archive.md): 철학 우선
  홈 구성
- [ADR 0037](0037-adopt-zero-log-grid-site-shell.md): 홈 소개 문장이 놓이는
  2-6-4 shell
