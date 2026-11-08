import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const LINES = [
  { text: "You're entering a studio —", accent: false },
  { text: "one that comprehends your ambition,", accent: false },
  { text: "commands every discipline,", accent: true },
  { text: "and delivers with precision", accent: false },
  { text: "befitting a legacy endeavour.", accent: false },
];

function getHaphazardValues(lineIdx: number, charIdx: number) {
  const seed = lineIdx * 41 + charIdx * 17 + 13;
  const r1 = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
  const r2 = Math.cos(seed * 1.3) * 10000 - Math.floor(Math.cos(seed * 1.3) * 10000);
  const r3 = Math.sin(seed * 2.7) * 10000 - Math.floor(Math.sin(seed * 2.7) * 10000);

  const x = (r1 - 0.5) * 100;          // -50px to +50px
  const y = (r2 - 0.5) * 80 + 40;      // +0px to +80px
  const rotate = (r3 - 0.5) * 60;     // -30deg to +30deg
  const scale = 0.15 + r1 * 0.7;       // 0.15 to 0.85
  const skewX = (r2 - 0.5) * 60;      // -30deg to +30deg

  return { x, y, rotate, scale, skewX };
}

function ScrubbedChar({
  char,
  lineIdx,
  charIdx,
  totalCharsInLine,
  accent,
  scrollYProgress,
}: {
  char: string;
  lineIdx: number;
  charIdx: number;
  totalCharsInLine: number;
  accent: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const h = getHaphazardValues(lineIdx, charIdx);

  // Divide overall scroll range [0.05, 0.88] cleanly into 5 distinct line phases
  const totalLines = LINES.length; // 5 lines
  const lineWindowWidth = 0.83 / totalLines; // ~0.166 per line phase
  const lineStart = 0.05 + lineIdx * lineWindowWidth;

  // Stagger individual letters sequentially inside each line's scroll phase
  const charOffset = (charIdx / Math.max(1, totalCharsInLine)) * (lineWindowWidth * 0.45);
  const start = lineStart + charOffset;
  const end = Math.min(0.96, start + lineWindowWidth * 0.55);

  const x = useTransform(scrollYProgress, [start, end], [h.x, 0]);
  const y = useTransform(scrollYProgress, [start, end], [h.y, 0]);
  const rotate = useTransform(scrollYProgress, [start, end], [h.rotate, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [h.scale, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const filter = useTransform(scrollYProgress, [start, end], ['blur(12px)', 'blur(0px)']);
  const skewX = useTransform(scrollYProgress, [start, end], [`${h.skewX}deg`, '0deg']);

  return (
    <motion.span
      style={{
        display: 'inline-block',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 500,
        fontSize: 'clamp(1.55rem, 3.2vw, 3.4rem)',
        letterSpacing: '-0.025em',
        color: accent ? '#eaff00' : 'rgba(245,245,240,0.45)',
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity, filter',
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        skewX,
      }}
    >
      {char}
    </motion.span>
  );
}

export function StudioIntro() {
  const ref = useRef<HTMLDivElement>(null);

  // Bind scroll progress directly to this section's viewport intersection
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 45%'],
  });

  const labelOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0, 0.15], [-15, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 0.8, 0.8, 0.2]);

  return (
    <section
      id="studio-intro"
      ref={ref}
      style={{
        background: '#050505', position: 'relative', overflow: 'hidden',
        padding: 'clamp(9rem, 18vw, 16rem) 2.5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', minHeight: '100vh',
      }}
    >
      {/* Background Image Layer — section2-bg.png */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
          opacity: bgOpacity,
        }}
      >
        <img
          src="/section2-bg.png"
          alt="Studio Visual Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'contrast(1.08) brightness(0.85)',
          }}
        />
        {/* Dark vignette gradient overlay for high contrast text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at center, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.88) 70%, #050505 100%),
              linear-gradient(to bottom, #050505 0%, transparent 25%, transparent 75%, #050505 100%)
            `,
          }}
        />
      </motion.div>

      {/* Distortion atmosphere glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(109,53,255,0.05) 0%, rgba(234, 255, 0,0.015) 50%, transparent 75%)',
      }} />

      {/* Section label */}
      <motion.div
        style={{
          fontFamily: 'Space Mono, monospace', fontSize: '9px',
          letterSpacing: '0.28em', color: 'rgba(245,245,240,0.28)',
          marginBottom: '4rem',
          opacity: labelOpacity,
          y: labelY,
        }}
      >
        00 / STUDIO
      </motion.div>

      {/* Scroll-driven Haphazard & Distorted main text */}
      <div style={{ maxWidth: '920px', position: 'relative', zIndex: 1 }}>
        {LINES.map((line, lineIdx) => {
          const words = line.text.split(' ');
          const totalCharsInLine = line.text.replace(/\s+/g, '').length;
          let globalCharCount = 0;

          return (
            <div
              key={lineIdx}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                columnGap: '0.3em',
                rowGap: '0.1em',
                lineHeight: 1.25,
                marginBottom: '0.2em',
              }}
            >
              {words.map((word, wordIdx) => {
                const chars = word.split('');
                return (
                  <span
                    key={wordIdx}
                    style={{
                      display: 'inline-flex',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chars.map((char, charIdx) => {
                      const charGlobalIdx = globalCharCount++;
                      return (
                        <ScrubbedChar
                          key={charIdx}
                          char={char}
                          lineIdx={lineIdx}
                          charIdx={charGlobalIdx}
                          totalCharsInLine={totalCharsInLine}
                          accent={line.accent}
                          scrollYProgress={scrollYProgress}
                        />
                      );
                    })}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Animated scroll arrows */}
      <motion.div
        style={{
          marginTop: '5rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0px',
          opacity: labelOpacity,
        }}
      >
        <span style={{
          fontFamily: 'Space Mono, monospace', fontSize: '8px',
          letterSpacing: '0.28em', color: 'rgba(245,245,240,0.2)',
          marginBottom: '1rem',
        }}>CONTINUE</span>

        {/* Three stacked animated arrows */}
        {[0, 1, 2].map((idx) => (
          <motion.div
            key={idx}
            animate={{ y: [0, 8, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{
              duration: 1.6, repeat: Infinity, ease: 'easeInOut',
              delay: idx * 0.22,
            }}
            style={{
              width: 18, height: 18, display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginTop: idx === 0 ? 0 : '-6px',
            }}
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M1 1L9 9L17 1" stroke="rgba(245,245,240,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}



