export interface Experience {
    company: string;
    role: string;
    period: string;
    projects: Project[];
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
    blog: 'https://eunu.dev',
    skills: [
        'Java', 'Spring Boot', 'MySQL', 'AWS',
        'Kafka', 'Flink', 'ClickHouse', 'JPA'
    ],
    introduction: '데이터 중심으로 시스템을 만들고, 창작하는 것을 즐깁니다. 현재 9.81park 서비스를 운영하는 기업에서 Software Engineer로 근무하고 있습니다.',
};

export const experiences: Experience[] = [
    {
        company: 'Projects',
        role: '개인 프로젝트',
        period: '2025.11 - 2025.12 (2개월)',
        projects: [
            {
                title: '실시간 CTR 분석 파이프라인 구축',
                description:
                    '광고 CTR 지표를 실시간으로 계산·서빙하는 스트리밍 파이프라인 설계 및 구현. Kafka-Flink 기반 이벤트 시간 처리, 상태 관리, 윈도우 집계 구성.',
                achievements: [
                    'Out-of-Order 이벤트 문제를 워터마크 기반으로 해결하여 집계 정확도 확보',
                    'Redis(실시간 API), ClickHouse(분석), DuckDB(검증) 멀티 싱크 구조 설계',
                    '고처리량 환경에서 Backpressure 및 파티션 skew 대응 전략 적용',
                ],
                links: [
                    {
                        label: '코드 저장소',
                        href: 'https://github.com/dev-wooyeon/ctr-pipeline',
                        external: true,
                    },
                    {
                        label: '시스템 구축기',
                        href: '/feed/2025-12-02-make-ctr-pipeline',
                        external: false,
                    },
                    {
                        label: '성능개선기',
                        href: '/feed/2025-12-10-macbook-air-m1-life',
                        external: false,
                    },
                ],
            },
        ],
    },
    {
        company: '모노리스',
        role: '백엔드 엔지니어 • IoT팀',
        period: '2023.04 - 재직 중 (2년 10개월)',
        projects: [
            {
                title: '데이터 분석 업무 자동화 PoC',
                description:
                    '수작업 기반 분석 프로세스를 CDC 파이프라인으로 전환. 운영 DB → AWS DMS → S3 → Glue → Athena로 이어지는 CDC 기반 데이터 파이프라인 설계 및 구현. 운영 DB 부하 없이 실시간 분석 가능한 구조 설계.',
                achievements: [
                    '분석 리드타임 1-2시간 → 즉시 조회, 재요청 0건',
                    '반복 분석 패턴에 맞춘 스타 스키마 모델링 및 DQ 도입',
                ],
                links: [
                    {
                        label: '회고',
                        href: '/feed/data-analysis-automation',
                        external: false,
                    },
                ],
            },
            {
                title: '글로벌 플랫폼 재설계',
                description:
                    '제주파크 전용 시스템을 글로벌 확장 가능한 구조로 전환. DDD + Hexagonal Architecture 도입 주도. 실내 액티비티 도메인 설계 및 아키텍처 전환 참여.',
                achievements: [
                    'DDD + Hexagonal Architecture 도입 주도',
                    '테스트 코드 생성 AI 활용 프롬프트 공유',
                    '팀 스터디와 점진적 도입으로 개발 문화 개선',
                ],
                links: [
                    {
                        label: '회고',
                        href: '/feed/global-platform-redesign',
                        external: false,
                    },
                ],
            },
        ],
    },
    {
        company: '엑심베이',
        role: '소프트웨어 개발자 • PG플랫폼팀',
        period: '2019.12 - 2023.03 (3년 4개월)',
        projects: [
            {
                title: '지급대행 서비스 신규 구축',
                description:
                    '오픈마켓 판매자 대상 지급대행 서비스 기획 단계부터 참여. 거래-정산-송금 개념을 추상화하여 도메인 단위로 설계. REST API 서버 구축 및 19개 API 개발, 실제 고객사 연동.',
                achievements: [
                    '테스트 코드 100건 이상 작성으로 도메인 안정성 확보',
                    '외부 연동 초기 장애 0건, 개발 생산성 약 20% 개선',
                ],
                links: [
                    {
                        label: '회고',
                        href: '/feed/payment-service-project',
                        external: false,
                    },
                ],
            },
            {
                title: '여신금융협회 영중소 데이터 기반 차액정산 자동화',
                description:
                    '반기별 영중소 구간 데이터(약 400만 건) 관리 및 차액정산 프로세스 구축. 구간 변경 이력 관리 및 과거 거래 소급 정산 구조 설계. 순수 Java Batch 기반 대용량 처리 및 성능 최적화.',
                achievements: [
                    '모든 사업자 데이터를 저장하여 수수료 적용 오류로 인한 매출 손실 리스크 제거',
                ],
                links: [
                    {
                        label: '회고',
                        href: '/feed/batch-settlement-automation',
                        external: false,
                    },
                ],
            },
            {
                title: '운영 자동화 및 관리자 시스템 개선',
                description:
                    '운영팀의 Pain Point를 주도적 개선. 운영팀 백오피스 UI/UX, 기능 개선 50건 이상 수행. 주요 조회 페이지 최대 성능 개선(15s → 2s)으로 업무 효율 향상.',
                achievements: [
                    '반복 업무 자동화로 운영팀 주당 4시간 이상 절감',
                    '모니터링 알림 중요도 분리로 장애 대응 시간 단축',
                ],
                links: [
                    {
                        label: '회고',
                        href: '/feed/operation-automation',
                        external: false,
                    },
                ],
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
        period: '2025',
        description: [
            '누적 100회 이상의 개발자 커리어 멘토링 진행',
            '취업준비생 및 주니어 개발자들의 이력서 및 포트폴리오 첨삭을 통한 서류 합격률 개선 지원',
            '기술적 문제 해결(Troubleshooting) 및 학습 방향성에 대한 객관적 조언 제공',
            '\'함께 성장하는 가치\'를 바탕으로 지식 공유 생태계 기여',
        ],
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
        issuer: '국가산업진흥원',
        date: '2022.06',
    },
    {
        name: '유단증 4단',
        issuer: '대한해동검도협회',
        date: '2013.02',
    },
];
