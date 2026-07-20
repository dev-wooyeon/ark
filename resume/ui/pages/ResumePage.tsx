import { Metadata } from 'next';
import {
  personalInfo,
  resumeCapabilities,
  resumeSummaryExperiences,
} from '@/resume/model/resume-data';
import { createSiteUrl } from '@/site/config/site';

const resumeUrl = createSiteUrl('/resume');
const description = `${personalInfo.name}의 요약 이력`;

export const metadata: Metadata = {
  title: 'Resume',
  description,
  alternates: {
    canonical: resumeUrl,
  },
  openGraph: {
    title: 'Resume',
    description,
    url: resumeUrl,
  },
};

function SummaryLink({
  children,
  href,
}: {
  children: string;
  href: string;
}) {
  return (
    <a
      className="text-text-primary underline decoration-border underline-offset-4 transition-colors hover:text-text-secondary"
      href={href}
    >
      {children}
    </a>
  );
}

export default function ResumePage() {
  return (
    <main className="pt-3 text-text-primary">
      <section aria-labelledby="resume-name">
        <header>
          <div className="grid grid-cols-2 gap-y-2 text-xs leading-4 text-text-secondary lg:grid-cols-4">
            <p className="m-0 font-mono">ID /</p>
            <p className="m-0 font-mono">Role /</p>
            <p className="m-0 font-mono">Focus /</p>
            <p className="m-0 font-mono">Contact /</p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-y-3 text-base leading-6 lg:grid-cols-4">
            <h1 id="resume-name" className="m-0 text-base font-medium leading-6">
              {personalInfo.name}
            </h1>
            <p className="m-0 break-keep">백엔드 엔지니어</p>
            <p className="m-0 break-keep">데이터 플랫폼</p>
            <p className="m-0 break-all">
              <SummaryLink href={`mailto:${personalInfo.email}`}>
                {personalInfo.email}
              </SummaryLink>
            </p>
          </div>
        </header>

        <div className="mt-8 space-y-8" aria-label="Experience">
          {resumeSummaryExperiences.map((experience) => (
            <article
              key={`${experience.company}-${experience.period}`}
              className="grid grid-cols-2 gap-y-3 lg:grid-cols-4"
            >
              <header className="col-span-2 space-y-1 lg:col-span-1">
                <h2 className="m-0 text-base font-medium leading-6 text-text-primary">
                  {experience.company}
                </h2>
                {experience.roleLines.map((roleLine) => (
                  <p
                    key={roleLine}
                    className="m-0 break-keep text-sm leading-5 text-text-secondary"
                  >
                    {roleLine}
                  </p>
                ))}
                {experience.period ? (
                  <p className="m-0 font-mono text-xs leading-4 text-text-secondary">
                    {experience.period}
                  </p>
                ) : null}
              </header>

              <dl className="col-span-2 space-y-4 lg:col-span-3">
                {experience.projects.map((project) => (
                  <div
                    key={project.title}
                    className="grid gap-y-1 lg:grid-cols-3 lg:gap-x-6"
                  >
                    <dt className="space-y-1 lg:col-span-1">
                      <h3 className="m-0 break-keep text-sm font-medium leading-5 text-text-primary">
                        {project.title}
                      </h3>
                      <p className="m-0 break-keep text-sm leading-5 text-text-secondary">
                        {project.summary}
                      </p>
                      {project.links && project.links.length > 0 ? (
                        <div
                          aria-label="관련 회고글"
                          className="flex flex-wrap gap-x-3 gap-y-1 pt-1 font-mono text-xs leading-4 text-text-secondary"
                        >
                          {project.links.map((link) => (
                            <SummaryLink key={link.href} href={link.href}>
                              {link.label}
                            </SummaryLink>
                          ))}
                        </div>
                      ) : null}
                    </dt>
                    <dd className="m-0 break-keep text-sm leading-6 text-text-primary lg:col-span-2">
                      {project.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <section
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-3"
          aria-labelledby="resume-capabilities"
        >
          <h2
            id="resume-capabilities"
            className="col-span-2 m-0 font-mono text-xs leading-4 text-text-secondary lg:col-span-3"
          >
            기술 /
          </h2>
          {resumeCapabilities.map((capability) => (
            <article key={capability.label} className="space-y-1">
              <h3 className="m-0 font-mono text-xs leading-4 text-text-secondary">
                {capability.label}
              </h3>
              <p className="m-0 text-sm leading-5 text-text-primary">
                {capability.values.join(' · ')}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
