import { Metadata } from 'next';
import { Header, Container } from '@/components/layout';
import { experiences, personalInfo } from '@/data/resume';

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
  return (
    <>
      <Header />

      <main className="py-16 bg-white">
        <Container size="md">
          {/* Profile Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-[var(--color-grey-900)] mb-6">
              Resume
            </h1>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-[var(--color-grey-900)]">
                {personalInfo.name}
              </h2>
              <p className="text-xl text-[var(--color-grey-700)] font-medium">
                {personalInfo.position}
              </p>
              {/* <p className="text-[var(--color-grey-600)]">
                {personalInfo.keywords}
              </p> */}
            </div>

            {/* Contact & Links */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-[var(--color-grey-600)]">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 hover:text-[var(--color-toss-blue)] transition-colors"
              >
                <span className="tossface">📧</span>
                {personalInfo.email}
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[var(--color-toss-blue)] transition-colors"
              >
                <span className="tossface">🐱</span>
                GitHub
              </a>
            </div>
          </header>

          {/* Skills Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-8 flex items-center gap-2">
              <span className="tossface text-3xl">🛠️</span> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {personalInfo.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-[var(--color-grey-50)] text-[var(--color-grey-800)] rounded-[var(--radius-md)] font-medium border border-[var(--color-grey-100)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-16">
            <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-8 flex items-center gap-2 border-b border-[var(--color-grey-100)] pb-4">
              <span className="tossface text-3xl">💼</span>
              Experience
              <span className="ml-2 text-base font-bold text-[var(--color-toss-blue)] bg-[var(--color-toss-blue)]/10 px-3 py-0.5 rounded-full align-middle">
                {years}+ Years
              </span>
            </h2>

            {experiences.map((exp, index) => (
              <article key={index} className="relative pl-4 md:pl-0">
                {/* Visual Timeline Line for mobile */}
                <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-[var(--color-grey-100)] md:hidden"></div>

                <div className="grid md:grid-cols-[200px_1fr] gap-8">
                  {/* Left Column: Period & Company */}
                  <div className="md:text-right">
                    <span className="inline-block px-3 py-1 bg-[var(--color-toss-blue)]/5 text-[var(--color-toss-blue)] text-sm font-bold rounded-full mb-2">
                      {exp.period}
                    </span>
                    <h3 className="text-xl font-bold text-[var(--color-grey-900)]">
                      {exp.company}
                    </h3>
                    <p className="text-[var(--color-grey-600)] font-medium mt-1">
                      {exp.role}
                    </p>
                  </div>

                  {/* Right Column: Projects */}
                  <div className="space-y-12">
                    {exp.projects.map((project, pIndex) => (
                      <div key={pIndex} className="relative group">
                        <h4 className="text-xl font-bold text-[var(--color-grey-900)] mb-3 group-hover:text-[var(--color-toss-blue)] transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-[var(--color-grey-700)] leading-relaxed mb-4">
                          {project.description}
                        </p>

                        <ul className="space-y-2 mb-6 pl-0 ml-0 list-none">
                          {project.achievements.map((achievement, aIndex) => (
                            <li key={aIndex} className="flex items-start gap-2 text-[var(--color-grey-800)] text-base leading-relaxed">
                              <span className="tossface text-sm mt-0.5 shrink-0">✔️</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>

                        {project.links && project.links.length > 0 && (
                          <div className="flex gap-3 mt-4">
                            {project.links.map((link, lIndex) => (
                              <a
                                key={lIndex}
                                href={link.href}
                                target={link.external ? "_blank" : "_self"}
                                rel={link.external ? "noopener noreferrer" : ""}
                                className="text-sm font-medium text-[var(--color-grey-700)] hover:text-[var(--color-toss-blue)] flex items-center gap-1.5 transition-colors bg-[var(--color-grey-100)] px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-toss-blue)]/10"
                              >
                                {link.external ? <span className="tossface text-sm">🔗</span> : <span className="tossface text-sm">📄</span>}
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
        </Container>
      </main>
    </>
  );
}
