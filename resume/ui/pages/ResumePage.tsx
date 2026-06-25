import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Container } from '@/ui/layout';
import {
  activities,
  certifications,
  education,
  experiences,
  personalInfo,
  personalProjects,
  resumeHighlights,
  workingPrinciples,
} from '@/resume/model/resume-data';
import { orderExperienceStages } from '@/resume/model/order-experience-stages';
import type { Activity } from '@/resume/model/types';
import { createSiteUrl } from '@/site/config/site';

const resumeUrl = createSiteUrl('/resume');
const description = `${personalInfo.name}의 CV`;

export const metadata: Metadata = {
  title: 'CV',
  description,
  alternates: {
    canonical: resumeUrl,
  },
  openGraph: {
    title: 'CV',
    description,
    url: resumeUrl,
  },
};

const heroStatement = '반복되는 운영을 데이터 구조와 자동화로 바꾸는 엔지니어';

const heroSummary = [
  '해동검도 4단과 세계대회 본선을 준비하며 같은 동작을 수백, 수천 번 반복했습니다. 그 경험 덕분에 필요한 반복의 가치는 압니다.',
  '하지만 개발자가 된 뒤에는 사람이 매번 확인하고 옮기는 반복이 장애와 비용으로 바뀌는 장면을 자주 봤습니다. 저는 그런 반복을 데이터 구조와 자동화 안으로 옮기는 일에 끌립니다.',
];

const motivationStatement =
  'API를 하나 더 만드는 일보다 데이터 기준, 처리 흐름, 운영 방식을 정리해 팀이 믿고 쓰는 구조를 만드는 데 관심이 있습니다.';

function calculateCareerYears(): number {
  const careerStart = new Date(2019, 11, 1);
  const now = new Date();
  let years = now.getFullYear() - careerStart.getFullYear();
  const monthDiff = now.getMonth() - careerStart.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < careerStart.getDate())
  ) {
    years--;
  }

  return years;
}

