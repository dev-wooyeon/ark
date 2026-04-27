import type {
  Experience,
  PersonalInfo,
  PersonalProject,
  Education,
  Activity,
  Certification,
} from '@/domains/resume/model/types';

export const personalInfo: PersonalInfo = {
  name: '박은우',
  birthDate: '1996.07.20',
  position: 'Software Engineer',
  // keywords: 'BE, DE, Platform',
  email: 'une@kakao.com',
  phone: '+82 01029139706',
  github: 'https://github.com/dev-wooyeon',
  blog: 'https://eunu-log.vercel.app',
  skillGroups: [
    {
      category: '언어',
      skills: ['Java'],
    },
    {
      category: '프레임워크',
      skills: ['Spring Boot', 'Spring Batch', 'JPA'],
    },
    {
      category: '데이터베이스',
      skills: ['MySQL', 'ClickHouse'],
    },
    {
      category: '데이터 파이프라인',
      skills: ['Kafka', 'Flink', 'Athena'],
    },
    {
      category: '클라우드',
      skills: ['AWS', 'AWS DMS', 'AWS Glue'],
    },
    {
      category: '자동화',
      skills: ['MCP/Codex'],
    },
  ],
  introduction:
    '백엔드 엔지니어로 일하며 서비스의 완성도는 기능 수보다 데이터가 얼마나 정확하게 쌓이고, 일관된 기준으로 흐르며, 여러 팀이 믿고 사용할 수 있는 구조를 갖추는지에 달려 있다는 점을 체감했습니다. 결제·정산·IoT 도메인에서 데이터 기준을 명확히 하고 운영 가능한 구조로 바꾸는 일에 강한 몰입과 성과를 냈습니다.',
};

