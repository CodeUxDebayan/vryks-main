import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';
import { useReducedMotion } from '../hooks/useReducedMotion';

type CursorState = 'default' | 'hover' | 'explore' | 'view' | 'enter';

interface CursorContext {
  state: CursorState;
  label: string;
}

// Global cursor state singleton
let _setCursorContext: ((ctx: CursorContext) => void) | null = null;

export const setCursor = (state: CursorState, label?: string) => {
  const labels: Record<CursorState, string> = {
    default: '[scroll down]',
    hover: '',
    explore: '[scroll down]',
    view: '[view]',
    enter: '[enter ↗]',
  };
  _setCursorContext?.({ state, label: label ?? labels[state] });
};

export function CustomCursor() {
  const mouse = useMousePosition();
  const reduced = useReducedMotion();
  const [ctx, setCtx] = useState<CursorContext>({ state: 'explore', label: '[scroll down]' });

  // Inner dot — faster
  const dotX = useRef(0);
  const dotY = useRef(0);
  const dotRef = useRef<HTMLDivElement>(null);

  // Outer ring — slower
  const ringX = useRef(0);
  const ringY = useRef(0);
  const ringRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);

  useEffect(() => {
    _setCursorContext = setCtx;
    return () => { _setCursorContext = null; };
  }, []);

  useEffect(() => {
    if (reduced) return;

    const animate = () => {
      // Inner dot — very responsive
      dotX.current += (mouse.rawX - dotX.current) * 0.35;
      dotY.current += (mouse.rawY - dotY.current) * 0.35;

      // Outer ring — physically lagged
      ringX.current += (mouse.rawX - ringX.current) * 0.1;
      ringY.current += (mouse.rawY - ringY.current) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX.current}px, ${dotY.current}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX.current}px, ${ringY.current}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouse.rawX, mouse.rawY, reduced]);

  if (reduced) return null;

  const isExpanded = ctx.state !== 'default';
  const hasLabel = ctx.label.length > 0;
  const ringSize = hasLabel ? 92 : isExpanded ? 48 : 28;

  return (
    <>
      {/* Outer ring */}
      <div
        id="custom-cursor-ring"
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {hasLabel && (
            <motion.span
              key={ctx.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: '#eaff00',
                fontFamily: '"Inter", sans-serif',
                pointerEvents: 'none',
                userSelect: 'none',
                position: 'absolute',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {ctx.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Inner dot */}
      <div
        id="custom-cursor-dot"
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#eaff00',
          boxShadow: '0 0 6px #eaff00',
          pointerEvents: 'none',
          zIndex: 100000,
          opacity: 1,
        }}
      />
    </>
  );
}

