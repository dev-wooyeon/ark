import { Metadata } from 'next';
import { Header, Container } from '@/components/layout';
import { experiences, personalInfo, education, activities, certifications } from '@/data/resume';

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

            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-2xl text-[var(--color-grey-900)]">
                {personalInfo.name}
              </h2>
              <p className="text-xl text-[var(--color-grey-700)] font-medium">
                {personalInfo.position}
              </p>
              {personalInfo.introduction && (
                <p className="text-[var(--color-grey-600)] mt-2 leading-relaxed">
                  {personalInfo.introduction}
                </p>
              )}
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
                    <div className="inline-flex flex-col md:items-end">
                      <span className="inline-block px-3 py-1 bg-[var(--color-toss-blue)]/5 text-[var(--color-toss-blue)] text-sm font-bold rounded-lg mb-2">
                        {exp.period.includes('(') ? (
                          <>
                            <span className="block">{exp.period.split(' (')[0]}</span>
                            <span className="block text-xs opacity-70 font-medium mt-0.5">
                              ({exp.period.split(' (')[1]}
                            </span>
                          </>
                        ) : (
                          exp.period
                        )}
                      </span>
                    </div>
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

          {/* Education Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-8 flex items-center gap-2 border-b border-[var(--color-grey-100)] pb-4">
              <span className="tossface text-3xl">🎓</span> Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
                  <div className="md:text-right">
                    <span className="inline-block px-3 py-1 bg-[var(--color-grey-100)] text-[var(--color-grey-700)] text-sm font-medium rounded-full">
                      {edu.period}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-grey-900)]">
                      {edu.school}
                    </h3>
                    <p className="text-[var(--color-grey-700)] mt-1">
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
            <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-8 flex items-center gap-2 border-b border-[var(--color-grey-100)] pb-4">
              <span className="tossface text-3xl">🌟</span> Activities
            </h2>
            <div className="space-y-8">
              {activities.map((activity, index) => (
                <div key={index} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
                  <div className="md:text-right">
                    <span className="inline-block px-3 py-1 bg-[var(--color-grey-100)] text-[var(--color-grey-700)] text-sm font-medium rounded-full">
                      {activity.period}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-grey-900)] mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-[var(--color-grey-600)] font-medium mb-4">
                      {activity.organization}
                    </p>
                    <ul className="space-y-2 pl-0 ml-0 list-none">
                      {activity.description.map((desc, dIndex) => (
                        <li key={dIndex} className="flex items-start gap-2 text-[var(--color-grey-800)] text-base leading-relaxed">
                          <span className="tossface text-sm mt-0.5 shrink-0">✔️</span>
                          <span>{desc}</span>
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
            <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-8 flex items-center gap-2 border-b border-[var(--color-grey-100)] pb-4">
              <span className="tossface text-3xl">📜</span> Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="p-6 bg-[var(--color-grey-50)] rounded-[var(--radius-md)] border border-[var(--color-grey-100)]">
                  <h3 className="text-lg font-bold text-[var(--color-grey-900)] mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-[var(--color-grey-600)] text-sm mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-[var(--color-grey-500)] text-sm">
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
