import Link from 'next/link';
import { PageLayout } from '../_components/PageLayout';
import { personalInfo, experiences } from '@/data/resume';

export default function Resume() {
  return (
    <PageLayout title="Resume">
        {/* Personal Info Grid */}
        <section className="grid grid-cols-4 gap-10 mb-16 pb-12 border-b border-border max-lg:grid-cols-2 max-lg:gap-x-8 max-lg:gap-y-6 max-lg:mb-12 max-lg:pb-10">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-text-tertiary uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">ID / </div>
            <div className="text-[15px] text-text-primary leading-relaxed font-normal max-lg:text-sm">
              {personalInfo.name}<br />
              <span className="text-[13px] text-text-tertiary font-normal max-lg:text-xs">{personalInfo.birthDate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-text-tertiary uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Position / </div>
            <div className="text-[15px] text-text-primary leading-relaxed font-normal max-lg:text-sm">{personalInfo.position}</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-text-tertiary uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Keyword / </div>
            <div className="text-[15px] text-text-primary leading-relaxed font-normal max-lg:text-sm">{personalInfo.keywords}</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-text-tertiary uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Contact / </div>
            <div className="text-[15px] text-text-primary leading-relaxed font-normal max-lg:text-sm">
              <a href={`mailto:${personalInfo.email}`} className="text-accent underline underline-offset-[3px] decoration-accent transition-all duration-200 hover:text-text-primary hover:decoration-text-primary">
                {personalInfo.email}
              </a>
            </div>
          </div>
        </section>

        {/* Work Sections */}
        {experiences.map((exp, expIndex) => (
          <div key={expIndex}>
            <hr className="h-px border-0 bg-border my-8 opacity-70" />

            <section className="grid grid-cols-[200px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-8">
              <div className="flex flex-col gap-2 sticky top-8 self-start max-lg:static max-lg:gap-1">
                <h2 className="text-[20px] font-bold text-text-primary m-0 tracking-[-0.01em] max-lg:text-[18px]">{exp.company}</h2>
                <div className="text-sm text-text-secondary font-normal leading-normal max-lg:text-[13px]">{exp.role}</div>
                <div className="text-[13px] text-text-tertiary font-normal mt-1 max-lg:text-xs">{exp.period}</div>
              </div>

              <div className="flex flex-col gap-6">
                {exp.projects.map((project, projIndex) => (
                  <article key={projIndex} className="flex flex-col gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
                    <h3 className="text-[18px] font-semibold text-text-primary m-0 tracking-[-0.01em] max-lg:text-base">{project.title}</h3>
                    <p className="text-[15px] text-text-secondary leading-[1.7] m-0 font-normal max-lg:text-sm">
                      {project.description}
                    </p>
                    <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                      {project.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-[15px] text-text-secondary leading-[1.7] max-lg:text-sm">
                          {achievement}
                          {project.links && achIndex === project.achievements.length - 1 && (
                            <div className="mt-2">
                              {project.links.map((link, linkIndex) => (
                                <span key={linkIndex}>
                                  {link.external ? (
                                    <a
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent underline underline-offset-[2px] decoration-accent transition-all duration-200 text-sm font-normal hover:text-text-primary hover:decoration-text-primary max-lg:text-[13px]"
                                    >
                                      {link.label}
                                    </a>
                                  ) : (
                                    <Link
                                      href={link.href}
                                      className="text-accent underline underline-offset-[2px] decoration-accent transition-all duration-200 text-sm font-normal hover:text-text-primary hover:decoration-text-primary max-lg:text-[13px]"
                                    >
                                      {link.label}
                                    </Link>
                                  )}
                                  {linkIndex < (project.links?.length ?? 0) - 1 && ' · '}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ))}
    </PageLayout>
  );
}
