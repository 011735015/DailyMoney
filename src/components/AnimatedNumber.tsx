import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 500,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev === value) return;

    // Detect direction for visual flash microinteraction
    if (value > prev) {
      setFlash('up');
    } else if (value < prev) {
      setFlash('down');
    }

    const timer = setTimeout(() => {
      setFlash(null);
    }, 600);

    const startTime = performance.now();
    const startVal = prev;
    const diff = value - startVal;

    let animId: number;
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
        prevValueRef.current = value;
      }
    };

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
      prevValueRef.current = value;
    };
  }, [value, duration]);

  const flashClass =
    flash === 'up'
      ? 'scale-105 transition-transform duration-200 text-emerald-600'
      : flash === 'down'
      ? 'scale-105 transition-transform duration-200 text-rose-600'
      : 'transition-transform duration-300';

  return (
    <span className={`inline-block tabular-nums font-mono ${flashClass} ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};
