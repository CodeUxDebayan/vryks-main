import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ITEMS = [
  'Strategy / Identity',
  'Stack / Web',
  'Systems / Process',
  'Production / Visuals',
  'Growth / Scale',
  'Vision / Design',
  'Technology / Framework',
];

const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-10%' });

  return (
    <motion.section
      ref={ref}
      id="marquee"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#050505',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(245,245,240,0.05)',
        borderBottom: '1px solid rgba(245,245,240,0.05)',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to right, #050505 0%, transparent 8%, transparent 92%, #050505 100%)',
        }}
      />
      <div
        style={{
          display: 'flex', alignItems: 'center', padding: '1.6rem 0',
          width: 'max-content', animation: 'marqueeScroll 28s linear infinite',
        }}
      >
        {TRACK.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5rem', whiteSpace: 'nowrap', paddingRight: '2.5rem' }}>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
              fontSize: 'clamp(13px, 1.4vw, 15px)', letterSpacing: '0.04em',
              color: i % 2 === 0 ? 'rgba(245,245,240,0.55)' : 'rgba(245,245,240,0.3)',
              textTransform: 'uppercase',
            }}>{item}</span>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
              background: i % 3 === 0 ? '#eaff00' : 'rgba(245,245,240,0.15)',
            }} />
          </span>
        ))}
      </div>

    </motion.section>
  );
}

