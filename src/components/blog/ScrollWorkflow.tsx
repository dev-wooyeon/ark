'use client';

import { useEffect, useRef, useState } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'A', title: 'Atlas Research', detail: '탐색 범위를 정의하고 레퍼런스를 빠르게 모읍니다.' },
  { id: 'B', title: 'Knowledge 정리', detail: 'Notion/Obsidian에 재사용 가능한 컨텍스트를 축적합니다.' },
  { id: 'C', title: 'ChatGPT 설계 검토', detail: '구조/트레이드오프를 점검하고 실패 비용을 줄입니다.' },
  { id: 'D', title: 'Codex Prototype 생성', detail: '반복 구현을 빠르게 실험 가능한 형태로 만듭니다.' },
  { id: 'E', title: 'IntelliJ 구현', detail: '도메인 로직과 품질 기준을 반영해 본 구현으로 고도화합니다.' },
  { id: 'F', title: 'DataGrip DB 검증', detail: '스키마/쿼리/인덱스 관점에서 데이터 품질을 검증합니다.' },
  { id: 'G', title: 'Postman API 테스트', detail: '계약 검증과 에러 케이스를 확인해 릴리스 리스크를 낮춥니다.' },
  { id: 'H', title: 'Warp CLI 운영·배포 작업', detail: '실행/운영 루틴을 정리해 반복 가능한 배포 흐름을 만듭니다.' },
];

export function ScrollWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const viewport = window.innerHeight;
      const section5 = document.getElementById('5-knowledge-stack을-분리한-이유');
      const section6 = document.getElementById('6-현재-운영하는-workflow');
      const section7 = document.getElementById('7-내-환경에서-실제로-쓰는-homebrew-도구');

      if (!section5 || !section6) return;

      const startY =
        window.scrollY + section5.getBoundingClientRect().top - viewport * 0.5;
      const section6Top =
        window.scrollY + section6.getBoundingClientRect().top - viewport * 0.25;
      const section6VisibleY =
        window.scrollY + section6.getBoundingClientRect().top - viewport * 0.35;
      const section7Top = section7
        ? window.scrollY + section7.getBoundingClientRect().top - viewport * 0.85
        : section6Top + viewport * 0.7;
      const endY = Math.max(section6Top + 120, section7Top);
      const effectiveStartY = Math.max(startY, section6VisibleY);

      const totalScrollable = Math.max(1, endY - effectiveStartY);
      const passed = window.scrollY - effectiveStartY;
      const nextProgress = Math.min(1, Math.max(0, passed / totalScrollable));
      const holdFirstStepUntil = 0.14;
      const normalizedProgress =
        nextProgress <= holdFirstStepUntil
          ? 0
          : (nextProgress - holdFirstStepUntil) / (1 - holdFirstStepUntil);
      const nextIndex = Math.min(
        WORKFLOW_STEPS.length - 1,
        Math.floor(normalizedProgress * WORKFLOW_STEPS.length)
      );

      setProgress(nextProgress);
      setActiveIndex(nextIndex);
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const activeStep = WORKFLOW_STEPS[activeIndex];

  return (
    <div ref={containerRef} className="workflow-scroll-root">
      <div className="workflow-scroll-sticky">
        <div className="workflow-scroll-header">
          <span className="workflow-scroll-index">
            Step {activeIndex + 1}/{WORKFLOW_STEPS.length}
          </span>
          <span className="workflow-scroll-progress">{Math.round(progress * 100)}%</span>
        </div>

        <div className="workflow-scroll-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className="workflow-scroll-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>

        <div className="workflow-scroll-row" aria-label="workflow steps">
          {WORKFLOW_STEPS.map((step, index) => {
            const isActive = index <= activeIndex;
            return (
              <div key={step.id} className={`workflow-step ${isActive ? 'is-active' : ''}`}>
                <span className="workflow-step-id">{step.id}</span>
                <span className="workflow-step-title">{step.title}</span>
              </div>
            );
          })}
        </div>

        <div className="workflow-scroll-detail">
          <h4>{activeStep.title}</h4>
          <p>{activeStep.detail}</p>
        </div>
      </div>
    </div>
  );
}
