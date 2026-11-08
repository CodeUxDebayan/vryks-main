import { useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

interface ScrollCounterProps {
  value: number; // 0 to 100
  isVisible: boolean;
  stageLabel?: string;
}

export function ScrollCounter({ value, isVisible, stageLabel = 'SCROLL' }: ScrollCounterProps) {
  const [hasMouseMoved, setHasMouseMoved] = useState(false);

  // Smooth springs for mouse tracking so the loader floats smoothly near the cursor
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX + 24); // Offset slightly to the right of cursor
      cursorY.set(e.clientY + 18); // Offset slightly below cursor
      if (!hasMouseMoved) setHasMouseMoved(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, hasMouseMoved]);

  // Round value to integer 0 - 100
  const displayValue = Math.min(100, Math.max(0, Math.round(value)));

  // Calculate SVG circular progress dashoffset
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && hasMouseMoved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 10 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x: cursorX,
            y: cursorY,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {/* Glassmorphic Loader Capsule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px 6px 8px',
              borderRadius: '40px',
              background: 'rgba(10, 10, 14, 0.78)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Circular Progress Ring */}
            <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="42" height="42" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  stroke="#eaff00"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.15s ease-out',
                    filter: 'drop-shadow(0 0 4px rgba(234, 255, 0, 0.8))',
                  }}
                />
              </svg>

              {/* Centered Number inside Ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                {displayValue}
              </div>
            </div>

            {/* Label and % Symbol */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '8px',
                  letterSpacing: '0.18em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {stageLabel}
              </div>
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#eaff00',
                  letterSpacing: '0.08em',
                }}
              >
                {displayValue}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