export const experiences: Experience[] = [
  {
    company: '모노리스',
    role: '백엔드 엔지니어 • IoT팀',
    period: '2023.04 - 재직 중',
    summary:
      '신개념 테마파크 9.81파크를 운영하는 B2C 환경에서 하드웨어 데이터를 주로 다루는 IoT 시스템을 담당했습니다. 운영 데이터 흐름을 정리하고 레거시 시스템의 비용과 확장 한계를 줄이는 구조 개선을 수행했습니다.',
    highlights: [
      '운영 DB 수작업 분석에 의존하던 구조를 CDC 기반 분석 파이프라인으로 전환',
      '레거시 IoT 시스템의 운영 비용과 변경 영향 범위를 줄이는 구조 개선',
      '신규 파크와 서비스 확장을 고려한 글로벌 IoT 플랫폼 재설계',
    ],
    projects: [
      {
        title: '데이터 분석 파이프라인 자동화',
        description:
          '운영 DB 수작업 분석에 의존하던 구조를 CDC 기반 분석 파이프라인으로 전환해 반복 요청을 즉시 조회 가능한 분석 환경으로 바꿨습니다.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '분석 요청이 반복될 때마다 운영 DB를 직접 조회하고 파일을 가공·검증해야 했습니다. 데이터를 뽑는 시간보다 결과를 다시 확인하는 시간이 더 오래 걸렸고, 조건 변경에 따른 재요청도 반복됐습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '문제를 쿼리 작성 업무가 아니라 데이터 흐름 부재로 재정의했습니다. 반복 분석 패턴을 재사용할 수 있도록 Aurora RDB → AWS DMS → S3 → Glue → Athena 기반 구조를 선택했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              'Append-only 방식으로 CDC 데이터를 적재하고 Glue Catalog 기반 스타 스키마를 구성했습니다. Glue 단계의 데이터 품질 검증을 함께 적용해 분석 데이터의 신뢰성과 재사용성을 확보했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '분석 리드타임을 1~2시간에서 즉시 조회 가능한 수준으로 단축하고, 월 평균 4회 이상 발생하던 수동 추출·검증 작업을 사실상 제거했습니다. 분석가가 개발자 개입 없이 필요한 데이터를 직접 확인할 수 있는 기반을 마련했습니다.',
            ],
          },
        ],
        links: [
          {
            label: '회고',
            href: '/blog/data-analysis-pipeline-poc',
            external: true,
          },
        ],
      },
      {
        title: '글로벌 IoT 플랫폼 재설계',
        description:
          '제주 9.81파크의 IoT 플랫폼을 도메인 중심으로 재설계해 신규 파크와 서비스 확장이 가능한 기반을 만들었습니다.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '기존 구조는 특정 파크 정책과 기능이 강하게 결합돼 기능 추가 시마다 시스템 전반의 영향 범위를 함께 확인해야 했습니다. 검증 범위가 커지고 확장 시 장애 리스크와 개발 비용이 함께 증가했습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '문제의 본질을 서비스 중심 설계가 아닌 데이터 흐름 중심 설계 부재로 봤습니다. 파일이 많아지는 단기 비용보다 장기적으로 변경 범위를 예측할 수 있는 구조를 우선해 도메인 경계와 Hexagonal Architecture를 채택했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              '메타데이터·상태·기록·로그·제어의 도메인 경계를 재정의하고 외부 의존성을 분리했습니다. 애플리케이션 간 직접 호출을 줄이며 유스케이스 단위의 버티컬 슬라이스 구조를 도입했습니다.',
            ],
          },
          {
            key: 'extension',
            label: '전환 전략',
            detail: [
              '기존 시스템과의 호환성을 유지하는 점진적 전환 전략으로 도입 리스크를 관리했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '변경 범위를 도메인 단위로 예측할 수 있게 만들고 신규 파크 대응을 설정 중심으로 확장할 수 있는 기반을 마련했습니다. 서비스 중단 없이 구조 개선을 이어갈 수 있는 방향을 만들었습니다.',
            ],
          },
        ],
        links: [
          {
            label: '회고',
            href: '/blog/platform-system-review',
            external: true,
          },
        ],
      },
      {
        title: '에러 로그 분석 자동화',
        description:
          'Grafana, GitHub MCP, Codex CLI를 연동해 반복적인 에러 로그 분석 흐름을 긴급도 리포트로 전환.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '많은 알림이 하나의 메신저 채널로 쏟아지는 환경에서 실제 시스템에 영향을 주는 에러를 빠르게 구분하기 어려웠습니다. 에러가 발생할 때마다 Grafana 로그 조회, TraceId 추적, 애플리케이션 역할 확인, 소스 코드 확인이 반복됐습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              'Grafana 로그 조회, TraceId 추적, 애플리케이션 역할 확인, 소스 코드 확인이 반복되는 흐름을 AI 에이전트가 수행할 수 있는 단위로 분해했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              '1분 주기로 에러 Trace를 수집하고 애플리케이션명, 오류 메시지, API 경로, 관측 내용, 동일 사건 발생 횟수, 소요 시간, 소스 코드 링크를 바탕으로 긴급도를 분류한 리포트를 생성했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '우선 대응이 필요한 오류를 더 빠르게 식별할 수 있게 만들고, 로깅 레벨 관리와 잠재 오류 탐지의 기반을 함께 마련했습니다.',
            ],
          },
        ],
      },
    ],
  },
  {
    company: '엑심베이',
    role: '소프트웨어 개발자 • PG플랫폼팀',
    period: '2019.12 - 2023.03',
    summary:
      'B2B 결제플랫폼 뒷단에서 월 평균 백만 건 이상 규모의 정산·대사 시스템을 담당했습니다. 거래·정산·송금 데이터의 기준을 명확히 하고 운영 효율을 높이는 백오피스 개선을 수행했습니다.',
    highlights: [
      '지급대행 Open API 신규 서비스 구축',
      '반기별 영중소 차액정산 자동화',
      '백오피스 성능 튜닝과 운영 효율 개선',
    ],
    projects: [
      {
        title: '지급대행 서비스 신규 구축',
        description:
          '오픈마켓 거래를 셀러 정산과 송금까지 연결하는 지급대행 Open API 서비스를 설계하고, 거래·정산·송금 책임을 분리한 구조로 안정적인 확장 기반을 만들었습니다.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '오픈마켓 사업자가 하위 셀러에게 판매 대금을 지급하는 신규 서비스가 필요했습니다. 외부 고객사 연동과 신규 서비스 구축이 동시에 요구돼 초기 설계 단계부터 안정성과 확장성을 함께 고려해야 했습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '거래, 정산, 송금 책임이 혼재되면 기능 확장 시 복잡도가 커질 수 있다고 판단했습니다. 도메인 기준으로 경계를 나누고 명시적 인터페이스로 통신하도록 설계했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              '기획 단계부터 참여해 핵심 기능 우선 구현 범위를 정리했습니다. 3인 팀 PL로 일정과 우선순위를 관리하며 30개+ 테이블을 재설계하고 지급대행 핵심 API 19개를 개발했습니다.',
              'JPA, QueryDSL, 테스트 코드 등 개발 표준을 도입하고 팀 내 스터디와 기획·외부 고객사 커뮤니케이션을 주도했습니다.',
            ],
          },
          {
            key: 'verification',
            label: '검증',
            detail: [
              '핵심 로직 테스트 100개+와 CI 자동 검증을 도입해 변경 영향 범위를 사전에 확인했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '기능 확장과 서비스 성장에 대응할 수 있는 도메인 단위 변경 통제 구조를 확보했습니다. 고객사 초기 연동 단계부터 장애 없이 안정적으로 서비스가 운영됐고, 팀의 일관된 개발 기준을 수립했습니다.',
            ],
          },
        ],
        links: [
          {
            label: '회고',
            href: '/blog/payment-system-design',
            external: true,
          },
        ],
      },
      {
        title: '영중소 구간변경 차액정산 자동화',
        description:
          '반기별 영중소 구간 변경 데이터를 수작업으로 처리하던 정산 프로세스를 자동화하고, 과거 거래까지 소급 정산 가능한 구조를 설계했습니다.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '반기마다 400만 건 이상의 국내 사업자 데이터를 기준으로 영세·중소·일반 사업자 구간을 다시 반영해야 했습니다. 기존에는 정산 담당자가 직접 비교·검증하는 수작업 구조였고, 과거 거래 소급 적용까지 함께 처리해야 해 누락과 정산 오류 리스크가 반복됐습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '문제를 단순 대량 데이터 처리 이슈가 아니라 정책 변경 이력을 시스템이 기억하지 못하는 구조적 문제로 재정의했습니다. 원천 데이터 전체 저장, 반기 스냅샷, 가맹점별 구간 변경 이력 모델을 선택했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              'Spring Batch 청크 처리와 Python/Pandas 기반 전처리를 함께 활용하고, SQL upsert 스크립트 생성 방식으로 400만 건 이상 데이터를 반복 처리할 수 있도록 구성했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '반기 정산 수작업을 자동화해 반복 업무를 제거하고 장시간 소요되던 작업을 1일 내 처리 가능한 수준으로 개선했습니다. 비교 검증 리스크를 낮추고 이후 정산에도 활용할 수 있는 기준 데이터를 정리했습니다.',
            ],
          },
        ],
        links: [
          {
            label: '회고',
            href: '/blog/settlement-automation',
            external: true,
          },
        ],
      },
      {
        title: '운영 자동화 및 백오피스 시스템 개선',
        description:
          '운영팀이 기다리는 시간을 줄이고 판단에 집중할 수 있도록 백오피스 성능 개선·자동화·모니터링 체계를 재구성.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '핵심 조회 화면 로딩이 15초+로 길고 반복 수동 작업이 누적됐으며, 단일 알림 채널로 장애 신호 누락이 발생했습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '운영 요청 단건 대응 대신 운영 흐름을 기준으로 자동화 우선, 자주 쓰는 화면 성능 우선, 알림 중요도 분리 전략을 수립했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              'EXPLAIN 기반으로 병목 쿼리를 개선하고 복합 인덱스 적용, N+1 제거, 페이지네이션 개선과 자동화 과제 50건+를 수행했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '주요 조회 응답을 15,000ms → 2,000ms로 단축하고 운영팀 반복 업무를 주당 4시간 이상 줄였습니다.',
            ],
          },
          {
            key: 'extension',
            label: '모니터링',
            detail: [
              '긴급/일반 알림 채널을 분리해 장애 인지와 대응 시간을 5분 이내로 단축했습니다.',
            ],
          },
        ],
        links: [
          {
            label: '회고',
            href: '/blog/operation-automation',
            external: true,
          },
        ],
      },
    ],
  },
];

