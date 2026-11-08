import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function Interruption() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section
      id="interruption"
      ref={ref}
      style={{
        background: '#030303',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(6rem, 14vw, 12rem) 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(245,245,240,0.04)',
      }}
    >
      {/* Subtle procedural field behind text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(109,53,255,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Faint noise texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          opacity: 0.08,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Line 1: "BORING" */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <motion.h2
          initial={{ y: '110%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(5rem, 14vw, 16rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
            color: 'rgba(245,245,240,0.08)',
          }}
        >
          BORING
        </motion.h2>
      </div>

      {/* Line 2: "IS EASY." */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <motion.h2
          initial={{ y: '110%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(5rem, 14vw, 16rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
            color: 'rgba(245,245,240,0.08)',
            marginBottom: '3rem',
          }}
        >
          IS EASY.
        </motion.h2>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{
          width: 'clamp(120px, 20vw, 240px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(234, 255, 0,0.5), transparent)',
          transformOrigin: 'center',
          marginBottom: '3rem',
        }}
      />

      {/* Line 3: "WE CHOOSE" — revealed */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <motion.h2
          initial={{ y: '110%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(5rem, 14vw, 16rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
            color: '#f5f5f0',
          }}
        >
          WE CHOOSE
        </motion.h2>
      </div>

      {/* Line 4: "OTHERWISE." */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <motion.h2
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(5rem, 14vw, 16rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
            color: '#eaff00',
          }}
        >
          OTHERWISE.
        </motion.h2>
      </div>
    </section>
  );
}

