'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        <div className="fixed top-0 left-0 right-0 z-[1001] flex items-center bg-[var(--bg-primary)] py-1 px-4 gap-3 border-b border-[var(--border)] max-md:px-3 max-md:gap-2">
            <div className="flex-1 h-[3px] bg-[var(--border)] rounded-sm overflow-hidden relative max-md:h-0.5">
                <div
                    ref={progressBarRef}
                    className="absolute top-0 left-0 w-full h-full bg-[var(--accent-primary)] origin-left scale-x-0 rounded-sm"
                />
            </div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] min-w-10 text-right tabular-nums max-md:text-[10px] max-md:min-w-[35px]">
                {progress}%
            </div>
        </div>
    );
}
