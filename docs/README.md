# 문서 인덱스

Last updated: 2026-07-15

이 인덱스는 현재 코드베이스와 함께 유지해야 하는 문서만 추적한다. 계속
업데이트할 문서가 아니라면 삭제하거나, 오래 남겨야 하는 결정만 ADR로 옮긴다.

새 독립 문서를 추가하기 전에 기존 ADR, guide, README로 흡수할 수 있는지 먼저
검토한다.

## 저장소 기준 문서

- `AGENTS.md`
- `README.md`

## 유지 대상 문서

- `docs/adr/README.md`
- `docs/adr/*.md`
- `docs/blog-quality-guide.md`
- `docs/database/db-schema.md`
- `docs/database/supabase-view-count.sql`
- `docs/guides/testing-guide.md`

## 관리 규칙

1. 문서에서는 저장소 기준 상대 경로만 사용한다.
2. 정책과 프로세스 문서를 수정하면 `Last updated`를 갱신한다.
3. 명령어는 저장소 루트에서 바로 실행할 수 있게 작성한다.
4. 참조 파일이 사라지면 stale link를 제거하거나 교체한다.
5. 글쓰기 또는 유지보수 흐름에서 쓰지 않는 일회성 research, 오래된 계획,
   생성 리포트는 삭제한다.
