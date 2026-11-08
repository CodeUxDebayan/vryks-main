import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PAIN_POINTS = [
  {
    num: '01',
    text: 'Digital presence exists, but it doesn\u2019t convert. Visitors arrive, skim, and leave without a reason to stay, return, or remember.',
  },
  {
    num: '02',
    text: 'Content goes out every week. Nothing compounds. No authority, no recall, no audience \u2014 just output, treadmill-style.',
  },
  {
    num: '03',
    text: 'Three agencies. Three strategies. Three voices. Zero cohesion across channels, and customers feel the seams instantly.',
  },
  {
    num: '04',
    text: 'Your design looks fine, but nobody remembers it. Forgettable is the most expensive category a brand can land in today.',
  },
  {
    num: '05',
    text: 'Leadership is chasing dashboards, not direction. Too much data, not enough clarity. No single thesis tying it together.',
  },
];

const POSITIONS = [
  {
    num: '01',
    title: 'Founder-Level Attention.',
    body: 'You aren\u2019t handed off to junior account managers. You get dedicated support and strategic insight from a team built of specialists, not generalists.',
  },
  {
    num: '02',
    title: 'Design that communicates before a word is read.',
    body: 'Graphic design, motion, 3D, VFX\u2014built for longevity, not trend cycles. Designed to grow more valuable over time.',
  },
  {
    num: '03',
    title: 'Your digital presence, built to perform.',
    body: 'Web, apps, hosting, SEO, CRM infrastructure\u2014systems that don\u2019t just exist. They attract, qualify, convert, and retain.',
  },
  {
    num: '04',
    title: 'Words that do commercial work.',
    body: 'Video scripts, UX copy, long-form editorial, ad copy, and sales sequences engineered to move audiences from awareness to decision. Every word chosen for impact, clarity, and conversion.',
  },
  {
    num: '05',
    title: 'Marketing that builds brands, not just campaigns.',
    body: 'Strategy, positioning, PR, social, performance ads, copywriting\u2014a full funnel built on one narrative that compounds over time.',
  },
  {
    num: '06',
    title: 'Cinematic production. Every frame is intentional.',
    body: '15-second performance ads to long-form brand films\u2014every production, from brief to final cut, held to a cinematic benchmark because your brand deserves to be remembered.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

export function ProblemPosition() {
  const problemRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const problemInView = useInView(problemRef, { once: false, margin: '-12%' });
  const positionInView = useInView(positionRef, { once: false, margin: '-12%' });

  return (
    <>
      {/* ── The Problem ──────────────────────────────────────────────── */}
      <section
        id="problem"
        ref={problemRef}
        style={{
          background: '#050505', padding: 'clamp(7rem, 14vw, 12rem) 2.5rem',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Subtle noise accent — top left */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '40vw', height: '40vw',
          background: 'radial-gradient(ellipse at 0% 0%, rgba(255,107,26,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={problemInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Space Mono, monospace', fontSize: '9px',
            letterSpacing: '0.26em', color: 'rgba(245,245,240,0.28)',
            marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem',
          }}
        >
          10 / THE PROBLEM
          <div style={{
            height: 1, flex: 1, maxWidth: 80,
            background: 'rgba(245,245,240,0.12)',
            transform: problemInView ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }} />
        </motion.div>

        {/* Headline */}
        <div style={{ overflow: 'hidden', marginBottom: '5rem' }}>
          <motion.h2
            initial={{ y: '110%' }}
            animate={problemInView ? { y: '0%' } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: 'clamp(2.8rem, 6vw, 7rem)', letterSpacing: '-0.04em',
              lineHeight: 0.92, color: '#f5f5f0',
            }}
          >
            What's actually
            <br />
            <span style={{ color: 'rgba(245,245,240,0.35)', fontStyle: 'italic' }}>happening to your brand.</span>
          </motion.h2>
        </div>

        {/* Pain points grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={problemInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))',
            gap: '0',
          }}
        >
          {PAIN_POINTS.map((point) => (
            <motion.div
              key={point.num}
              variants={itemVariants}
              style={{
                borderTop: '1px solid rgba(245,245,240,0.07)',
                padding: '2.2rem 0',
                paddingRight: '3rem',
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                gap: '0 1.5rem',
                cursor: 'default',
              }}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '10px',
                letterSpacing: '0.12em', color: 'rgba(255,107,26,0.6)',
                paddingTop: '0.25em',
              }}>
                {point.num}
              </span>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 300,
                fontSize: 'clamp(14px, 1.5vw, 16px)', letterSpacing: '0.01em',
                color: 'rgba(245,245,240,0.52)', lineHeight: 1.68,
              }}>
                {point.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Our Position ─────────────────────────────────────────────── */}
      <section
        id="position"
        ref={positionRef}
        style={{
          background: '#070707',
          padding: 'clamp(7rem, 14vw, 12rem) 2.5rem',
          position: 'relative', overflow: 'hidden',
          borderTop: '1px solid rgba(245,245,240,0.04)',
        }}
      >
        {/* Lime glow top-right */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50vw', height: '50vw',
          background: 'radial-gradient(ellipse at 100% 0%, rgba(234, 255, 0,0.035) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={positionInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Space Mono, monospace', fontSize: '9px',
            letterSpacing: '0.26em', color: 'rgba(245,245,240,0.28)',
            marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem',
          }}
        >
          11 / OUR POSITION
          <div style={{
            height: 1, flex: 1, maxWidth: 80,
            background: 'rgba(234, 255, 0,0.2)',
            transform: positionInView ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }} />
        </motion.div>

        {/* Headline */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '110%' }}
              animate={positionInView ? { y: '0%' } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 'clamp(2.8rem, 6vw, 7rem)', letterSpacing: '-0.04em',
                lineHeight: 0.92, color: '#f5f5f0', display: 'block',
              }}
            >
              One Creative Studio.
            </motion.h2>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '110%' }}
              animate={positionInView ? { y: '0%' } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 'clamp(2.8rem, 6vw, 7rem)', letterSpacing: '-0.04em',
                lineHeight: 0.92, color: '#eaff00', display: 'block',
              }}
            >
              Zero Gaps.
            </motion.h2>
          </div>
        </div>

        {/* Positions grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={positionInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))',
            gap: '0',
          }}
        >
          {POSITIONS.map((pos) => (
            <motion.div
              key={pos.num}
              variants={itemVariants}
              style={{
                borderTop: '1px solid rgba(245,245,240,0.07)',
                padding: '2.5rem 3rem 2.5rem 0',
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                gap: '0 1.5rem',
                position: 'relative',
              }}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Hover accent line */}
              <motion.div
                style={{
                  position: 'absolute', left: 0, top: 0,
                  width: 2, height: '100%',
                  background: '#eaff00',
                  scaleY: 0,
                  transformOrigin: 'top',
                }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />

              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '10px',
                letterSpacing: '0.12em', color: 'rgba(234, 255, 0,0.5)',
                paddingTop: '0.3em',
              }}>
                {pos.num}
              </span>
              <div>
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(15px, 1.6vw, 18px)', letterSpacing: '-0.02em',
                  color: '#f5f5f0', marginBottom: '0.7em', lineHeight: 1.3,
                }}>
                  {pos.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 300,
                  fontSize: 'clamp(13px, 1.4vw, 15px)', letterSpacing: '0.01em',
                  color: 'rgba(245,245,240,0.42)', lineHeight: 1.72,
                }}>
                  {pos.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={positionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          style={{
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(245,245,240,0.07)',
            display: 'flex', flexWrap: 'wrap', gap: '2rem',
            alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
            fontSize: 'clamp(14px, 1.6vw, 18px)', letterSpacing: '-0.01em',
            color: 'rgba(245,245,240,0.5)', lineHeight: 1.5, maxWidth: '640px',
          }}>
            Creativity + Strategy + Tech + Production under one roof.{' '}
            <span style={{ color: 'rgba(245,245,240,0.2)' }}>No handoff decay.</span>
            <span style={{ display: 'block', marginTop: '0.4em', color: '#eaff00' }}>
              Performance-backed design. Production-grade execution.
            </span>
          </p>
          <button
            style={{
              fontFamily: 'Space Mono, monospace', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.14em', color: '#050505', background: '#eaff00',
              border: 'none', padding: '14px 28px', borderRadius: '40px', cursor: 'pointer',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05) translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 36px rgba(234, 255, 0,0.4)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            SECURE AN AUDIT \u2197
          </button>
        </motion.div>
      </section>
    </>
  );
}

