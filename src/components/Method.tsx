import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  { index: '01', name: 'QUESTION', desc: 'Disassemble the brief. Challenge assumptions. Find what nobody asked.' },
  { index: '02', name: 'DISTORT', desc: 'Break conventions deliberately. Find perspectives that shouldn\'t work — and make them.' },
  { index: '03', name: 'DEFINE', desc: 'Name the system. Establish constraints. Know what success looks like.' },
  { index: '04', name: 'DESIGN', desc: 'Visual language. Interaction choreography. The look and feel of the signal.' },
  { index: '05', name: 'BUILD', desc: 'Engineering the real thing. No prototypes shipped as product.' },
  { index: '06', name: 'RELEASE', desc: 'Timed, measured, intentional. Launch is a design decision.' },
  { index: '07', name: 'EVOLVE', desc: 'Nothing we build is finished. We watch, measure, and push forward.' },
];

export function Method() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollAmount = trackWidth - viewportWidth + viewportWidth * 0.1;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => `-${scrollAmount}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollAmount}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="method"
      ref={ref}
      style={{
        background: '#050505',
        position: 'relative',
        borderTop: '1px solid rgba(245,245,240,0.06)',
      }}
    >
      {/* Section label + heading — pinned outside scroll */}
      <div
        style={{
          padding: 'clamp(6rem, 14vw, 12rem) 2.5rem 0',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.25em',
            color: 'rgba(245,245,240,0.3)',
            marginBottom: '3rem',
          }}
        >
          05 / THE METHOD
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 7vw, 8rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.92,
            color: '#f5f5f0',
            marginBottom: '4rem',
          }}
        >
          FROM<br />
          <span style={{ color: '#eaff00' }}>IDEA</span><br />
          TO<br />
          IMPACT.
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div ref={containerRef} style={{ overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            paddingLeft: '2.5rem',
            paddingRight: '2.5rem',
            paddingBottom: 'clamp(6rem, 14vw, 12rem)',
            gap: '0',
            willChange: 'transform',
            width: 'max-content',
          }}
        >
          {STAGES.map((stage, i) => (
            <StageCard key={stage.index} stage={stage} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StageCardProps {
  stage: (typeof STAGES)[0];
  index: number;
}

function StageCard({ stage, index }: StageCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      style={{
        width: 'clamp(280px, 28vw, 380px)',
        borderLeft: '1px solid rgba(245,245,240,0.08)',
        padding: '2rem 2.5rem',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Index */}
      <div
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'rgba(245,245,240,0.2)',
          marginBottom: '2.5rem',
        }}
      >
        {stage.index} / {STAGES.length.toString().padStart(2, '0')}
      </div>

      {/* Stage name */}
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: '#f5f5f0',
          marginBottom: '1.5rem',
        }}
      >
        {stage.name}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: '13px',
          lineHeight: 1.65,
          color: 'rgba(245,245,240,0.35)',
          maxWidth: '280px',
        }}
      >
        {stage.desc}
      </p>

      {/* Accent dot */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background:
            index === 0
              ? '#eaff00'
              : index % 3 === 1
              ? '#6d35ff'
              : 'rgba(245,245,240,0.15)',
        }}
      />
    </motion.div>
  );
}

