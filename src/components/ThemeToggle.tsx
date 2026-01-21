'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // hydration 방지 - 클라이언트 사이드에서만 렌더링
    if (!mounted) {
        return null;
    }

    // 메인 페이지에서는 표시하지 않음
    if (pathname === '/') {
        return null;
    }

    return (
        <button
            onClick={toggleTheme}
            className={styles.toggleButton}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <FontAwesomeIcon
                icon={theme === 'light' ? faMoon : faSun}
                className={styles.icon}
            />
        </button>
    );
}
