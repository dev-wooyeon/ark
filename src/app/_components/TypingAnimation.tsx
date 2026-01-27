'use client';

import { useState, useEffect } from 'react';
import { TYPING_SPEED } from '@/lib/constants';

interface TypingAnimationProps {
  /** 타이핑할 텍스트 (HTML 포함 가능) */
  text: string;
  /** 타이핑 속도 (ms) - 기본값: 15 */
  speed?: number;
}

/**
 * HTML 태그를 인식하는 타이핑 애니메이션 컴포넌트
 * - HTML 태그는 즉시 렌더링되고 텍스트만 한 글자씩 타이핑됨
 * - 접근성: 스크린리더는 완성된 텍스트를 즉시 읽음
 */
export default function TypingAnimation({
  text,
  speed = TYPING_SPEED.fast,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

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

    const totalVisibleChars = text.replace(/<[^>]*>/g, '').length;

    const timeout = setTimeout(() => {
      if (charIndex < totalVisibleChars) {
        setDisplayText(getDisplayText(text, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        setIsComplete(true);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, text, speed, isComplete]);

  return (
    <span className="inline-block min-h-[1.3em]">
      {/* 스크린리더용 전체 텍스트 (시각적으로 숨김) */}
      <span className="sr-only">{text.replace(/<[^>]*>/g, '')}</span>

      {/* 시각적 타이핑 애니메이션 */}
      <span aria-hidden="true">
        <span dangerouslySetInnerHTML={{ __html: displayText }} />
        {!isComplete && (
          <span
            className="inline-block ml-0.5 animate-blink font-light"
            aria-hidden="true"
          >
            |
          </span>
        )}
      </span>
    </span>
  );
}
