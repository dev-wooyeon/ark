export interface Experience {
  company: string;
  role: string;
  period: string;
  projects: Project[];
}

export interface PersonalProject {
  title: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  links?: ProjectLink[];
}

export interface Project {
  title: string;
  description: string;
  achievements: string[];
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
    '사용자 가치 중심의 문제 해결에 몰두하며, 안정적이고 확장 가능한 시스템을 설계하고 구현합니다. 데이터 기반의 깊은 통찰로 기술적 난제를 극복하고, 팀과 함께 성장하는 과정에서 최고의 성과를 창출하는 Software Engineer입니다.',
};

export const experiences: Experience[] = [
  {
    company: '모노리스',
    role: '백엔드 엔지니어 • IoT팀',
    period: '2023.04 - 재직 중',
    projects: [
      {
        title: '데이터 분석 업무 자동화 PoC',
        description:
          '수작업 기반 분석 프로세스를 CDC 파이프라인으로 전환.',
        achievements: [
          'CDC 기반 데이터 파이프라인 설계 및 구현.',
          '운영 DB 부하 없이 실시간 분석 가능한 구조 설계.',
          '분석 리드타임 1-2시간 → 즉시 조회, 재요청 0건',
          '반복 분석 패턴에 맞춘 스타 스키마 모델링 및 DQ 도입',
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
        title: '글로벌 플랫폼 재설계',
        description:
          '제주파크 전용 시스템을 글로벌 확장 대비를 위해 차세대 시스템 구축.',
        achievements: [
          'DDD + Hexagonal Architecture 도입 주도',
          '실내 액티비티 도메인 설계 및 아키텍처 전환 참여',
          '테스트 코드 생성 AI 활용 프롬프트 공유',
          '팀 스터디와 점진적 도입으로 개발 문화 개선',
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
          '송금 업무를 수행하는 국내 오픈마켓 사업자를 위해 각각의 판매자에게서 발생한 매출을 위탁 송금을 하기 위한 Open API 서비스 구축',
        achievements: [
          'PL로 참여하여 3인으로 구성된 팀의 리소스 분배 및 일정 관리',
          '거래, 정산, 송금 개념을 추상화하여 도메인 중심으로 재설계',
          'OpenAPI 시스템 구축 및 지급대행 서비스 API 19개 개발',
          '테스트 커버리지 60% 이상 작성으로 서비스 안정성 확보'
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
        title: '차액정산 자동화',
        description:
          '여신금융협회에서 반기마다 제공하는 약 400만건 이상의 국내 모든 사업자 데이터를 관리하고 차액정산을 위한 프로세스 구축',
        achievements: [
          '반기별 영중소 구간 국내 사업자 데이터 관리 및 차액정산 프로세스 구축.',
          '구간 변경 이력 관리 및 과거 거래 소급 정산 구조 설계',
          '순수 Java Batch 기반 대용량 처리 및 성능 최적화',
          '모든 사업자 데이터를 저장하여 수수료 적용 오류로 인한 매출 손실 리스크 제거',
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
          '고객(운영팀)이 사용하는 관리자 대시보드를 자동화 및 효율화를 위해 개선을 진행하여 사용자 경험 향상',
        achievements: [
          '운영팀의 Pain Point를 주도적 개선.',
          '운영팀 백오피스 UI/UX, 기능 개선, 자동화 등 50건 이상 수행하여 업무효율 향상',
          '부가세 참고자료 페이지 조회 성능 개선(10s → 1s)으로 업무 효율 향상.',
          '반복 업무 자동화로 운영팀 주당 4시간 이상 절감',
          '모니터링 알림 중요도 분리로 장애 대응 시간 단축',
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
      'Apache Spark와 Delta Lake를 활용한 메달리온 아키텍처(Bronze/Silver/Gold) 기반의 개인 금융 데이터 분석 플랫폼 구축.',
    achievements: [
      'Raw 데이터부터 분석용 마트까지 이어지는 Medallion Architecture 전체 파이프라인 구현',
      'Star Schema 설계를 통한 고성능 분석 환경 구축 (Fact/Dim 테이블 구조화)',
      'Delta Lake 도입으로 데이터 일관성(ACID) 보장 및 Time Travel 기능 활용',
      'Spark Partitioning 및 Caching 전략을 통한 데이터 처리 성능 최적화',
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
      '광고 CTR 지표를 실시간으로 계산·서빙하는 스트리밍 파이프라인 설계 및 구현. Kafka-Flink 기반 이벤트 시간 처리, 상태 관리, 윈도우 집계 구성.',
    achievements: [
      'Out-of-Order 이벤트 문제를 워터마크 기반으로 해결하여 집계 정확도 확보',
      'Redis(실시간 API), ClickHouse(분석), DuckDB(검증) 멀티 싱크 구조 설계',
      '고처리량 환경에서 Backpressure 및 파티션 skew 대응 전략 적용',
      '대용량 트래픽 환경에서 안정적인 데이터 처리를 위한 지속적인 성능 개선'
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
      "'함께 성장하는 가치'를 바탕으로 지식 공유 생태계 기여",
    ],
  },
  {
    organization: '1군 사령부 예하부대 11정보통신단',
    title: '대한민국 육군',
    period: '2016.02 - 2019.02',
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
