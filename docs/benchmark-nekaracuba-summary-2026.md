# NEKARACUBA Benchmark Summary

- generated_at_utc: `2026-02-12T04:17:56.788321+00:00`
- target_count: `100`
- selected_count: `100`
- min_per_company_target: `15`

## Coverage (Collected)

- NAVER: 20
- KAKAO: 53
- LINE: 239
- COUPANG: 10
- BAEMIN: 504

## Coverage (Selected)

- NAVER: 20
- KAKAO: 24
- LINE: 15
- COUPANG: 10
- BAEMIN: 31

## Topic Distribution (Selected)

- other: 88
- uiux: 7
- frontend: 4
- design: 1

## Data Files

- `/Users/noah/workspace/personal/eunu.log/docs/benchmark-nekaracuba-corpus-2026.jsonl`
- `/Users/noah/workspace/personal/eunu.log/docs/benchmark-nekaracuba-summary-2026.md`

## Notes

- `LINE`은 페이지 크롤링 기반이라 일부 문서는 날짜 정보가 없고, `1970-01-01`로 표준화됩니다.
- `KAKAO`는 `if.kakao` 공개 API(`/api/v1/contents`)에서 세션 메타데이터를 수집합니다.
- `COUPANG`은 Medium RSS 기반이며 링크 query string은 제거합니다.