function calculateDuration(period: string): string {
  const [start, end] = period.split(' - ');

  if (!start || !end) {
    return '';
  }

  const parseDate = (value: string): Date | null => {
    if (value.includes('재직 중')) {
      return new Date();
    }

    const [year, month] = value.split('.').map(Number);

    if (!year || !month) {
      return null;
    }

    return new Date(year, month - 1, 1);
  };

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) {
    return '';
  }

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years}년 ${months}개월`;
  }

  if (years > 0) {
    return `${years}년`;
  }

  return `${months}개월`;
}

function renderTextWithCode(text: string): ReactNode[] {
  const segments = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return segments
    .filter((segment) => segment.length > 0)
    .map((segment, index) => {
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const code = segment.slice(3, -3).trim();

        return (
          <pre
            key={`${segment}-${index}`}
            className="mt-2 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2"
          >
            <code className="text-sm">{code}</code>
          </pre>
        );
      }

      if (segment.startsWith('`') && segment.endsWith('`')) {
        return (
          <code
            key={`${segment}-${index}`}
            className="rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 text-sm"
          >
            {segment.slice(1, -1)}
          </code>
        );
      }

      return <span key={`${segment}-${index}`}>{segment}</span>;
    });
}

function renderDetailList(detailLines: string[]): ReactNode {
  return (
    <ul className="m-0 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[var(--color-text-secondary)]">
      {detailLines.map((line, index) => (
        <li key={`${line}-${index}`} className="m-0 pl-1">
          {renderTextWithCode(line)}
        </li>
      ))}
    </ul>
  );
}

function renderProjectLinks(
  links: { label: string; href: string; external?: boolean }[] | undefined
): ReactNode {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--color-text-secondary)]">
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          href={link.href}
          target={link.external ? '_blank' : '_self'}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-text-primary)]"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function renderActivityList(activityItems: Activity[]): ReactNode {
  return (
    <div className="space-y-5">
      {activityItems.map((activity) => (
        <article
          key={`${activity.organization}-${activity.period}`}
          className="space-y-3 border-b border-[var(--color-border)] pb-5 last:border-b-0 last:pb-0"
        >
          <div className="space-y-1">
            <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">
              {activity.title}
            </p>
            <p className="m-0 text-sm text-[var(--color-text-secondary)]">
              {activity.organization}
            </p>
            <p className="m-0 text-sm text-[var(--color-text-tertiary)]">
              {activity.period}
            </p>
          </div>

          <ul className="m-0 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[var(--color-text-secondary)]">
            {activity.description.map((description, index) => (
              <li
                key={`${activity.organization}-${index}`}
                className="m-0 pl-1"
              >
                {description}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function ResumePage() {
  const careerYears = calculateCareerYears();
  const professionalProjects = experiences.flatMap((experience) =>
    experience.projects.map((project) => ({
      company: experience.company,
      role: experience.role,
      period: experience.period,
      project,
    }))
  );
  const writingActivities = activities.filter((activity) =>
    ['유쾌한 스프링방 스터디 6기', '인프런'].includes(activity.organization)
  );
  const backgroundActivities = activities.filter(
    (activity) => !writingActivities.includes(activity)
  );
  const profileLinks = [
    {
      label: 'Email',
      value: (
        <a
          href={`mailto:${personalInfo.email}`}
          className="transition-colors hover:text-[var(--color-text-primary)]"
        >
          {personalInfo.email}
        </a>
      ),
    },
    personalInfo.phone
      ? {
          label: 'Phone',
          value: (
            <a
              href={`tel:${personalInfo.phone}`}
              className="transition-colors hover:text-[var(--color-text-primary)]"
            >
              {personalInfo.phone}
            </a>
          ),
        }
      : null,
    {
      label: 'GitHub',
      value: (
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[var(--color-text-primary)]"
        >
          {personalInfo.github.replace('https://', '')}
        </a>
      ),
    },
    personalInfo.blog
      ? {
          label: 'Blog',
          value: (
            <a
              href={personalInfo.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--color-text-primary)]"
            >
              {personalInfo.blog.replace('https://', '')}
            </a>
          ),
        }
      : null,
  ].filter(Boolean);

  return (
    <main className="bg-[var(--color-bg-primary)] py-12 md:py-16">
      <Container size="xl">
        <div className="bg-[var(--color-bg-primary)]">
          <header className="border-y border-[var(--color-border)] py-10 md:py-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-7">
                <div className="space-y-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-5">
                    <h1 className="text-4xl font-semibold text-[var(--color-text-primary)] md:text-5xl">
                      {personalInfo.name}
                    </h1>
                    <div className="space-y-2 sm:pt-1 md:pt-2">
                      <p className="m-0 text-lg text-[var(--color-text-secondary)]">
                        {personalInfo.position}
                      </p>
                      <p className="m-0 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                        Backend · Data Pipelines · Operations Automation
                      </p>
                    </div>
                  </div>

                  <div className="max-w-4xl space-y-4">
                    <h2 className="break-keep text-base font-medium leading-7 text-[var(--color-text-primary)]">
                      {heroStatement}
                    </h2>
                    <div className="max-w-3xl space-y-3">
                      {heroSummary.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="break-keep text-base leading-7 text-[var(--color-text-secondary)]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <p className="max-w-3xl break-keep border-l-2 border-[var(--color-text-primary)] pl-4 text-base leading-7 text-[var(--color-text-primary)]">
                      {motivationStatement}
                    </p>
                  </div>

                  <dl className="grid gap-5 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2">
                    {resumeHighlights.map((highlight) => (
                      <div key={highlight.label} className="space-y-1">
                        <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                          {highlight.label}
                        </dt>
                        <dd className="m-0 space-y-1">
                          <p className="text-base font-semibold text-[var(--color-text-primary)]">
                            {highlight.value}
                          </p>
                          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                            {highlight.description}
                          </p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="space-y-5 lg:border-l lg:border-[var(--color-border)] lg:pl-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                  Contact
                </p>
                <dl className="grid content-start gap-y-5 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
                  {profileLinks.map((item) => {
                    if (!item) {
                      return null;
                    }

                    return (
                      <div key={item.label} className="space-y-1">
                        <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                          {item.label}
                        </dt>
                        <dd className="m-0 whitespace-nowrap">{item.value}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
          </header>

          <div className="grid gap-12 py-12 md:py-14 lg:grid-cols-3">
            <aside className="order-last space-y-10 lg:order-first lg:col-span-1">
              <section className="space-y-4">
                <SectionTitle
                  title="Profile"
                  description={`실무 경력 ${careerYears}년+`}
                />
                <div className="space-y-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                  <p>{personalInfo.introduction}</p>
                  <p>
                    결제·정산·IoT 도메인에서 Java 기반 서버와 백오피스 시스템을
                    설계하고 운영해온 {careerYears}년차 엔지니어입니다. 반복되는
                    운영 요청과 수작업 리스크를 표준화와 자동화로 흡수하는
                    방식으로 일합니다.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <SectionTitle title="Skills" />
                <div className="space-y-5">
                  {personalInfo.skillGroups.map((group) => (
                    <section key={group.category} className="space-y-2.5">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                        {group.category}
                      </h3>
                      {group.description ? (
                        <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                          {group.description}
                        </p>
                      ) : null}
                      <ul className="m-0 list-none space-y-1 p-0 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {group.skills.map((skill) => (
                          <li key={skill} className="m-0">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionTitle
                  title="Writing & Mentoring"
                  description="문제를 말로 정리하고 공유하는 활동"
                />
                {renderActivityList(writingActivities)}
              </section>

              <section className="space-y-4">
                <SectionTitle title="Education" />
                <div className="space-y-5">
                  {education.map((item) => (
                    <article
                      key={`${item.school}-${item.period}`}
                      className="space-y-1 text-sm"
                    >
                      <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">
                        {item.school}
                      </p>
                      <p className="m-0 text-sm text-[var(--color-text-secondary)]">
                        {item.degree} · {item.major}
                      </p>
                      <p className="m-0 text-sm text-[var(--color-text-tertiary)]">
                        {item.period} · {item.status}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionTitle title="Certifications" />
                <div className="space-y-4">
                  {certifications.map((certification) => (
                    <article
                      key={`${certification.name}-${certification.date}`}
                      className="space-y-1 text-sm"
                    >
                      <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">
                        {certification.name}
                      </p>
                      <p className="m-0 text-sm text-[var(--color-text-secondary)]">
                        {certification.issuer}
                      </p>
                      <p className="m-0 text-sm text-[var(--color-text-tertiary)]">
                        {certification.date}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionTitle title="Background" />
                {renderActivityList(backgroundActivities)}
              </section>
            </aside>

            <div className="order-first space-y-12 lg:order-last lg:col-span-2">
              <section className="space-y-8">
                <SectionTitle
                  title="How I Work"
                  description="반복을 구조로 옮길 때 지키는 기준"
                />

                <div className="grid gap-5 md:grid-cols-3">
                  {workingPrinciples.map((principle) => (
                    <article
                      key={principle.title}
                      className="space-y-2 border-t border-[var(--color-border)] pt-4"
                    >
                      <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                        {principle.title}
                      </h3>
                      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                        {principle.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <SectionTitle
                  title="Experience"
                  description="실무에서 반복과 데이터 흐름을 다룬 경험"
                />

                <div className="space-y-8">
                  {experiences.map((experience) => (
                    <article
                      key={`${experience.company}-${experience.period}`}
                      className="space-y-4 border-b border-[var(--color-border)] pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                            {experience.company}
                          </h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {experience.role}
                          </p>
                        </div>
                        <div className="space-y-1 text-sm text-[var(--color-text-tertiary)] sm:text-right">
                          <p>{experience.period}</p>
                          <p>{calculateDuration(experience.period)}</p>
                        </div>
                      </div>

                      <p className="break-keep text-sm leading-6 text-[var(--color-text-secondary)]">
                        {experience.summary}
                      </p>

                      <ul className="m-0 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {experience.highlights.map((highlight) => (
                          <li
                            key={`${experience.company}-${highlight}`}
                            className="m-0 pl-1"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <SectionTitle
                  title="Selected Work"
                  description="문제를 어떻게 해석하고 구조로 옮겼는지"
                />

                <div className="space-y-10">
                  {professionalProjects.map(
                    ({ company, role, period, project }) => (
                      <article
                        key={`${company}-${project.title}`}
                        className="space-y-4 border-b border-[var(--color-border)] pb-10 last:border-b-0 last:pb-0"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                              {company}
                            </p>
                            <div className="space-y-1">
                              <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
                                {project.title}
                              </h3>
                              <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                                {project.description}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-[var(--color-text-tertiary)] sm:text-right">
                            <p>{role}</p>
                            <p>{period}</p>
                          </div>
                        </div>

                        <dl className="space-y-5">
                          {orderExperienceStages(project.stages).map(
                            (stage) => (
                              <div
                                key={`${project.title}-${stage.key}`}
                                className="space-y-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:space-y-0"
                              >
                                <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                                  {stage.label}
                                </dt>
                                <dd className="m-0 sm:col-span-3">
                                  {renderDetailList(stage.detail)}
                                </dd>
                              </div>
                            )
                          )}
                        </dl>

                        {renderProjectLinks(project.links)}
                      </article>
                    )
                  )}
                </div>
              </section>

              <section className="space-y-8">
                <SectionTitle
                  title="Technical Experiments"
                  description="개인 프로젝트는 설계 가설과 운영 기준을 검증하는 방식으로 정리했습니다."
                />

                <div className="space-y-8">
                  {personalProjects.map((project) => (
                    <article
                      key={`${project.title}-${project.period}`}
                      className="space-y-4 border-b border-[var(--color-border)] pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
                            {project.title}
                          </h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {project.role}
                          </p>
                        </div>
                        <div className="space-y-1 text-sm text-[var(--color-text-tertiary)] sm:text-right">
                          <p>{project.period}</p>
                          <p>{calculateDuration(project.period)}</p>
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                        {project.description}
                      </p>

                      <dl className="space-y-5">
                        {orderExperienceStages(project.stages).map((stage) => (
                          <div
                            key={`${project.title}-${stage.key}`}
                            className="space-y-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:space-y-0"
                          >
                            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                              {stage.label}
                            </dt>
                            <dd className="m-0 sm:col-span-3">
                              {renderDetailList(stage.detail)}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {renderProjectLinks(project.links)}
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
