'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';

export default function ResumePreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-24 overflow-hidden">
      <Container size="md">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="text-[var(--color-toss-blue)] font-bold tracking-wider uppercase text-sm">
              About Me
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-grey-900)] leading-tight">
              저를 한마디로 표현하면
              <br />
              <span className="text-[var(--color-toss-blue)]">Problem Solver</span> 입니다.
            </h2>
            <p className="text-lg text-[var(--color-grey-600)] leading-relaxed">
              사용자 가치 중심의 문제 해결에 몰두하며, 안정적이고 확장 가능한 시스템을 설계하고 구현합니다.
              데이터 기반의 의사결정으로 난제를 극복하고, 동료와 함께 문제를 해결하며 성장하는 엔지니어입니다.
            </p>

            <div className="pt-4">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-3">
                Main Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Java',
                  'Spring Boot',
                  'MySQL',
                  'AWS',
                  'Kafka',
                  'Flink',
                  'ClickHouse',
                  'JPA',
                ].map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-full text-sm text-[var(--color-grey-700)] font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="relative">
            {/* Timeline / Experience Card Preview */}
            <motion.div
              style={{ y }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
              className="bg-[var(--color-bg-primary)] p-8 rounded-2xl shadow-soft border border-[var(--color-border)] relative z-10"
            >
              <h3 className="text-xl font-bold text-[var(--color-grey-900)] mb-6 flex items-center gap-2">
                <span>🏢</span> Experience
              </h3>

              <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--color-grey-100)]">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-[6px] w-4 h-4 rounded-full bg-[var(--color-toss-blue)] border-4 border-[var(--color-bg-primary)] shadow-sm"></div>
                  <h4 className="font-bold text-[var(--color-grey-900)]">Software Engineer</h4>
                  <p className="text-[var(--color-toss-blue)] font-medium text-sm">
                    @9.81park (Monolith)
                  </p>
                  <p className="text-[var(--color-grey-500)] text-xs mt-1">
                    2021.05 - Present
                  </p>
                  <ul className="mt-2 text-sm text-[var(--color-grey-600)] list-disc list-inside marker:text-[var(--color-grey-400)]">
                    <li>테마파크 IoT 서버 시스템 주담당</li>
                    <li>건강한 사내문화 주도 개선</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-grey-50)] text-center">
                <Link
                  href="/resume"
                  className="text-sm text-[var(--color-blue-500)] hover:text-[var(--color-toss-blue)] transition-colors font-medium"
                >
                  + View more experience
                </Link>
              </div>
            </motion.div>

            {/* Decoration */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-100 rounded-full blur-3xl -z-10"
            ></motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
