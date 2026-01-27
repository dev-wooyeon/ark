'use client';

import Link from 'next/link';
import BackLink from '../_components/BackLink';

export default function Resume() {
  return (
    <div className="min-h-screen p-8 bg-[var(--bg-primary)] max-md:p-4 max-[480px]:px-3">
      <header className="max-w-[800px] mx-auto mb-16">
        <BackLink href="/" text="← Home" />
        <h1 className="font-[ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[clamp(2.5rem,6vw,3.5rem)] font-bold text-[var(--text-primary)] m-0 tracking-[-0.02em] max-md:text-[2rem] max-[480px]:text-[1.75rem]">Resume</h1>
      </header>

      <main className="max-w-[800px] mx-auto">
        {/* Personal Info Grid */}
        <section className="grid grid-cols-4 gap-10 mb-16 pb-12 border-b border-[var(--border)] max-lg:grid-cols-2 max-lg:gap-x-8 max-lg:gap-y-6 max-lg:mb-12 max-lg:pb-10">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">ID / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">
              박은우<br />
              <span className="text-[13px] text-[var(--text-tertiary)] font-normal max-lg:text-xs max-[480px]:text-[11px]">1996.07.20</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Position / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">Software Engineer</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Keyword / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]"> BE, DE, Platform </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Contact / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">
              <a href="mailto:une@kakao.com" className="text-[var(--accent-primary)] underline underline-offset-[3px] decoration-[var(--accent-primary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)]">
                une@kakao.com
              </a>
            </div>
          </div>
        </section>

        <hr className="h-px border-0 bg-[#5b504c] my-8 opacity-70" />

        {/* Personal Projects */}
        <section className="grid grid-cols-[200px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-8">
          <div className="flex flex-col gap-2 sticky top-8 self-start max-lg:static max-lg:gap-1">
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[18px]">Projects</h2>
            <div className="text-sm text-[var(--text-secondary)] font-normal leading-normal max-lg:text-[13px]">개인 프로젝트</div>
            <div className="text-[13px] text-[var(--text-tertiary)] font-normal mt-1 max-lg:text-xs">2025</div>
          </div>
          <div className="flex flex-col gap-6 max-lg:gap-6">
            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">실시간 CTR 분석 파이프라인</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                광고 도메인의 핵심 지표인 CTR(Click-Through-Rate)을 실시간으로 계산하는 데이터 파이프라인 설계·구현.
                Python Producer → Kafka → Flink → Redis/ClickHouse → FastAPI 구조.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                <li>Flink Watermark 기반 Out-of-Order 이벤트 처리</li>
                <li>Exactly-once 처리 보장 및 상태 기반 집계 구현</li>
                <li>멀티 싱크 전략으로 실시간 조회와 분석용 저장소 분리</li>
                <li>
                  <a href="https://github.com/dev-wooyeon/ctr-pipeline" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] underline underline-offset-[2px] decoration-[var(--accent-primary)] transition-all duration-200 text-sm font-normal hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)] max-lg:text-[13px]">
                    GitHub
                  </a>
                  {' · '}
                  <Link href="/feed/2025-12-02-make-ctr-pipeline" className="text-[var(--accent-primary)] underline underline-offset-[2px] decoration-[var(--accent-primary)] transition-all duration-200 text-sm font-normal hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)] max-lg:text-[13px]">
                    시스템 구축기
                  </Link>
                  {' · '}
                  <Link href="/feed/2025-12-10-macbook-air-m1-life" className="text-[var(--accent-primary)] underline underline-offset-[2px] decoration-[var(--accent-primary)] transition-all duration-200 text-sm font-normal hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)] max-lg:text-[13px]">
                    성능개선기
                  </Link>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <hr className="h-px border-0 bg-[#5b504c] my-8 opacity-70" />

        {/* Work Experience - Monolith */}
        <section className="grid grid-cols-[200px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-8">
          <div className="flex flex-col gap-2 sticky top-8 self-start max-lg:static max-lg:gap-1">
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[18px]">모노리스</h2>
            <div className="text-sm text-[var(--text-secondary)] font-normal leading-normal max-lg:text-[13px]">백엔드 엔지니어</div>
            <div className="text-[13px] text-[var(--text-tertiary)] font-normal mt-1 max-lg:text-xs">2023.04 - Present</div>
          </div>
          <div className="flex flex-col gap-6 max-lg:gap-6">
            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">데이터 분석 업무 자동화</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                데이터 분석가의 수작업 프로세스를 시스템 기반 자동화로 전환한 PoC 프로젝트.
                운영 DB → AWS DMS → S3 → Glue → Athena로 이어지는 CDC 기반 데이터 파이프라인 설계 및 구현.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                <li>분석 데이터 제공 리드타임 12시간 → 즉시 조회</li>
                <li>월 4회 수동 작업 제거, 주당 2시간 절감</li>
                <li>스타 스키마 모델링으로 반복 분석 패턴 최적화</li>
                <li>데이터 품질 검증(DQ) 로직 도입으로 지표 신뢰도 확보</li>
              </ul>
            </article>

            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">글로벌 플랫폼 구축</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                제주파크 전용 시스템을 글로벌 사업 확장을 고려한 플랫폼 구조로 재설계.
                DDD, Hexagonal Architecture 도입으로 도메인별 책임을 명확히 분리.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                <li>ERD와 In/OutBound 흐름 분석·문서화로 전체 구조 가시화</li>
                <li>팀 스터디 운영으로 새로운 아키텍처 도입에 대한 공감대 형성</li>
                <li>테스트 없는 코드베이스에 단위/통합 테스트 도입, 커버리지 80%+ 달성</li>
                <li>새로운 파크 추가 시 설정 변경만으로 대응 가능한 구조 확립</li>
              </ul>
            </article>
          </div>
        </section>

        <hr className="h-px border-0 bg-[#5b504c] my-8 opacity-70" />

        {/* Work Experience - Eximbay */}
        <section className="grid grid-cols-[200px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-8">
          <div className="flex flex-col gap-2 sticky top-8 self-start max-lg:static max-lg:gap-1">
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[18px]">엑심베이</h2>
            <div className="text-sm text-[var(--text-secondary)] font-normal leading-normal max-lg:text-[13px]">소프트웨어 개발자</div>
            <div className="text-[13px] text-[var(--text-tertiary)] font-normal mt-1 max-lg:text-xs">2019.12 - 2023.03</div>
          </div>
          <div className="flex flex-col gap-6 max-lg:gap-6">
            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">지급대행 신규 프로젝트</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                국내 오픈마켓 사업자를 대상으로 판매자별 매출을 집계해 위탁 송금까지 책임지는 지급대행 서비스 신규 구축.
                거래 → 정산 → 송금으로 이어지는 전체 흐름 분석 및 도메인별 책임 설계.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                <li>30개 이상 테이블 재설계, 객체 중심 ORM Entity 구조 구현</li>
                <li>19개 REST API 개발 및 실제 고객사 연동 완료</li>
                <li>100개 이상 테스트 코드 작성으로 시스템 신뢰성 확보</li>
                <li>실서비스 운영 시 치명적 장애 0건 달성</li>
              </ul>
            </article>

            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">영중소 데이터 관리 및 차액정산 자동화</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                여신금융협회에서 반기마다 제공하는 전국 사업자 영중소 구간 데이터를 기반으로 수수료 차액정산 프로세스 구축.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                <li>400만 건 대용량 데이터 처리 시스템 설계</li>
                <li>Spring Batch 청크 단위 처리로 메모리 효율성 확보</li>
                <li>변경 이력 테이블 설계로 소급 정산 및 검증 가능</li>
                <li>수수료 오류로 인한 매출 손실 리스크 방지</li>
              </ul>
            </article>

            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">성능 최적화</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                운영팀이 자주 사용하는 거래 내역 조회 페이지의 로딩 속도 개선.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                <li>페이지 로딩 속도 15,000ms → 2,000ms (75% 개선)</li>
                <li>EXPLAIN 분석으로 Full Table Scan 구간 식별, 복합 인덱스 적용</li>
                <li>N+1 문제 해결 및 커버링 인덱스 활용</li>
              </ul>
            </article>

            <article className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] dark:border-white/[0.08] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[16px] max-[480px]:text-[15px]">업무 자동화 및 효율화</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                운영팀의 반복적인 수작업 업무를 백오피스 자동화 기능으로 전환.
              </p>
              <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
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
