import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { number: 120, suffix: '+', label: 'PROJECTS', description: 'Built & Shipped' },
  { number: 98, suffix: '%', label: 'RETENTION', description: 'Client Return Rate' },
  { number: 24, suffix: '/7', label: 'SUPPORT', description: 'Always On' },
  { number: 0, suffix: '∞', label: 'LIMITS', description: 'Possibilities' },
];

function useCountUp(target: number, duration = 2, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (target === 0) { setCount(0); return; }

    let startTime: number;
    let rafId: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, active]);

  return count;
}

interface StatBlockProps {
  stat: (typeof STATS)[0];
  index: number;
  inView: boolean;
}

function StatBlock({ stat, index, inView }: StatBlockProps) {
  const count = useCountUp(stat.number, 1.8, inView);

  const offsets = [
    { mt: 0, ml: 0 },
    { mt: 80, ml: 'auto' },
    { mt: 0, ml: '10%' },
    { mt: 60, ml: 'auto' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
      style={{
        marginTop: offsets[index]?.mt ?? 0,
        marginLeft: offsets[index]?.ml ?? 0,
      }}
    >
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(5rem, 11vw, 13rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.85,
          color: index === 0 ? '#eaff00' : index === 3 ? '#6d35ff' : '#f5f5f0',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {stat.number === 0 ? stat.suffix : count}
        {stat.number !== 0 && (
          <span
            style={{
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              marginTop: '0.5rem',
              color: stat.suffix === '+' ? '#eaff00' : 'inherit',
              opacity: stat.suffix === '+' ? 1 : 0.4,
            }}
          >
            {stat.suffix}
          </span>
        )}
      </div>

      <div
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.22em',
          color: 'rgba(245,245,240,0.4)',
          marginTop: '0.5rem',
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'rgba(245,245,240,0.2)',
          marginTop: '2px',
        }}
      >
        {stat.description}
      </div>
    </motion.div>
  );
}

export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      id="impact"
      ref={ref}
      style={{
        background: '#050505',
        padding: 'clamp(6rem, 14vw, 12rem) 2.5rem',
        position: 'relative',
        borderTop: '1px solid rgba(245,245,240,0.06)',
      }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(245,245,240,0.3)',
          marginBottom: '5rem',
        }}
      >
        06 / DATA / IMPACT
      </motion.div>

      {/* Asymmetric grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem 6rem',
          maxWidth: '1000px',
        }}
      >
        {STATS.map((stat, i) => (
          <StatBlock key={stat.label} stat={stat} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}

