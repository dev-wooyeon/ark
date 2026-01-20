'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Resume() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <h1 className={styles.title}>Resume</h1>
      </header>

      <main className={styles.main}>
        {/* Personal Info Grid */}
        <section className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>ID</div>
            <div className={styles.infoValue}>
              박은우<br />
              <span className={styles.birthDate}>1996.07.20</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Position</div>
            <div className={styles.infoValue}>Software Engineer</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Keyword</div>
            <div className={styles.infoValue}>Data, Automation</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Contact</div>
            <div className={styles.infoValue}>
              <a href="mailto:une@kakao.com" className={styles.link}>
                une@kakao.com
              </a>
            </div>
          </div>
        </section>

        {/* Personal Projects */}
        <section className={styles.workSection}>
          <div className={styles.workLeft}>
            <h2 className={styles.company}>Projects</h2>
            <div className={styles.role}>개인 프로젝트</div>
            <div className={styles.period}>2025</div>
          </div>
          <div className={styles.workRight}>
            <article className={styles.projectArticle}>
              <h3>실시간 CTR 분석 파이프라인</h3>
              <p className={styles.projectDesc}>
                광고 도메인의 핵심 지표인 CTR(Click-Through-Rate)을 실시간으로 계산하는 데이터 파이프라인 설계·구현.
                Python Producer → Kafka → Flink → Redis/ClickHouse → FastAPI 구조.
              </p>
              <ul className={styles.achievements}>
                <li>Flink Watermark 기반 Out-of-Order 이벤트 처리</li>
                <li>Exactly-once 처리 보장 및 상태 기반 집계 구현</li>
                <li>멀티 싱크 전략으로 실시간 조회와 분석용 저장소 분리</li>
                <li>
                  <a href="https://github.com/dev-wooyeon/ctr-pipeline" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    GitHub
                  </a>
                  {' · '}
                  <a href="https://github.com/dev-wooyeon/ctr-pipeline" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    시스템 구축기
                  </a>
                  {' · '}
                  <a href="https://github.com/dev-wooyeon/ctr-pipeline" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    성능개선기
                  </a>
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* Work Experience - Monolith */}
        <section className={styles.workSection}>
          <div className={styles.workLeft}>
            <h2 className={styles.company}>모노리스</h2>
            <div className={styles.role}>백엔드 엔지니어</div>
            <div className={styles.period}>2023.04 - Present</div>
          </div>
          <div className={styles.workRight}>
            <article className={styles.projectArticle}>
              <h3>데이터 분석 업무 자동화</h3>
              <p className={styles.projectDesc}>
                데이터 분석가의 수작업 프로세스를 시스템 기반 자동화로 전환한 PoC 프로젝트.
                운영 DB → AWS DMS → S3 → Glue → Athena로 이어지는 CDC 기반 데이터 파이프라인 설계 및 구현.
              </p>
              <ul className={styles.achievements}>
                <li>분석 데이터 제공 리드타임 12시간 → 즉시 조회</li>
                <li>월 4회 수동 작업 제거, 주당 2시간 절감</li>
                <li>스타 스키마 모델링으로 반복 분석 패턴 최적화</li>
                <li>데이터 품질 검증(DQ) 로직 도입으로 지표 신뢰도 확보</li>
              </ul>
            </article>

            <article className={styles.projectArticle}>
              <h3>글로벌 플랫폼 구축</h3>
              <p className={styles.projectDesc}>
                제주파크 전용 시스템을 글로벌 사업 확장을 고려한 플랫폼 구조로 재설계.
                DDD, Hexagonal Architecture 도입으로 도메인별 책임을 명확히 분리.
              </p>
              <ul className={styles.achievements}>
                <li>ERD와 In/OutBound 흐름 분석·문서화로 전체 구조 가시화</li>
                <li>팀 스터디 운영으로 새로운 아키텍처 도입에 대한 공감대 형성</li>
                <li>테스트 없는 코드베이스에 단위/통합 테스트 도입, 커버리지 80%+ 달성</li>
                <li>새로운 파크 추가 시 설정 변경만으로 대응 가능한 구조 확립</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Work Experience - Eximbay */}
        <section className={styles.workSection}>
          <div className={styles.workLeft}>
            <h2 className={styles.company}>엑심베이</h2>
            <div className={styles.role}>소프트웨어 개발자</div>
            <div className={styles.period}>2019.12 - 2023.03</div>
          </div>
          <div className={styles.workRight}>
            <article className={styles.projectArticle}>
              <h3>지급대행 신규 프로젝트</h3>
              <p className={styles.projectDesc}>
                국내 오픈마켓 사업자를 대상으로 판매자별 매출을 집계해 위탁 송금까지 책임지는 지급대행 서비스 신규 구축.
                거래 → 정산 → 송금으로 이어지는 전체 흐름 분석 및 도메인별 책임 설계.
              </p>
              <ul className={styles.achievements}>
                <li>30개 이상 테이블 재설계, 객체 중심 ORM Entity 구조 구현</li>
                <li>19개 REST API 개발 및 실제 고객사 연동 완료</li>
                <li>100개 이상 테스트 코드 작성으로 시스템 신뢰성 확보</li>
                <li>실서비스 운영 시 치명적 장애 0건 달성</li>
              </ul>
            </article>

            <article className={styles.projectArticle}>
              <h3>영중소 데이터 관리 및 차액정산 자동화</h3>
              <p className={styles.projectDesc}>
                여신금융협회에서 반기마다 제공하는 전국 사업자 영중소 구간 데이터를 기반으로 수수료 차액정산 프로세스 구축.
              </p>
              <ul className={styles.achievements}>
                <li>400만 건 대용량 데이터 처리 시스템 설계</li>
                <li>Spring Batch 청크 단위 처리로 메모리 효율성 확보</li>
                <li>변경 이력 테이블 설계로 소급 정산 및 검증 가능</li>
                <li>수수료 오류로 인한 매출 손실 리스크 방지</li>
              </ul>
            </article>

            <article className={styles.projectArticle}>
              <h3>성능 최적화</h3>
              <p className={styles.projectDesc}>
                운영팀이 자주 사용하는 거래 내역 조회 페이지의 로딩 속도 개선.
              </p>
              <ul className={styles.achievements}>
                <li>페이지 로딩 속도 15,000ms → 2,000ms (75% 개선)</li>
                <li>EXPLAIN 분석으로 Full Table Scan 구간 식별, 복합 인덱스 적용</li>
                <li>N+1 문제 해결 및 커버링 인덱스 활용</li>
              </ul>
            </article>

            <article className={styles.projectArticle}>
              <h3>업무 자동화 및 효율화</h3>
              <p className={styles.projectDesc}>
                운영팀의 반복적인 수작업 업무를 백오피스 자동화 기능으로 전환.
              </p>
              <ul className={styles.achievements}>
                <li>50건 이상 기능 개선, UI/UX 개선 30건</li>
                <li>정산 확인, 거래 상태 변경, 리포트 생성 자동화</li>
                <li>주당 4시간 이상 업무 시간 단축</li>
                <li>모니터링 메시지 중요도별 채널 분류로 5분 내 장애 대처</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
