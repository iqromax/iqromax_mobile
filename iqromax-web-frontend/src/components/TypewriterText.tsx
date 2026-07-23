import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  children: React.ReactNode;
  isActive: boolean;
  speed?: number;
  delay?: number;
  className?: string;
}

export const TypewriterText = ({ 
  children, 
  isActive, 
  speed = 50, 
  delay = 300,
  className = '' 
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullTextRef = useRef('');
  
  // Extract text content from children
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (typeof node === 'object' && 'props' in node) {
      return extractText((node as React.ReactElement).props.children);
    }
    return '';
  };

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    const fullText = extractText(children);
    fullTextRef.current = fullText;

    let typeInterval: ReturnType<typeof setInterval> | null = null;

    const delayTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          if (typeInterval) clearInterval(typeInterval);
          typeInterval = null;
          setIsTyping(false);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [isActive, children, speed, delay]);

  // Render with original structure but typed text
  const renderTypedContent = () => {
    if (!isActive) return null;
    
    return (
      <span className={className}>
        {displayedText}
        {isTyping && (
          <span 
            className="inline-block w-[3px] h-[1em] bg-white ml-1 animate-pulse"
            style={{ verticalAlign: 'text-bottom' }}
          />
        )}
      </span>
    );
  };

  return renderTypedContent();
};
