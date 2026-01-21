'use client';

import { useState, useEffect } from 'react';
import styles from './TypingAnimation.module.css';

interface LinkPattern {
  pattern: string;
  url: string;
}

interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  linkPatterns?: LinkPattern[];
}

export default function TypingAnimation({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  linkPatterns = []
}: TypingAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const renderTextWithLinks = (text: string) => {
    let result = text;
    linkPatterns.forEach(({ pattern, url }) => {
      result = result.replace(
        pattern,
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${styles.bioLink}">${pattern}</a>`
      );
    });
    return { __html: result };
  };

  useEffect(() => {
    if (isComplete) return;

    const fullText = texts[currentTextIndex];

    const timeout = setTimeout(() => {
      if (currentText.length < fullText.length) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
      } else {
        // Finished typing
        setIsComplete(true);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, texts, speed, isComplete]);

  return (
    <span className={styles.typingText}>
      <span dangerouslySetInnerHTML={renderTextWithLinks(currentText)} />
      {!isComplete && <span className={styles.cursor}>|</span>}
    </span>
  );
}
