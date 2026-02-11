# Toss UIUX/Frontend/Design System Deep Analysis

## Scope

- source corpus: `/Users/noah/workspace/personal/eunu.log/docs/toss-uiux-fe-ds-article-corpus.md`
- structured data: `/Users/noah/workspace/personal/eunu.log/docs/toss-uiux-fe-ds-analysis-data.jsonl`
- summary stats: `/Users/noah/workspace/personal/eunu.log/docs/toss-uiux-fe-ds-analysis-summary.json`
- analyzed set: 100 articles (`https://toss.tech/article/*`)

## Method

- 1. 100개 아티클 URL 수집 및 본문 텍스트 추출
- 2. UIUX/Frontend/Design System/Quality 키워드 분류
- 3. 분류 상위 문서와 대표 시리즈를 교차 검토
- 4. 실행 가능한 규칙으로 패턴 변환

## Core Patterns (18)

1. **행동이 명확한 문구를 우선한다**

- 의미: 버튼/제목/상태 메시지가 즉시 행동을 유도한다.
- evidence:
  - https://toss.tech/article/Marketing_Writing
  - https://toss.tech/article/undercover-silo-4

2. **문제 설명과 복구 행동을 같이 제공한다**

- 의미: 에러를 보여주는 것에서 끝내지 않고 다음 행동을 제시한다.
- evidence:
  - https://toss.tech/article/undercover-silo-4
  - https://toss.tech/article/income-qa-platform

3. **큰 흐름은 단계로 분해한다**

- 의미: 복잡한 과업은 점진 노출로 부담을 줄인다.
- evidence:
  - https://toss.tech/article/undercover-silo-6
  - https://toss.tech/article/research_process

4. **리서치 기반으로 UI 의사결정을 한다**

- 의미: 감이 아닌 사용자 관찰/검증으로 결정한다.
- evidence:
  - https://toss.tech/article/uxresearch-method
  - https://toss.tech/article/ux-research-platform

5. **시각 효과보다 이해 속도를 우선한다**

- 의미: 화려함보다 인지 부담이 낮은 인터랙션을 채택한다.
- evidence:
  - https://toss.tech/article/27752
  - https://toss.tech/article/interaction_simplicity

6. **디자인 시스템은 토큰 중심으로 운영한다**

- 의미: 컴포넌트별 임시 스타일보다 의미 기반 토큰으로 통일한다.
- evidence:
  - https://toss.tech/article/rethinking-design-system
  - https://toss.tech/article/tds-color-system-update

7. **컬러 시스템은 운영 가능한 체계로 관리한다**

- 의미: 색상 추가보다 기준/이행 전략을 먼저 만든다.
- evidence:
  - https://toss.tech/article/tds-color-system-update

8. **컴포넌트는 조립 가능한 단위로 설계한다**

- 의미: 재사용 가능한 작은 단위로 변경 비용을 낮춘다.
- evidence:
  - https://toss.tech/article/slash23-iOS
  - https://toss.tech/article/firesidechat_frontend_11

9. **프론트엔드 품질은 린트/테스트/리뷰 습관으로 만든다**

- 의미: 개발자 역량에 의존하지 않고 절차로 품질을 보장한다.
- evidence:
  - https://toss.tech/article/firesidechat_frontend_10a
  - https://toss.tech/article/firesidechat_frontend_12

10. **배포는 점진 배포/관측 중심으로 설계한다**

- 의미: 한번에 크게 배포하지 않고 리스크를 나눠서 배포한다.
- evidence:
  - https://toss.tech/article/engineering-note-9
  - https://toss.tech/article/payments-legacy-3

11. **로깅/관측 가능성은 기능의 일부다**

- 의미: 장애를 빨리 찾는 구조를 기본 요구사항으로 본다.
- evidence:
  - https://toss.tech/article/engineering-note-5
  - https://toss.tech/article/MSA-observability

12. **문서 접근성도 개발 생산성의 핵심이다**

- 의미: 정보 탐색 비용을 줄이는 문서 체계에 투자한다.
- evidence:
  - https://toss.tech/article/toss-frontend-ai-docs

13. **QA 자동화는 속도와 안정성을 동시에 만든다**

- 의미: 빠른 기능 개발일수록 자동화된 회귀 방어선이 필요하다.
- evidence:
  - https://toss.tech/article/ai-driven-ui-test-automation
  - https://toss.tech/article/income-qa-e2e-automation

14. **플랫폼 전환은 단계적 구조개편으로 진행한다**

- 의미: 대규모 리라이트보다 계획-분리-이행으로 안정성을 확보한다.
- evidence:
  - https://toss.tech/article/restructuring-planning
  - https://toss.tech/article/restructuring

15. **장기 유지보수 관점에서 인터페이스를 설계한다**

- 의미: 단기 구현보다 변경 가능한 경계를 우선한다.
- evidence:
  - https://toss.tech/article/payments-legacy-1
  - https://toss.tech/article/payments-legacy-3

16. **다중 플랫폼(웹/RN)에서도 규칙 일관성을 유지한다**

- 의미: 플랫폼별 구현은 달라도 품질 기준은 동일해야 한다.
- evidence:
  - https://toss.tech/article/react-native-2024
  - https://toss.tech/article/rn-toss-bedrock

17. **성능은 체감 지연을 줄이는 방향으로 최적화한다**

- 의미: 사용자 대기 시간을 먼저 줄이고 내부 효율화는 그다음이다.
- evidence:
  - https://toss.tech/article/34481
  - https://toss.tech/article/monitoring-traffic

18. **운영 중 학습(incident learning)을 제품 개선으로 연결한다**

- 의미: 장애/실수/실험 결과를 규칙과 도구 개선으로 환류한다.
- evidence:
  - https://toss.tech/article/undercover-silo-5
  - https://toss.tech/article/slash23-security

## Translation To Rules

- 문구: 쉬운 단어, 한 문장 한 메시지, 복구 행동 포함
- UI 상태: 기본/로딩/성공/실패/빈 상태를 항상 정의
- 스타일: 토큰 우선, 하드코딩 예외화
- 품질: 점진 배포 + 로깅 + 자동화 테스트를 기본 절차로 강제
- 협업: 코드 변경과 함께 문서/검증 근거를 반드시 남김