export const personalProjects: PersonalProject[] = [
  {
    title: '개인 금융 데이터 분석 플랫폼',
    role: '데이터 엔지니어링',
    period: '2026.01 - 2026.02',
    description:
      '1억 건 금융 거래 데이터를 단일 노드에서 신뢰성 있게 처리하기 위해 성능·정합성·운영성을 함께 검증한 레이크하우스 프로젝트.',
    stages: [
      {
        key: 'problem',
        label: '문제 정의',
        detail: [
          '데이터가 커질수록 처리 시간이 급증했고, 차원 변경 이력이 소실되면 과거 분석 결과의 신뢰도가 흔들리는 문제가 있었습니다.',
        ],
      },
      {
        key: 'decision',
        label: '의사결정',
        detail: [
          '재처리 비용과 분석 신뢰도의 균형을 기준으로 Medallion + Star Schema를 채택하고, 차원은 SCD Type 2, Fact는 증분 MERGE 전략으로 분리했습니다.',
        ],
      },
      {
        key: 'implementation',
        label: '구현',
        detail: [
          'Bronze/Silver/Gold 계층 파이프라인과 레이어별 품질 검증을 구축하고, 대용량 벤치마크 모드를 분리해 실험 재현성을 확보했습니다.',
        ],
      },
      {
        key: 'verification',
        label: '검증',
        detail: [
          '레이어별 품질 체크와 100M 성능 실험을 반복해 정합성 훼손 없이 확장되는지 검증했습니다.',
        ],
      },
      {
        key: 'result',
        label: '성과',
        detail: [
          '처리 시간을 `686.5초 → 24.65초`까지 단축하고, 병목 원인(CPU·I/O·엔진 초기화)을 분리해 확장 의사결정 근거를 확보했습니다.',
        ],
      },
      {
        key: 'extension',
        label: '확장 전략',
        detail: [
          'Spark와 DuckDB의 엔진 선택 기준, 압축/비압축 I/O 트레이드오프, 운영 모드와 실험 모드 분리 전략을 정리했습니다.',
        ],
      },
    ],
    links: [
      {
        label: '코드 저장소',
        href: 'https://github.com/dev-wooyeon/demo-finance-engine',
        external: true,
      },
    ],
  },
  {
    title: '실시간 CTR 분석 파이프라인 구축',
    role: '데이터 엔지니어링',
    period: '2025.11 - 2025.12',
    description:
      'Kafka, Apache Flink, ClickHouse 기반으로 impression/click 이벤트를 실시간 CTR로 집계하고 초기 다중 싱크 구조의 병목을 ClickHouse Materialized View 중심 구조로 재설계한 개인 데이터 엔지니어링 프로젝트.',
    stages: [
      {
        key: 'problem',
        label: '문제 정의',
        detail: [
          '1BRC를 통해 배치 처리에 대한 기술적 갈증은 일부 해소했지만 스트리밍 처리의 정확성과 운영성은 직접 검증할 필요가 있었습니다.',
          'CTR 집계는 impression과 click 이벤트가 순서대로 도착하지 않고 지연될 수 있어, 이벤트 시간 기준 집계와 지연 이벤트 처리 정책이 함께 필요한 문제였습니다.',
        ],
      },
      {
        key: 'decision',
        label: '의사결정',
        detail: [
          '초기에는 Kafka → Flink → Redis/ClickHouse/DuckDB → FastAPI 구조로 집계, 저장, 조회 책임을 분리했습니다. 이후 Redis/API 계층의 리소스 사용과 직렬화·네트워크 오버헤드, 스키마 변경 비용을 확인하고 ClickHouse 중심 구조로 단순화했습니다.',
        ],
      },
      {
        key: 'implementation',
        label: '구현',
        detail: [
          'Kafka → Flink 10초 tumbling window, event time 처리, 지연 이벤트 허용, DLQ, 설정 검증, 종료 처리 흐름을 구성했습니다.',
          'Flink는 ClickHouse 원본 테이블에만 기록하고 Materialized View가 최신 상태 조회와 집계 조회를 담당하도록 서빙 구조를 단순화했습니다.',
        ],
      },
      {
        key: 'verification',
        label: '검증',
        detail: [
          'checkpoint/restart 전략과 지연 이벤트 처리 시나리오를 점검해 중복·누락 리스크를 제어했습니다.',
        ],
      },
      {
        key: 'result',
        label: '성과',
        detail: [
          '계층을 많이 나누는 구조보다 현재 목표와 제약에 맞는 최소 구조가 더 좋은 설계일 수 있음을 검증했습니다.',
          '단순 기능 구현을 넘어 스트리밍 정확성, 성능 엔지니어링, 운영 안정성, 관측성을 함께 다루는 데이터 엔지니어링 프로젝트로 발전시켰습니다.',
        ],
      },
      {
        key: 'extension',
        label: '확장 전략',
        detail: [
          '정확도와 지연시간의 균형점, DLQ 운영 정책, 단일 저장소 전략의 장애/확장 트레이드오프를 기준으로 정리했습니다.',
        ],
      },
    ],
    links: [
      {
        label: '코드 저장소',
        href: 'https://github.com/dev-wooyeon/ctr-pipeline',
        external: true,
      },
      {
        label: '시스템 구축기',
        href: '/blog/ctr-pipeline',
        external: true,
      },
      {
        label: '성능개선기',
        href: '/blog/macbook-air-m1-life',
        external: true,
      },
    ],
  },
];

