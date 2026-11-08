import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  const lineVariants: Variants = {
    hidden: { y: '110%', opacity: 0 },
    visible: (i: number) => ({
      y: '0%',
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: i * 0.12,
      },
    }),
  };

  const lines = [
    { text: "WE DON'T", lime: false },
    { text: 'FOLLOW THE', lime: false },
    { text: 'SIGNAL.', lime: false },
    { text: 'WE CREATE', lime: false },
    { text: 'IT.', lime: true },
  ];

  return (
    <section
      id="philosophy"
      ref={ref}
      style={{
        background: '#050505',
        padding: 'clamp(6rem, 14vw, 12rem) 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(245,245,240,0.3)',
          marginBottom: '4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        02 / PHILOSOPHY
        <div
          style={{
            height: 1,
            background: 'rgba(245,245,240,0.15)',
            flex: 1,
            maxWidth: '80px',
            transformOrigin: 'left',
            transform: inView ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}
        />
      </motion.div>

      {/* Headline */}
      <div style={{ maxWidth: '1200px' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              lineHeight: 1,
              marginBottom: '0.08em',
            }}
          >
            <motion.h2
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(3.5rem,8.5vw,9.5rem)',
                letterSpacing: '-0.04em',
                color: line.lime ? '#eaff00' : '#f5f5f0',
                display: 'block',
              }}
            >
              {line.text}
            </motion.h2>
          </div>
        ))}
      </div>

      {/* Growing horizontal rule */}
      <div
        style={{
          marginTop: '4rem',
          height: '1px',
          background: 'rgba(245,245,240,0.08)',
          position: 'relative',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '1px',
            width: inView ? '100%' : '0%',
            background:
              'linear-gradient(to right, #eaff00, rgba(109,53,255,0.5), transparent)',
            transition: 'width 2s cubic-bezier(0.16,1,0.3,1) 0.8s',
          }}
        />
      </div>

      {/* Aside text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: 'clamp(13px, 1.5vw, 16px)',
          letterSpacing: '0.01em',
          color: 'rgba(245,245,240,0.35)',
          marginTop: '3rem',
          maxWidth: '420px',
          lineHeight: 1.7,
          marginLeft: 'auto',
        }}
      >
        Every brand carries a signal. We don't amplify noise — we
        extract the frequency that makes you unmissable, then
        build the system to broadcast it.
      </motion.p>
    </section>
  );
}

