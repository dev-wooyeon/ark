# 0014. 공개 사이트 정체성으로 아크를 사용한다

Date: 2026-05-14
Status: Accepted

## 배경

기존 이름 `eunu.log`는 개인 식별자와 로그 형식을 직접 드러냈다. 하지만 이
블로그는 오래 남길 글, 회고, 기술 기록을 계속 싣는 플랫폼 성격이 강해지고
있다. 이름도 저장소나 로그 파일보다 기록을 보존하고 다음 시점으로 운반한다는
철학을 드러낼 필요가 있었다.

후보로는 `Ark`, `Sisyphus`, `Touchstone`을 검토했다. `Sisyphus`는 계속 일하는
루프를 표현하지만 끝나지 않는 형벌의 의미가 먼저 읽힐 수 있다. `Touchstone`은
판단 기준의 이름으로는 적합하지만 블로그 전체의 그릇을 가리키기에는 좁다.
`Ark`는 노아의 방주처럼 오래 건너갈 것을 싣고 보존한다는 이미지가 있어
블로그 플랫폼의 공개 이름으로 적합하다.

## 결정

- 공개 제품명과 사이트명은 영문 표기 `Ark`, 한글 표기 `아크`를 사용한다.
- `site/config/site.ts`의 `SITE_BRAND`를 표기 기준의 단일 출처로 둔다.
- 패키지 이름은 배포 가능한 Vercel project name 규칙과 맞게 기술 식별자
  `ark`를 사용한다.
- 설명 문구는 "오래 건너갈 생각들을 싣는 개인의 방주"를 기준으로 한다.
- 사이트 URL은 `NEXT_PUBLIC_SITE_URL`로 주입할 수 있게 하고, 외부 Vercel
  project/domain rename 전까지는 기존 운영 도메인을 기본값으로 둔다.
- 작성자 정체성, GitHub 계정, Giscus repository 연결은 운영 리소스 rename이
  끝나기 전까지 기존 값을 유지한다.

## 결과

- metadata, RSS, OG image, footer, README에서 공개 이름이 `Ark` 또는 `아크`로
  일관된다.
- 외부 도메인과 댓글 시스템은 실제 rename 전에 깨지지 않는다.
- Vercel project를 `ark`로 rename하거나 custom domain을 붙이면
  `NEXT_PUBLIC_SITE_URL`만 갱신해 canonical URL을 바꿀 수 있다.
- 기존 motion 설정은 `ark:*` storage key로 이동하되, 기존 `eunulog:*` 값을
  읽어 사용자 설정을 보존한다.

## 검토한 대안

- `eunu.log` 유지: 개인 블로그 느낌은 명확하지만, 글을 오래 보존하는 플랫폼
  철학을 설명하기 어렵다.
- `Sisyphus` 사용: 꾸준한 작업 루프에는 어울리지만 제품 전체 이름으로는
  피로감과 무의미한 반복의 뉘앙스가 강하다.
- `Touchstone` 사용: 의사결정 기준이나 원칙 키로는 좋지만 블로그 컨테이너의
  이름으로는 추상적이다.
- 코드에서 즉시 모든 URL과 repository 이름을 `ark`로 변경: 브랜드는 깔끔하지만
  Vercel project, GitHub repository, Giscus 설정이 아직 바뀌지 않았다면
  배포 metadata와 댓글 연결이 깨질 수 있다.