export const education: Education[] = [
  {
    school: '학점은행제',
    degree: '학사',
    major: '컴퓨터공학과',
    period: '2025.03 - 2026.02',
    status: '졸업',
  },
  {
    school: '비트캠프',
    degree: '수료',
    major: '118기, 소프트웨어 엔지니어링',
    period: '2019.03 - 2019.08',
    status: '수료',
  },
  {
    school: '수원과학대학교',
    degree: '전문학사',
    major: '컴퓨터정보과',
    period: '2015.03 - 2019.02',
    status: '졸업',
  },
];

export const activities: Activity[] = [
  {
    organization: '유쾌한 스프링방 스터디 6기',
    title: '그룹 스터디',
    period: '2025.11 - 진행 중',
    description: [
      '페어 프로그래밍을 통해 기술적 의사결정 과정을 공유하고 코드 수준의 협업 방식을 훈련',
      '기업 분석과 퍼스널 브랜딩 미션을 통해 비즈니스 가치를 이해하는 엔지니어링 관점 정리',
      '정기 회고를 통해 학습 내용과 프로젝트 의사결정 기준을 문서화',
    ],
  },
  {
    organization: '인프런',
    title: '멘토링 활동',
    period: '2023.12 - 진행 중',
    description: [
      '누적 100회 이상의 개발자 커리어 멘토링 진행',
      '취업준비생 및 주니어 개발자들의 이력서 및 포트폴리오 첨삭을 통한 서류 합격률 개선 지원',
      '기술적 문제 해결(Troubleshooting) 및 학습 방향성에 대한 객관적 조언 제공',
      '결제·정산·플랫폼 재설계·데이터 파이프라인 주제의 회고를 작성하고 스터디/리뷰에 활용',
    ],
  },
  {
    organization: '캡스톤 디자인 작품전',
    title: '최우수상',
    period: '2018.11',
    description: [
      'F학점 피하기 미니게임의 아이디어 기획, 게임 규칙 설계, 구현을 담당',
      '작품전 발표와 시연을 맡아 문제의식, 구현 방식, 결과물을 설명',
    ],
  },
  {
    organization: '대한해동검도협회',
    title: '해동검도 리더십 경험',
    period: '2012.01 - 2014.12',
    description: [
      '10년간 해동검도를 수련하며 유단자 4단 취득 및 세계대회 본선 진출',
      '3단 취득 이후 모범 역할로 관원 지도와 훈련 보조 수행',
      '수백, 수천 번의 반복 수련을 통해 필요한 반복의 가치와 불필요한 반복의 비용을 함께 체득',
    ],
  },
  {
    organization: '1군 사령부 예하부대 11정보통신단',
    title: '대한민국 육군',
    period: '2016.05 - 2018.02',
    description: ['병장 만기제대'],
  },
];

export const certifications: Certification[] = [
  {
    name: 'SQLD',
    issuer: '한국데이터산업진흥원',
    date: '2023.07',
  },
  {
    name: '정보처리산업기사',
    issuer: '한국산업인력공단',
    date: '2022.06',
  },
  {
    name: 'ITQ OA Master',
    issuer: '한국생산성본부',
    date: '2019.02',
  },
  {
    name: '유단증 4단',
    issuer: '대한해동검도협회',
    date: '2013.02',
  },
];
