'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/components.module.css';

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
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const fullText = texts[0];

  // Extract visible text length (excluding HTML tags)
  const getVisibleLength = (htmlString: string, upToIndex: number) => {
    let visibleCount = 0;
    let inTag = false;

    for (let i = 0; i < upToIndex && i < htmlString.length; i++) {
      if (htmlString[i] === '<') {
        inTag = true;
      } else if (htmlString[i] === '>') {
        inTag = false;
      } else if (!inTag) {
        visibleCount++;
      }
    }

    return visibleCount;
  };

  // Get the HTML substring that shows exactly N visible characters
  const getDisplayText = (htmlString: string, visibleChars: number) => {
    let result = '';
    let visibleCount = 0;
    let inTag = false;
    let tagBuffer = '';

    for (let i = 0; i < htmlString.length; i++) {
      const char = htmlString[i];

      if (char === '<') {
        inTag = true;
        tagBuffer = '<';
      } else if (char === '>') {
        inTag = false;
        tagBuffer += '>';
        result += tagBuffer;
        tagBuffer = '';
      } else if (inTag) {
        tagBuffer += char;
      } else {
        if (visibleCount < visibleChars) {
          result += char;
          visibleCount++;
        } else {
          break;
        }
      }
    }

    return result;
  };

  useEffect(() => {
    if (isComplete) return;

    const totalVisibleChars = fullText.replace(/<[^>]*>/g, '').length;

    const timeout = setTimeout(() => {
      if (charIndex < totalVisibleChars) {
        setDisplayText(getDisplayText(fullText, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        setIsComplete(true);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, fullText, speed, isComplete]);

  return (
    <span className={styles.typingText}>
      <span dangerouslySetInnerHTML={{ __html: displayText }} />
      {!isComplete && <span className={styles.cursor}>|</span>}
    </span>
  );
}
