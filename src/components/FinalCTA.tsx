import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { setCursor } from './CustomCursor';
import { lerp } from '../utils/math';

interface FinalCTAProps {
  mouseX: number;
  mouseY: number;
}

export function FinalCTA({ mouseX, mouseY }: FinalCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const circleRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!circleRef.current) return;

    const animate = () => {
      const section = circleRef.current?.getBoundingClientRect();
      if (!section) { rafRef.current = requestAnimationFrame(animate); return; }

      const cx = section.left + section.width / 2;
      const cy = section.top + section.height / 2;
      const dx = (mouseX - cx) * 0.06;
      const dy = (mouseY - cy) * 0.06;

      smooth.current.x = lerp(smooth.current.x, dx, 0.08);
      smooth.current.y = lerp(smooth.current.y, dy, 0.08);

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${smooth.current.x}px, ${smooth.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouseX, mouseY]);

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        background: '#050505',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(6rem, 14vw, 12rem) 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(245,245,240,0.06)',
      }}
    >
      {/* Background field */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(109,53,255,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          top: '3rem',
          left: '2.5rem',
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(245,245,240,0.25)',
        }}
      >
        09 / FINAL CTA
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        {['HAVE SOMETHING', 'WORTH BUILDING?'].map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 6vw, 8rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.92,
                color: '#f5f5f0',
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Central interactive circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{ position: 'relative', marginBottom: '3rem' }}
      >
        {/* Outer orbital SVG */}
        <svg
          ref={orbitRef}
          style={{
            position: 'absolute',
            inset: '-60px',
            animation: 'spin 20s linear infinite',
            pointerEvents: 'none',
          }}
          viewBox="0 0 320 320"
        >
          <circle
            cx="160" cy="160" r="155"
            fill="none"
            stroke="rgba(245,245,240,0.05)"
            strokeWidth="1"
          />
          <circle
            cx="160" cy="160" r="155"
            fill="none"
            stroke="rgba(234, 255, 0,0.15)"
            strokeWidth="1"
            strokeDasharray="8 32"
          />
          {/* Orbital data dots */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 160 + 155 * Math.cos(rad);
            const y = 160 + 155 * Math.sin(rad);
            return (
              <circle key={deg} cx={x} cy={y} r="3" fill="#eaff00" opacity="0.4" />
            );
          })}
        </svg>

        {/* The CTA circle */}
        <div
          ref={circleRef}
          onMouseEnter={() => setCursor('enter')}
          onMouseLeave={() => setCursor('default')}
          style={{
            width: 'clamp(160px, 22vw, 240px)',
            height: 'clamp(160px, 22vw, 240px)',
            borderRadius: '50%',
            background: '#eaff00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'none',
            transition: 'box-shadow 0.4s ease',
            position: 'relative',
            zIndex: 1,
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              '0 0 80px rgba(234, 255, 0,0.5), 0 0 160px rgba(234, 255, 0,0.2)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          <span
            style={{
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              fontSize: 'clamp(9px, 1.2vw, 13px)',
              letterSpacing: '0.2em',
              color: '#050505',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            START A<br />PROJECT ↗
          </span>
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 4vw, 4.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 0.92,
          color: 'rgba(245,245,240,0.1)',
          textAlign: 'center',
          marginTop: '3rem',
        }}
      >
        LET'S MAKE
        <br />
        <span style={{ color: 'rgba(109,53,255,0.3)' }}>IT EXIST.</span>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

