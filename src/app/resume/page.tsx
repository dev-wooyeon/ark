'use client';

import Link from 'next/link';
import BackLink from '../_components/BackLink';
import { personalInfo, experiences } from '@/data/resume';

export default function Resume() {
  return (
    <div className="min-h-screen p-8 bg-[var(--bg-primary)] max-md:p-4 max-[480px]:px-3">
      <header className="max-w-[800px] mx-auto mb-16">
        <BackLink href="/" text="← Home" />
        <h1 className="font-[ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[clamp(2.5rem,6vw,3.5rem)] font-bold text-[var(--text-primary)] m-0 tracking-[-0.02em] max-md:text-[2rem] max-[480px]:text-[1.75rem]">
          Resume
        </h1>
      </header>

      <main className="max-w-[800px] mx-auto">
        {/* Personal Info Grid */}
        <section className="grid grid-cols-4 gap-10 mb-16 pb-12 border-b border-[var(--border)] max-lg:grid-cols-2 max-lg:gap-x-8 max-lg:gap-y-6 max-lg:mb-12 max-lg:pb-10">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">ID / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">
              {personalInfo.name}<br />
              <span className="text-[13px] text-[var(--text-tertiary)] font-normal max-lg:text-xs max-[480px]:text-[11px]">{personalInfo.birthDate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Position / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">{personalInfo.position}</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Keyword / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">{personalInfo.keywords}</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-[0.08em] font-semibold max-lg:text-[11px]">Contact / </div>
            <div className="text-[15px] text-[var(--text-primary)] leading-relaxed font-normal max-lg:text-sm max-[480px]:text-[13px]">
              <a href={`mailto:${personalInfo.email}`} className="text-[var(--accent-primary)] underline underline-offset-[3px] decoration-[var(--accent-primary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)]">
                {personalInfo.email}
              </a>
            </div>
          </div>
        </section>

        {/* Work Sections */}
        {experiences.map((exp, expIndex) => (
          <div key={expIndex}>
            <hr className="h-px border-0 bg-[#5b504c] my-8 opacity-70" />

            <section className="grid grid-cols-[200px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-8">
              <div className="flex flex-col gap-2 sticky top-8 self-start max-lg:static max-lg:gap-1">
                <h2 className="text-[20px] font-bold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-[18px]">{exp.company}</h2>
                <div className="text-sm text-[var(--text-secondary)] font-normal leading-normal max-lg:text-[13px]">{exp.role}</div>
                <div className="text-[13px] text-[var(--text-tertiary)] font-normal mt-1 max-lg:text-xs">{exp.period}</div>
              </div>

              <div className="flex flex-col gap-6">
                {exp.projects.map((project, projIndex) => (
                  <article key={projIndex} className="flex flex-col gap-4 pb-6 border-b border-[#5b504c] last:border-b-0 last:pb-0 max-lg:gap-3 max-lg:pb-6">
                    <h3 className="text-[18px] font-semibold text-[var(--text-primary)] m-0 tracking-[-0.01em] max-lg:text-base">{project.title}</h3>
                    <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] m-0 font-normal max-lg:text-sm max-[480px]:text-[13px]">
                      {project.description}
                    </p>
                    <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
                      {project.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-[15px] text-[var(--text-secondary)] leading-[1.7] max-lg:text-sm max-[480px]:text-[13px]">
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
                                      className="text-[var(--accent-primary)] underline underline-offset-[2px] decoration-[var(--accent-primary)] transition-all duration-200 text-sm font-normal hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)] max-lg:text-[13px]"
                                    >
                                      {link.label}
                                    </a>
                                  ) : (
                                    <Link
                                      href={link.href}
                                      className="text-[var(--accent-primary)] underline underline-offset-[2px] decoration-[var(--accent-primary)] transition-all duration-200 text-sm font-normal hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)] max-lg:text-[13px]"
                                    >
                                      {link.label}
                                    </Link>
                                  )}
                                  {linkIndex < project.links.length - 1 && ' · '}
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
      </main>
    </div>
  );
}
