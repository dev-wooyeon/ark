import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Header, Container } from '@/components/layout';
import {
  experiences,
  personalInfo,
  personalProjects,
  education,
  activities,
  certifications,
} from '@/data/resume';
import { orderExperienceStages } from '@/lib/resume-stage-order';

export const metadata: Metadata = {
  title: 'Resume',
  description: `${personalInfo.name}의 이력서`,
};

export default function ResumePage() {
  // Calculate years of experience (Start: Dec 2019)
  const startDate = new Date(2019, 12); // Month is 0-indexed (11 = Dec)
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  const m = now.getMonth() - startDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < startDate.getDate())) {
    years--;
  }

  // Calculate period duration from "YYYY.MM - YYYY.MM" or "YYYY.MM - 재직 중" format
  const calculateDuration = (period: string): string => {
    const parts = period.split(' - ');
    if (parts.length !== 2) return '';

    const parseDate = (str: string): Date | null => {
      if (str.includes('재직 중')) return new Date();
      const [year, month] = str.split('.').map(Number);
      if (!year || !month) return null;
      return new Date(year, month - 1);
    };

    const startDate = parseDate(parts[0]);
    const endDate = parseDate(parts[1]);

    if (!startDate || !endDate) return '';

    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    const calcYears = Math.floor(months / 12);
    const calcMonths = months % 12;

    if (calcYears > 0 && calcMonths > 0) {
      return `${calcYears}년 ${calcMonths}개월`;
    } else if (calcYears > 0) {
      return `${calcYears}년`;
    } else {
      return `${calcMonths}개월`;
    }
  };

  const renderTextWithCode = (text: string): ReactNode[] => {
    const segments = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return segments
      .filter((segment) => segment.length > 0)
      .map((segment, index) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const code = segment.slice(3, -3).trim();
          return (
            <pre
              key={`${segment}-${index}`}
              className="mt-2 mb-2 overflow-x-auto bg-[var(--color-bg-secondary)] px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)]"
            >
              <code className="text-sm font-mono">{code}</code>
            </pre>
          );
        }

        if (segment.startsWith('`') && segment.endsWith('`')) {
          return (
            <code
              key={`${segment}-${index}`}
              className="px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm font-mono"
            >
              {segment.slice(1, -1)}
            </code>
          );
        }

        return <span key={`${segment}-${index}`}>{segment}</span>;
      });
  };

  const renderStageDetail = (detailLines: string[]): ReactNode => {
    return (
      <ul className="m-0 list-disc space-y-1 pl-5">
        {detailLines.map((line, lineIndex) => (
          <li key={`${line}-${lineIndex}`} className="leading-relaxed">
            {renderTextWithCode(line)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Header />

      <main className="py-16 bg-[var(--color-bg-primary)]">
        <Container size="md">
          {/* Profile Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
              Resume
            </h1>

            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-2xl text-[var(--color-text-primary)]">
                {personalInfo.name}
              </h2>
              <p className="text-xl text-[var(--color-text-secondary)] font-medium">
                {personalInfo.position}
              </p>
              {personalInfo.introduction && (
                <p className="text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                  {personalInfo.introduction}
                </p>
              )}
            </div>

            {/* Contact & Links */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-[var(--color-text-secondary)]">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 hover:text-[var(--color-toss-blue)] transition-colors"
              >
                <span className="tossface">📧</span>
                {personalInfo.email}
              </a>
              {personalInfo.phone && (
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center gap-2 hover:text-[var(--color-toss-blue)] transition-colors"
                >
                  <span className="tossface">📱</span>
                  {personalInfo.phone}
                </a>
              )}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[var(--color-toss-blue)] transition-colors"
              >
                <span className="tossface">🐱</span>
                GitHub
              </a>
              {personalInfo.blog && (
                <a
                  href={personalInfo.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-toss-blue)] transition-colors"
                >
                  <span className="tossface">📝</span>
                  Blog
                </a>
              )}
            </div>
          </header>

          {/* Skills Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-2">
              <span className="tossface text-3xl">🛠️</span> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {personalInfo.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] font-medium border border-[var(--color-border)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-16">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <span className="tossface text-3xl">💼</span>
              Experience
              <span className="ml-2 text-base font-bold text-[var(--color-toss-blue)] bg-[var(--color-toss-blue)]/10 px-3 py-0.5 rounded-full align-middle">
                {years}년 +
              </span>
            </h2>

            {experiences.map((exp, index) => (
              <article key={index} className="relative pl-4 md:pl-0">
                {/* Visual Timeline Line for mobile */}
                <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-[var(--color-border)] md:hidden"></div>

                <div className="grid md:grid-cols-[200px_1fr] gap-8">
                  {/* Left Column: Company & Period */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                        {exp.company}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] font-medium text-sm">
                        {exp.role}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-[var(--color-text-tertiary)]">
                        {exp.period}
                      </span>
                      <span className="text-xs text-[var(--color-toss-blue)] font-medium">
                        {calculateDuration(exp.period)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Projects */}
                  <div className="space-y-12">
                    {exp.projects.map((project, pIndex) => (
                      <div key={pIndex} className="relative group">
                        <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-toss-blue)] transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                          {project.description}
                        </p>

                        <dl className="mb-6 space-y-3">
                          {orderExperienceStages(project.stages).map(
                            (stage, stageIndex) => (
                              <div
                                key={`${project.title}-${stage.key}-${stageIndex}`}
                                className="space-y-1.5"
                              >
                                <dt className="text-sm font-bold text-[var(--color-toss-blue)]">
                                  {stage.label}
                                </dt>
                                <dd className="m-0 text-base leading-relaxed text-[var(--color-text-secondary)]">
                                  {renderStageDetail(stage.detail)}
                                </dd>
                              </div>
                            )
                          )}
                        </dl>

                        {project.links && project.links.length > 0 && (
                          <div className="flex gap-3 mt-4">
                            {project.links.map((link, lIndex) => (
                              <a
                                key={lIndex}
                                href={link.href}
                                target={link.external ? '_blank' : '_self'}
                                rel={link.external ? 'noopener noreferrer' : ''}
                                className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-toss-blue)] flex items-center gap-1.5 transition-colors bg-[var(--color-bg-secondary)] px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-toss-blue)]/10"
                              >
                                {link.external ? (
                                  <span className="tossface text-sm">🔗</span>
                                ) : (
                                  <span className="tossface text-sm">📄</span>
                                )}
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Personal Projects Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <span className="tossface text-3xl">🚀</span> Personal Projects
            </h2>

            {personalProjects.map((project, index) => (
              <article key={index} className="relative pl-4 md:pl-0 mb-12 last:mb-0">
                {/* Visual Timeline Line for mobile */}
                <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-[var(--color-border)] md:hidden"></div>

                <div className="grid md:grid-cols-[200px_1fr] gap-8">
                  {/* Left Column: Role & Period */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                        {project.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] font-medium text-sm">
                        {project.role}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-[var(--color-text-tertiary)]">
                        {project.period}
                      </span>
                      <span className="text-xs text-[var(--color-toss-blue)] font-medium">
                        {calculateDuration(project.period)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Project Details */}
                  <div className="space-y-6">

                    <div>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                        {project.description}
                      </p>

                      <dl className="space-y-3 mb-6">
                        {orderExperienceStages(project.stages).map(
                          (stage, aIndex) => (
                            <div
                              key={`${project.title}-${stage.key}-${aIndex}`}
                              className="space-y-1.5"
                            >
                              <dt className="text-sm font-bold text-[var(--color-toss-blue)]">
                                {stage.label}
                              </dt>
                              <dd className="m-0 text-base leading-relaxed text-[var(--color-text-secondary)]">
                                {renderStageDetail(stage.detail)}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>

                      {project.links && project.links.length > 0 && (
                        <div className="flex gap-3 mt-4">
                          {project.links.map((link, lIndex) => (
                            <a
                              key={lIndex}
                              href={link.href}
                              target={link.external ? '_blank' : '_self'}
                              rel={link.external ? 'noopener noreferrer' : ''}
                              className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-toss-blue)] flex items-center gap-1.5 transition-colors bg-[var(--color-bg-secondary)] px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-toss-blue)]/10"
                            >
                              {link.external ? (
                                <span className="tossface text-sm">🔗</span>
                              ) : (
                                <span className="tossface text-sm">📄</span>
                              )}
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Education Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <span className="tossface text-3xl">🎓</span> Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8"
                >
                  <div className="md:text-right">
                    <span className="inline-block px-3 py-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm font-medium rounded-full">
                      {edu.period}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                      {edu.school}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                      {edu.degree} | {edu.major}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-[var(--color-toss-blue)]/10 text-[var(--color-toss-blue)] text-xs font-medium rounded">
                      {edu.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activities Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <span className="tossface text-3xl">🌟</span> Activities
            </h2>
            <div className="space-y-8">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8"
                >
                  <div className="md:text-right">
                    <span className="inline-block px-3 py-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm font-medium rounded-full">
                      {activity.period}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] font-medium mb-4">
                      {activity.organization}
                    </p>
                    <ul className="space-y-2 pl-5 list-disc">
                      {activity.description.map((desc, dIndex) => (
                        <li
                          key={dIndex}
                          className="text-[var(--color-text-secondary)] text-base leading-relaxed"
                        >
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section className="mt-16 mb-16">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <span className="tossface text-3xl">📜</span> Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-6 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] border border-[var(--color-border)] transition-colors"
                >
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-[var(--color-text-tertiary)] text-sm">
                    {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
