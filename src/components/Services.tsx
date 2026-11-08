import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { setCursor } from './CustomCursor';

const SERVICES = [
  {
    index: '01',
    name: 'STRATEGY',
    description:
      'We map where your brand lives in culture — then engineer the path to where it should be. Market position, audience intelligence, systems architecture.',
    accent: '#eaff00',
  },
  {
    index: '02',
    name: 'BRAND',
    description:
      'Visual identity forged from signal, not trend. Logomarks, type systems, color intelligence, motion language, brand voice — built to outlast the moment.',
    accent: '#6d35ff',
  },
  {
    index: '03',
    name: 'EXPERIENCE',
    description:
      'Digital products that behave like physical objects. UX architecture, interaction design, prototyping, design systems built for teams that move fast.',
    accent: '#9b5cff',
  },
  {
    index: '04',
    name: 'TECHNOLOGY',
    description:
      'From headless commerce to bespoke web apps — we build the infrastructure your brand runs on. Clean, performant, scalable.',
    accent: '#ff6b1a',
  },
  {
    index: '05',
    name: 'CONTENT',
    description:
      'Motion, photography, editorial — content engineered to stop the scroll and extend the brand. Direction, production, distribution.',
    accent: '#eaff00',
  },
  {
    index: '06',
    name: 'GROWTH',
    description:
      'Measurement frameworks, conversion architecture, channel strategy. We don\'t just build — we ensure what we build performs.',
    accent: '#6d35ff',
  },
];

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
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
          marginBottom: '4rem',
        }}
      >
        04 / SERVICES
      </motion.div>

      {/* Service rows */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {SERVICES.map((service, i) => (
          <ServiceRow
            key={service.index}
            service={service}
            index={i}
            inView={inView}
            isActive={activeIndex === i}
            anyActive={activeIndex !== null}
            onEnter={() => {
              setActiveIndex(i);
              setCursor('hover');
            }}
            onLeave={() => {
              setActiveIndex(null);
              setCursor('default');
            }}
          />
        ))}
      </div>
    </section>
  );
}

interface ServiceRowProps {
  service: (typeof SERVICES)[0];
  index: number;
  inView: boolean;
  isActive: boolean;
  anyActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function ServiceRow({ service, index, inView, isActive, anyActive, onEnter, onLeave }: ServiceRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        borderBottom: '1px solid rgba(245,245,240,0.06)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'none',
        opacity: anyActive && !isActive ? 0.3 : 1,
        transition: 'opacity 0.35s ease',
      }}
    >
      {/* Accent line on left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: service.accent,
          transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      <div
        style={{
          padding: isActive ? '2rem 2rem 2.5rem 2.5rem' : '1.6rem 2rem 1.6rem 2rem',
          transition: 'padding 0.4s cubic-bezier(0.16,1,0.3,1)',
          display: 'grid',
          gridTemplateColumns: '60px 1fr auto',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Index */}
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: isActive ? service.accent : 'rgba(245,245,240,0.2)',
            paddingTop: '4px',
            transition: 'color 0.3s ease',
          }}
        >
          {service.index}
        </span>

        {/* Name + expanded description */}
        <div>
          <div
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: isActive ? 'clamp(2rem, 4vw, 4.5rem)' : 'clamp(1.5rem, 2.8vw, 3rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: isActive ? '#f5f5f0' : 'rgba(245,245,240,0.7)',
              transition: 'font-size 0.45s cubic-bezier(0.16,1,0.3,1), color 0.3s ease',
            }}
          >
            {service.name}
          </div>
          <AnimatePresence>
            {isActive && (
              <motion.p
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: 'rgba(245,245,240,0.5)',
                  marginTop: '1rem',
                  maxWidth: '480px',
                  overflow: 'hidden',
                }}
              >
                {service.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Arrow */}
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '14px',
            color: service.accent,
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateX(0) rotate(0deg)' : 'translateX(-10px) rotate(-45deg)',
            transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            paddingTop: '4px',
          }}
        >
          ↗
        </div>
      </div>
    </motion.div>
  );
}

