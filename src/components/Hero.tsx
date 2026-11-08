import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProceduralField } from './ProceduralField';
import { setCursor } from './CustomCursor';
import { clamp } from '../utils/math';

// CTA journey steps (shown sequentially on primary button hover)
const CTA_STEPS = [
  { label: 'Visualise Your Journey', index: 0 },
  { label: 'We Explore Your Vision', index: 1 },
  { label: 'We Build The System', index: 2 },
];

// ─── Background Asset Placeholder System ─────────────────────────────────────
// Replace this constant when the final 3D/visual asset is ready:
// const HERO_BACKGROUND = 'YOUR_BACKGROUND_ASSET'; // e.g. '/assets/hero-sculpture.webp'

interface HeroProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
  scrollVelocity: number;
}

export function Hero({ mouseX, mouseY, scrollY, scrollVelocity }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const [ctaStep, setCtaStep] = useState(0);
  const ctaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCtaLoop = () => {
    if (ctaIntervalRef.current) return;
    setCtaStep(1);
    ctaIntervalRef.current = setInterval(() => {
      setCtaStep(s => {
        if (s >= CTA_STEPS.length - 1) return s;
        return s + 1;
      });
    }, 900);
  };

  const stopCtaLoop = () => {
    if (ctaIntervalRef.current) {
      clearInterval(ctaIntervalRef.current);
      ctaIntervalRef.current = null;
    }
    setCtaStep(0);
  };

  // ── Cursor reveal canvas (radial mask effect)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const REVEAL_RADIUS = 220;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const sm = smoothMouse.current;

      sm.x += (mouseX - sm.x) * 0.06;
      sm.y += (mouseY - sm.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // Dark base atmosphere
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Radial glow at center — violet atmosphere
      const centerGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
      centerGrad.addColorStop(0, 'rgba(109,53,255,0.06)');
      centerGrad.addColorStop(0.5, 'rgba(109,53,255,0.02)');
      centerGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, w, h);

      // Acid-lime ambient corner
      const limeGrad = ctx.createRadialGradient(w * 0.7, h * 0.15, 0, w * 0.7, h * 0.15, w * 0.35);
      limeGrad.addColorStop(0, 'rgba(234, 255, 0,0.04)');
      limeGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = limeGrad;
      ctx.fillRect(0, 0, w, h);

      // Cursor reveal — cinematic soft field
      const grad = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, REVEAL_RADIUS);
      grad.addColorStop(0, 'rgba(109,53,255,0.14)');
      grad.addColorStop(0.4, 'rgba(109,53,255,0.08)');
      grad.addColorStop(0.65, 'rgba(234, 255, 0,0.025)');
      grad.addColorStop(0.8, 'rgba(245,245,240,0.008)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mouseX, mouseY]);

  // Scroll-driven parallax for hero typography
  const headlineOffset = scrollY * 0.35;
  const metaOffset = scrollY * 0.55;

  // Cursor-driven type displacement
  const nx = typeof window !== 'undefined' ? (mouseX / window.innerWidth) * 2 - 1 : 0;

  // Velocity distortion on scroll
  const distortion = clamp(Math.abs(scrollVelocity) * 0.4, 0, 20);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* ── z-0: Background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── z-5: User-provided Cinematic Hero Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 0.95, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <img
          src="/hero-bg.png"
          alt="Hero Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'contrast(1.05) brightness(1.05)',
          }}
        />
        {/* Soft Vignette & Lightened Gradient Overlays for optimal image visibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 25% 45%, rgba(5,5,5,0.25) 0%, transparent 65%, rgba(5,5,5,0.4) 100%),
              linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, transparent 40%, rgba(5,5,5,0.45) 88%, #050505 100%)
            `,
          }}
        />
      </motion.div>

      {/* ── z-20: Procedural orbital geometry */}
      <ProceduralField mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />

      {/* ── z-40: Technical grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(245,245,240,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,245,240,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)',
        }}
      />
      {/* ── z-50: Editorial label */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
        style={{
          position: 'absolute',
          top: 'clamp(4.5rem, 9vh, 6.5rem)',
          left: '2.5rem',
          zIndex: 60,
          transform: `translateY(${-metaOffset * 0.3}px)`,
        }}
      >
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: 'rgba(245,245,240,0.35)',
            lineHeight: 1.8,
          }}
        >
         1
          <br />
          // SYSTEM / SIGNAL
        </div>
      </motion.div>

      {/* ── z-50: Hero headline */}
      <div
        style={{
          position: 'relative',
          zIndex: 50,
          padding: '0 2.5rem',
          paddingTop: 'clamp(2rem, 5vh, 4rem)',
          maxWidth: '960px',
          transform: `translateY(${-headlineOffset}px) skewY(${-distortion * 0.04}deg)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {/* Eyebrow — THE FUTURE IS NOT COMING */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.28em',
            color: 'rgba(234, 255, 0,0.7)',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ width: 32, height: 1, background: 'rgba(234, 255, 0,0.5)', display: 'inline-block' }} />
          THE FUTURE IS NOT COMING. IT'S BEING BUILT.
        </motion.div>

        {/* Word-by-word headline */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', columnGap: '0.26em', rowGap: '0.05em',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
          fontSize: 'clamp(2.1rem, 4.8vw, 5.8rem)', letterSpacing: '-0.04em',
          lineHeight: 0.95, paddingBottom: '0.08em', color: '#f5f5f0',
        }}>
          {/* Sentence 1 */}
          {[
            { word: 'POSITIONING', style: {} },
            { word: 'BRANDS', style: { transform: `translateX(${nx * 10}px)`, transition: 'transform 0.15s linear' } },
            { word: 'TO', style: {} },
            { word: 'LOOK', style: {} },
            { word: 'LIKE', style: { color: '#eaff00', fontStyle: 'italic' } },
            { word: 'A', style: { color: '#eaff00', fontStyle: 'italic' } },
            { word: 'FILM', style: { color: '#eaff00', fontStyle: 'italic' } },
          ].map((item, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 + (i * 0.05) }}
                style={{ display: 'block', ...item.style }}
              >
                {item.word}
              </motion.span>
            </div>
          ))}
          
          <div style={{ overflow: 'hidden' }}>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 + (7 * 0.05) }}
              style={{ display: 'block', color: 'rgba(245,245,240,0.35)', margin: '0 0.2em' }}
            >
              /
            </motion.span>
          </div>

          {/* Sentence 2 */}
          {[
            { word: 'SELL', style: {} },
            { word: 'LIKE', style: {} },
            { word: 'A', style: {} },
            { word: 'FUNNEL', style: {} },
          ].map((item, i) => (
            <div key={`s2-${i}`} style={{ overflow: 'hidden' }}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.8 + (i * 0.05) }}
                style={{ display: 'block', ...item.style }}
              >
                {item.word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(16px, 1.8vw, 21px)',
            letterSpacing: '0.01em',
            color: 'rgba(245,245,240,0.65)',
            marginTop: '1.2rem',
            maxWidth: '560px',
            lineHeight: 1.55,
          }}
        >
          VRYKS builds brands that look like cinema, communicate like
          strategy, and sell like engineered systems.
          <span style={{ display: 'block', marginTop: '0.5em', color: 'rgba(245,245,240,0.45)', fontSize: '0.92em' }}>
            One studio. Every discipline. Own your results.
          </span>
        </motion.p>

        {/* ── CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.55 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {/* Primary CTA — animated journey steps on hover */}
          <button
            onMouseEnter={() => { setCursor('enter'); startCtaLoop(); }}
            onMouseLeave={() => { setCursor('default'); stopCtaLoop(); }}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#050505',
              background: '#eaff00',
              border: 'none',
              padding: '13px 26px',
              borderRadius: '40px',
              cursor: 'pointer',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '250px',
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04) translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 40px rgba(234, 255, 0,0.45)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            <span style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={ctaStep}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-block' }}
                >
                  {CTA_STEPS[ctaStep].label.toUpperCase()}
                </motion.span>
              </AnimatePresence>
              <span style={{ marginLeft: 8, flexShrink: 0 }}>↗</span>
            </span>
          </button>

          {/* Secondary CTA */}
          <button
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.14em',
              color: 'rgba(245,245,240,0.6)',
              background: 'transparent',
              border: '1px solid rgba(245,245,240,0.16)',
              padding: '13px 26px',
              borderRadius: '40px',
              cursor: 'pointer',
              transition: 'color 0.25s ease, border-color 0.25s ease',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#f5f5f0';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,245,240,0.45)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,245,240,0.6)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,245,240,0.16)';
            }}
          >
            SECURE AN AUDIT
          </button>
        </motion.div>
      </div>

      {/* ── z-60: Micro data points */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          zIndex: 60,
          transform: `translateY(${metaOffset * 0.2}px)`,
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '8px',
            letterSpacing: '0.2em',
            color: 'rgba(245,245,240,0.18)',
            lineHeight: 2.2,
          }}
        >
          <div>VRYKS / 001</div>
          <div>DIGITAL STUDIO</div>
          <div style={{ color: 'rgba(234, 255, 0,0.3)', marginTop: '4px' }}>SYSTEM ACTIVE</div>
        </div>
      </motion.div>

      {/* ── Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: Math.max(0, 1 - scrollY / 200),
        }}
      >
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '8px',
            letterSpacing: '0.25em',
            color: 'rgba(245,245,240,0.25)',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background:
              'linear-gradient(to bottom, rgba(245,245,240,0.25), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </motion.div>

      {/* ── Right-side In-page Navigation — Glassmorphic Container Box */}
      <motion.nav
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          right: '3rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem',
          zIndex: 70,
          background: 'rgba(12, 12, 14, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(245, 245, 240, 0.12)',
          borderRadius: '12px',
          padding: '1.4rem 1.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(234, 255, 0, 0.7)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          paddingLeft: '6px',
        }}>
          INDEX // NAV
        </div>

        {['FUTURE', 'INNOVATION', 'COLLABORATION', 'EXCELLENCE', 'PURPOSE', 'LEGACY'].map((link, i) => (
          <a
            key={i}
            href={`#${link.toLowerCase()}`}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: 'rgba(245, 245, 240, 0.55)',
              textDecoration: 'none',
              transition: 'color 0.25s ease, transform 0.25s ease, background 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 12px',
              borderRadius: '6px',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = '#eaff00';
              el.style.background = 'rgba(234, 255, 0, 0.06)';
              el.style.transform = 'translateX(4px)';
              const dot = el.querySelector('.nav-dot') as HTMLElement;
              if (dot) dot.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'rgba(245, 245, 240, 0.45)';
              el.style.background = 'transparent';
              el.style.transform = 'translateX(0)';
              const dot = el.querySelector('.nav-dot') as HTMLElement;
              if (dot) dot.style.opacity = '0';
            }}
          >
            <span
              className="nav-dot"
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#eaff00',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                flexShrink: 0,
              }}
            />
            {link}
          </a>
        ))}
      </motion.nav>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.2); }
        }
      `}</style>
    </section>
  );
}

