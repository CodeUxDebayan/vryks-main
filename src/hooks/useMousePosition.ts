import { useEffect, useRef, useState } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  velocityX: number;
  velocityY: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

const SMOOTHING = 0.08;

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0, y: 0, rawX: 0, rawY: 0,
    velocityX: 0, velocityY: 0,
    normalizedX: 0, normalizedY: 0,
  });

  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    currentX: 0, currentY: 0,
    targetX: 0, targetY: 0,
    prevX: 0, prevY: 0,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const s = stateRef.current;
      s.targetX = e.clientX;
      s.targetY = e.clientY;
    };

    const tick = () => {
      const s = stateRef.current;
      s.prevX = s.currentX;
      s.prevY = s.currentY;
      s.currentX += (s.targetX - s.currentX) * SMOOTHING;
      s.currentY += (s.targetY - s.currentY) * SMOOTHING;

      const vx = s.currentX - s.prevX;
      const vy = s.currentY - s.prevY;

      setPosition({
        x: s.currentX,
        y: s.currentY,
        rawX: s.targetX,
        rawY: s.targetY,
        velocityX: vx,
        velocityY: vy,
        normalizedX: (s.currentX / window.innerWidth) * 2 - 1,
        normalizedY: (s.currentY / window.innerHeight) * 2 - 1,
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return position;
}
