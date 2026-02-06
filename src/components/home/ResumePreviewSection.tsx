import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';

export default function ResumePreviewSection() {
    return (
        <section className="py-24 bg-grey-50 border-t border-grey-100">
            <Container size="md">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="text-toss-blue font-bold tracking-wider uppercase text-sm">
                            About Me
                        </span>
                        <h2 className="text-3xl font-bold text-grey-900 leading-tight">
                            저를 한마디로 표현하면<br />
                            <span className="text-toss-blue">Problem Solver</span> 입니다.
                        </h2>
                        <p className="text-lg text-grey-600 leading-relaxed">
                            최우선적으로 사용자에게 가치를 전달하는 서비스를 만드는 과정에 집중합니다.
                            안정적이고 확장 가능한 시스템 설계를 즐기며,
                            팀원들과의 원활한 소통을 중요하게 생각합니다.
                        </p>

                        <div className="pt-4">
                            <h3 className="text-sm font-semibold text-grey-900 mb-3">Main Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Java', 'Spring Boot', 'MySQL', 'AWS', 'Kafka', 'Flink', 'ClickHouse', 'JPA'].map((skill) => (
                                    <span key={skill} className="px-3 py-1.5 bg-white border border-grey-200 rounded-full text-sm text-grey-700 font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button as="a" href="/resume" size="lg" className="shadow-soft hover:shadow-soft-lg transition-shadow">
                                <span className="mr-2">📄</span> 이력서 전체 보기
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Timeline / Experience Card Preview */}
                        <div className="bg-white p-8 rounded-2xl shadow-soft border border-grey-100 relative z-10">
                            <h3 className="text-xl font-bold text-grey-900 mb-6 flex items-center gap-2">
                                <span>🏢</span> Experience
                            </h3>

                            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-grey-100">
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-[6px] w-4 h-4 rounded-full bg-toss-blue border-4 border-white shadow-sm"></div>
                                    <h4 className="font-bold text-grey-900">Software Engineer</h4>
                                    <p className="text-toss-blue font-medium text-sm">@9.81park (Monolith)</p>
                                    <p className="text-grey-500 text-xs mt-1">2021.05 - Present</p>
                                    <ul className="mt-2 text-sm text-grey-600 list-disc list-inside marker:text-grey-400">
                                        <li>테마파크 ioT 시스템 담당</li>
                                        <li>데이터 엔지니어 직무 경험 중</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-grey-50 text-center">
                                <Link href="/resume" className="text-sm text-grey-500 hover:text-toss-blue transition-colors font-medium">
                                    + View more experience
                                </Link>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
