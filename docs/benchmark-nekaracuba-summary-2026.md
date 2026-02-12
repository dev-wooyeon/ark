# NEKARACUBA Benchmark Summary

- generated_at_utc: `2026-02-12T04:33:10.925566+00:00`
- target_count: `100`
- selected_count: `100`
- min_per_company_target: `15`

## Coverage (Collected)

- NAVER: 20
- KAKAO: 53
- LINE: 239
- COUPANG: 26
- BAEMIN: 504

## Coverage (Selected)

- NAVER: 20
- KAKAO: 19
- LINE: 15
- COUPANG: 15
- BAEMIN: 31

## Topic Distribution (Selected)

- other: 89
- uiux: 7
- frontend: 3
- design: 1

## Data Files

- `/Users/noah/workspace/personal/eunu.log/docs/benchmark-nekaracuba-corpus-2026.jsonl`
- `/Users/noah/workspace/personal/eunu.log/docs/benchmark-nekaracuba-summary-2026.md`

## Notes

- `LINE`은 페이지 크롤링 기반이라 일부 문서는 날짜 정보가 없고, `1970-01-01`로 표준화됩니다.
- `KAKAO`는 `if.kakao` 공개 API(`/api/v1/contents`)에서 세션 메타데이터를 수집합니다.
- `COUPANG`은 Medium publication feed + tagged feed를 결합합니다.
- 모든 Medium 링크는 query string 제거 후 dedupe 처리합니다.
