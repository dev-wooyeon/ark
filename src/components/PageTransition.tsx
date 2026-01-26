'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

// 라우트 깊이 계산 (홈 = 0, /feed = 1, /feed/[slug] = 2)
function getRouteDepth(pathname: string): number {
    if (pathname === '/') return 0;
    const segments = pathname.split('/').filter(Boolean);
    return segments.length;
}

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const prevPathRef = useRef<string>(pathname);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    useEffect(() => {
        const prevDepth = getRouteDepth(prevPathRef.current);
        const currentDepth = getRouteDepth(pathname);

        // 깊이가 증가하면 forward (아래로 들어감), 감소하면 backward (위로 나감)
        if (currentDepth > prevDepth) {
            setDirection('forward');
        } else if (currentDepth < prevDepth) {
            setDirection('backward');
        }
        // 같은 레벨이면 방향 유지

        prevPathRef.current = pathname;
    }, [pathname]);

    // 방향에 따른 애니메이션 설정
    const variants = {
        initial: {
            opacity: 0,
            y: direction === 'forward' ? 20 : -20,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: direction === 'forward' ? -20 : 20,
        },
    };

    return (
        <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        >
            {children}
        </motion.div>
    );
}
