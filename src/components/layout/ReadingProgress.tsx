'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ReadingProgress.module.css';

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ReadingProgress() {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // article 요소가 있는지 확인
        const article = document.querySelector('article');
        if (!article || !progressBarRef.current) return;

        // ScrollTrigger 설정
        const trigger = ScrollTrigger.create({
            trigger: article,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const percentage = Math.round(self.progress * 100);
                setProgress(percentage);

                // GSAP로 프로그레스 바 애니메이션
                gsap.to(progressBarRef.current, {
                    scaleX: self.progress,
                    duration: 0.1,
                    ease: 'none'
                });
            }
        });

        return () => {
            trigger.kill();
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.progressBar}>
                <div
                    ref={progressBarRef}
                    className={styles.progressFill}
                />
            </div>
            <div className={styles.percentage}>
                {progress}%
            </div>
        </div>
    );
}
