'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface TypingTextProps {
    text: string;
    speed?: number; // ms per char
    delay?: number; // start delay in seconds
    className?: string;
    href?: string;
    target?: string;
    hideCursorOnComplete?: boolean;
}

export default function TypingText({
    text,
    speed = 30,
    delay = 0,
    className,
    href,
    target,
    hideCursorOnComplete = true,
}: TypingTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setIsStarted(true);
        }, delay * 1000);

        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
                return;
            }

            setDisplayedText(text.slice(0, currentIndex + 1));
            currentIndex++;
        }, speed);

        return () => clearInterval(interval);
    }, [isStarted, text, speed]);

    // Blinking Cursor Component
    const Cursor = () => (
        <span
            className={clsx(
                "inline-block w-[2px] h-[1em] bg-current ml-[1px] align-middle",
                "animate-blink",
                (isComplete && hideCursorOnComplete) ? "hidden" : ""
            )}
        />
    );

    const content = (
        <>
            {displayedText}
            <Cursor />
        </>
    );

    // Common container styles
    const containerClasses = clsx('relative inline-block', className);

    if (href) {
        return (
            <span className={containerClasses}>
                {/* Ghost text for layout stability */}
                <span className="invisible whitespace-pre">{text}</span>
                {/* Visible typing text */}
                <Link
                    href={href}
                    target={target}
                    className="absolute inset-0 whitespace-pre"
                >
                    {content}
                </Link>
            </span>
        );
    }

    return (
        <span className={containerClasses}>
            {/* Ghost text for layout stability */}
            <span className="invisible whitespace-pre">{text}</span>
            {/* Visible typing text */}
            <span className="absolute inset-0 whitespace-pre">
                {content}
            </span>
        </span>
    );
}
