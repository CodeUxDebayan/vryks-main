import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { setCursor } from './CustomCursor';

const CLIENTS = [
  'MERIDIAN', 'NOVELA', 'ASPECT', 'LUMOS', 'FRACTAL',
  'VECTOR', 'AXIOM', 'PRISM', 'EPOCH', 'SIGNAL',
];

export function Clients() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="clients"
      ref={ref}
      style={{
        background: '#050505',
        padding: 'clamp(6rem, 14vw, 12rem) 2.5rem',
        position: 'relative',
        borderTop: '1px solid rgba(245,245,240,0.06)',
      }}
    >
      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(245,245,240,0.3)',
          marginBottom: '4rem',
        }}
      >
        07 / SELECTED COLLABORATIONS
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 5.5vw, 7rem)',
          letterSpacing: '-0.04em',
          lineHeight: 0.92,
          color: '#f5f5f0',
          marginBottom: '5rem',
        }}
      >
        TRUSTED<br />
        BY BUILDERS.
      </motion.div>

      {/* Client field */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem 2rem',
          maxWidth: '1200px',
        }}
      >
        {CLIENTS.map((client, i) => (
          <motion.div
            key={client}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3 + i * 0.06,
            }}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.2rem, 2.5vw, 2.8rem)',
              letterSpacing: '-0.02em',
              color: 'rgba(245,245,240,0.12)',
              cursor: 'none',
              transition: 'color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              userSelect: 'none',
            }}
            whileHover={{
              color: 'rgba(245,245,240,0.85)',
              scale: 1.04,
            }}
          >
            {client}
          </motion.div>
        ))}
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        style={{
          marginTop: '5rem',
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: 'rgba(245,245,240,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#eaff00',
          }}
        />
        AND COUNTING
      </motion.div>
    </section>
  );
}

