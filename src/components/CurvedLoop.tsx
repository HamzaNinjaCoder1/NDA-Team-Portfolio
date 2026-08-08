import React, { useRef, useEffect, useState, useMemo, useId } from 'react';
import './CurvedLoop.css';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

const CurvedLoop: React.FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className = '',
  curveAmount = 400,
  direction = 'left',
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, '')}`;
  const pathD = `M-100,25 Q720,${25 + curveAmount} 1540,25`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<'left' | 'right'>(direction);
  const velRef = useRef(0);

  const textLength = spacing || text.length * 36;
  const totalText = useMemo(() => Array(Math.ceil(2000 / textLength) + 3)
    .fill(text)
    .join(''), [text, textLength]);
  const ready = true;

  useEffect(() => {
    const updateSpacing = () => {
      if (measureRef.current) {
        const measured = measureRef.current.getComputedTextLength();
        if (measured > 0) {
          setSpacing(measured);
        } else {
          setSpacing(text.length * 36);
        }
      }
    };
    updateSpacing();
    const timer1 = setTimeout(updateSpacing, 50);
    const timer2 = setTimeout(updateSpacing, 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [text, className]);

  useEffect(() => {
    if (!textLength) return;
    if (textPathRef.current) {
      const initial = -textLength;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
    }
  }, [textLength]);

  useEffect(() => {
    if (!textLength) return;
    let frame = 0;
    let running = true;
    let visible = true;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;

        const wrapPoint = textLength;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
      }
      if (running) frame = requestAnimationFrame(step);
    };
    const updateRunning = () => {
      const shouldRun = visible && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(step);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateRunning();
    }, { threshold: 0, rootMargin: '100px' });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    document.addEventListener('visibilitychange', updateRunning);
    frame = requestAnimationFrame(step);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateRunning);
    };
  }, [textLength, speed]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    setIsDragging(true);
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;

    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    setIsDragging(false);
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (isDragging ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      ref={wrapperRef}
      className="curved-loop-jacket"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 135">
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text fontWeight="bold" xmlSpace="preserve" className={className}>
            <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
