export interface Experience {
  company: string;
  role: string;
  period: string;
  projects: ExperienceProject[];
}

export type ExperienceStageKey =
  | 'problem'
  | 'decision'
  | 'implementation'
  | 'verification'
  | 'result'
  | 'extension';

export interface ExperienceStage {
  key: ExperienceStageKey;
  label: string;
  detail: string[];
}

export interface ExperienceProject {
  title: string;
  description: string;
  stages: ExperienceStage[];
  links?: ProjectLink[];
}

export interface PersonalProject {
  title: string;
  role: string;
  period: string;
  description: string;
  stages: ExperienceStage[];
  links?: ProjectLink[];
}

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface PersonalInfo {
  name: string;
  birthDate: string;
  position: string;
  // keywords: string;
  email: string;
  phone?: string;
  github: string;
  blog?: string;
  skills: string[];
  introduction?: string;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  period: string;
  status: string;
}

export interface Activity {
  organization: string;
  title: string;
  period: string;
  description: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export const personalInfo: PersonalInfo = {
  name: '박은우',
  birthDate: '1996.07.20',
  position: 'Software Engineer',
  // keywords: 'BE, DE, Platform',
  email: 'une@kakao.com',
  phone: '+82 01029139706',
  github: 'https://github.com/dev-wooyeon',
  blog: 'https://eunu-log.vercel.app',
  skills: [
    'Java',
    'Spring Boot',
    'MySQL',
    'AWS',
    'Kafka',
    'Flink',
    'ClickHouse',
    'JPA',
  ],
  introduction:
    '결제·정산·데이터 파이프라인처럼 오류 비용이 큰 도메인에서 문제를 구조로 풀어내는 백엔드 엔지니어입니다. 기능 구현에 앞서 문제 정의와 의사결정 기준을 먼저 맞추고, 변경 영향 범위를 줄이는 설계와 자동화로 사용자와 운영팀의 시간을 절약합니다.',
};

export const experiences: Experience[] = [
  {
    company: '모노리스',
    role: '백엔드 엔지니어 • IoT팀',
    period: '2023.04 - 재직 중',
    projects: [
      {
        title: '데이터 분석 업무 자동화',
        description:
          '운영 DB 직접 조회와 수작업 검증으로 반복되던 분석 요청을 시스템화하기 위해 CDC 기반 분석 파이프라인를 설계·구현.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '요청마다 쿼리 작성 → 수정 → 검증이 반복돼 분석 리드타임이 1-2시간까지 늘어나고, 월 평균 수동 대응 4회가 발생했습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '운영 부하와 데이터 최신성을 함께 확보하기 위해 배치 작업 대신 AWS 기반 CDC(DMS→S3→Glue→Athena) 구조를 선택했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              '반복 조회 패턴(날짜·상품·상태)에 맞춰 스타 스키마를 설계하고, Glue 단계에 DQ(Null·타입·무결성) 검증을 적용했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '즉시 조회 체계로 전환해 재요청 0건을 만들고, 분석 대응 시간을 주당 약 2시간 줄였습니다.',
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
          '제주파크 전용 구조를 멀티 파크 확장형 플랫폼으로 전환하기 위해 도메인 중심 아키텍처를 재설계.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '기존 시스템은 제주파크 전용 구조로 설계되어 있어, 파크를 추가할 때마다 시스템 복제와 조건문 누적으로 인해 변경 영향 범위를 예측하기 어려울 것 같다는 문제가 대두되었습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '단기 보수보다 장기 안정성을 우선해 DDD + Hexagonal Architecture(책임 분리, 테스트 가능성)를 채택했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              '메타데이터·상태·기록·로그·제어의 도메인 경계를 재정의하고, 포트/어댑터로 인프라 의존성을 분리했습니다.',
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
              '신규 파크를 설정 중심으로 확장 가능한 기반을 확보해 기능 변경 시 타 파크 영향 리스크를 낮췄습니다.',
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
    ],
  },
  {
    company: '엑심베이',
    role: '소프트웨어 개발자 • PG플랫폼팀',
    period: '2019.12 - 2023.03',
    projects: [
      {
        title: '지급대행 서비스 신규 구축',
        description:
          '오픈마켓 판매 대금을 안전하게 위탁 송금할 수 있도록 거래·정산·송금 흐름을 분리한 지급대행 Open API 서비스를 신규 구축.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '오픈마켓 사업자의 경우 하위 사업자들의 개별 정산할 수 있는 기능의 부재로 인한 직접 정산 및 송금 처리를 해야하는 불편함이 있었습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '도메인 안정성을 최우선 기준으로 두고 도메인 책임을 분리해, 명시적 인터페이스로 통신하도록 설계했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              '3인 팀 PL로 일정과 우선순위를 관리하며 30개+ 테이블을 재설계하고 지급대행 핵심 API 19개를 개발했습니다.',
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
              '외부 고객사 초기 연동 장애 0건을 달성했고, 변경 예측 가능성을 높여 팀 생산성을 약 20% 개선했습니다.',
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
          '여신금융협회 반기 데이터(약 400만 건+)를 기반으로 영세·중소 구간 변경 이력을 관리하는 차액정산 자동화 시스템을 구축.',
        stages: [
          {
            key: 'problem',
            label: '문제 정의',
            detail: [
              '정책 데이터가 반기마다 재정의되고 과거 거래와 충돌해, 수작업 검증과 누락 리스크가 반복됐습니다.',
            ],
          },
          {
            key: 'decision',
            label: '의사결정',
            detail: [
              '현재 상태 관리보다 이력 추적을 우선해 원천 데이터 전체 저장 + 반기 스냅샷 + 변경 이력 모델을 선택했습니다.',
            ],
          },
          {
            key: 'implementation',
            label: '구현',
            detail: [
              'Spring Batch 청크 처리와 인덱스 최적화로 400만 건+ 대용량 데이터를 안정적으로 반복 처리했습니다.',
            ],
          },
          {
            key: 'result',
            label: '성과',
            detail: [
              '반기 정산을 자동화하고 신규/변경 가맹점 누락 위험을 제거해, 수수료 오적용으로 인한 매출 손실 리스크를 차단했습니다.',
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
      '실시간 CTR 집계의 정확성과 운영 단순화를 동시에 달성하기 위해 이벤트 처리부터 조회 계층까지 재설계한 스트리밍 프로젝트.',
    stages: [
      {
        key: 'problem',
        label: '문제 정의',
        detail: [
          'Out-of-order 이벤트와 트래픽 급증 구간에서 집계 지연과 정확도 저하가 동시에 발생할 수 있는 구조였습니다.',
        ],
      },
      {
        key: 'decision',
        label: '의사결정',
        detail: [
          'Event-time 기반 윈도우 집계를 유지하되, 조회 계층을 ClickHouse 단일 소스로 통합해 복잡도를 줄이는 방향을 선택했습니다.',
        ],
      },
      {
        key: 'implementation',
        label: '구현',
        detail: [
          'Kafka → Flink 10초 윈도우 집계, 지연 이벤트 처리, DLQ 분리, Materialized View 기반 조회 경로를 한 흐름으로 구성했습니다.',
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
          '집계·조회 경로를 단일화해 운영 복잡도를 낮추고, 대시보드/분석 쿼리를 즉시 사용 가능한 상태로 전환했습니다.',
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
    period: '2025.06 - 2026.02',
    status: '졸업',
  },
  {
    school: '비트캠프',
    degree: '사설 교육',
    major: '소프트웨어 엔지니어링 양성 과정',
    period: '2019.02 - 2019.08',
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
    organization: '인프런',
    title: '멘토링 활동',
    period: '2025.02 - 2025.12',
    description: [
      '누적 100회 이상의 개발자 커리어 멘토링 진행',
      '취업준비생 및 주니어 개발자들의 이력서 및 포트폴리오 첨삭을 통한 서류 합격률 개선 지원',
      '기술적 문제 해결(Troubleshooting) 및 학습 방향성에 대한 객관적 조언 제공',
      '결제·정산·플랫폼 재설계·데이터 파이프라인 주제의 회고를 작성하고 스터디/리뷰에 활용',
    ],
  },
  {
    organization: '1군 사령부 예하부대 11정보통신단',
    title: '대한민국 육군',
    period: '2016.02 - 2018.02',
    description: [
      '병장 만기제대',
    ],
  }
];

export const certifications: Certification[] = [
  {
    name: 'SQLD',
    issuer: '한국데이터산업진흥원',
    date: '2023.07',
  },
  {
    name: '정보처리산업기사',
    issuer: '국가산업진흥원',
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
