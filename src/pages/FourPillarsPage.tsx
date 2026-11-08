import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PILLARS = [
  {
    id: 'design',
    title: 'Design',
    image: '/puzzle.png',
    description: 'From brand identities to 3D renders, every visual decision is governed by commercial logic and artistic conviction. Beautiful work that converts. Always.',
    scheme: 'design'
  },
  {
    id: 'technology',
    title: 'Technology',
    image: '/lego.png',
    description: 'Websites, applications, CRM systems, and hosting infrastructure — engineered for performance, built for scale, maintained without compromise.',
    scheme: 'tech'
  },
  {
    id: 'marketing',
    title: 'Marketing',
    image: '/dice.png',
    description: 'Strategy. Paid media. PR. Social. SEO. Content. Personal branding. Every channel orchestrated as one instrument — calibrated to your commercial outcome.',
    scheme: 'marketing'
  },
  {
    id: 'production',
    title: 'Production',
    image: '/ace.png',
    description: 'Brand films. Ad shoots. Product photography. Motion graphics. VFX. Every frame directed with cinematic precision and strategic intent.',
    scheme: 'production'
  }
];

/* ─── Pillar token metrics ────────────────────────────────────────────
   All four pieces are flat images on one shared square, so the row lines
   up on a single baseline and the section costs no WebGL context.
──────────────────────────────────────────────────────────────────────*/
const TOKEN_BOX = 'clamp(46px, 5.4vw, 78px)';   // the square each piece occupies
const ROW_TOP_VH = 60;                          // where the fanned deck settles

/* Centre-to-centre gap. The floor keeps the four from colliding on phones,
   where a pure vw fan would collapse the labels into each other. */
const FAN_STEP = 'clamp(88px, 14vw, 250px)';
const FAN_MULT = [-1.5, -0.5, 0.5, 1.5];

/* ─── Button language ─────────────────────────────────────────────────
   Every CTA on the site is a Space Mono pill: 13px/28px on a 50px radius.
   The modal reuses the same shape so its actions do not read as a
   different design system; only the skin changes per pillar scheme.
──────────────────────────────────────────────────────────────────────*/
const CTA_SHAPE: React.CSSProperties = {
  fontFamily: 'Space Mono, monospace',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  padding: '13px 28px',
  borderRadius: '50px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const CLOSE_SHAPE: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '38px',
  height: '38px',
  padding: 0,
  borderRadius: '50px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  lineHeight: 1,
  cursor: 'pointer',
  transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
};

type Scheme = string;

function ctaSkin(scheme: Scheme): React.CSSProperties {
  switch (scheme) {
    case 'design':
      return { background: '#dc2626', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.55)', boxShadow: '0 10px 25px rgba(220,38,38,0.30)' };
    case 'tech':
      return { background: 'linear-gradient(90deg, #38bdf8, #2563eb)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.55)', boxShadow: '0 10px 25px rgba(56,189,248,0.28)' };
    case 'marketing':
      return { background: 'linear-gradient(90deg, #dc2626, #2563eb)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.55)', boxShadow: '0 10px 25px rgba(220,38,38,0.26)' };
    default:
      return { background: '#ffffff', color: '#000000', border: '1.5px solid rgba(255,255,255,0.85)', boxShadow: '0 10px 25px rgba(0,0,0,0.55)' };
  }
}

function closeSkin(scheme: Scheme): React.CSSProperties {
  return scheme === 'design'
    ? { background: 'rgba(20,20,20,0.05)', border: '1px solid rgba(20,20,20,0.18)', color: 'rgba(20,20,20,0.65)' }
    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.75)' };
}

function PillarItemHTML({ 
  index,
  pillar,
  active,
  onClick,
  formationProgress,
  cardsOpacity
}: { 
  index: number;
  pillar: typeof PILLARS[number];
  active: boolean;
  onClick: () => void;
  formationProgress: number;
  cardsOpacity: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Stacked at top centre, fanning out to -27vw / -9vw / 9vw / 27vw
  const formT = Math.min(1, Math.max(0, formationProgress));
  const smoothT = formT * formT * (3 - 2 * formT);

  const currentY = (1 - smoothT) * -42; // slide down out of the stack

  // Names hold back until the piece has finished travelling, then settle in.
  const labelT = Math.min(1, Math.max(0, (formT - 0.88) / 0.12));
  const labelReveal = labelT * labelT * (3 - 2 * labelT);

  return (
    // Outer node owns placement only. The float and hover live on the child:
    // framer-motion's `y` and `translateY` are the same transform, so an
    // animated float on this node would silently erase the formation offset.
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + (${FAN_MULT[index]} * ${FAN_STEP} * ${smoothT}))`,
        top: `calc(${ROW_TOP_VH}vh + ${currentY}vh)`,
        transform: 'translate(-50%, -50%)',
        opacity: cardsOpacity,
        zIndex: active ? 30 : isHovered ? 20 : 10,
        pointerEvents: cardsOpacity > 0.05 ? 'auto' : 'none',
      }}
    >
      <motion.div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: isHovered ? -12 : [0, -7, 0],
          scale: isHovered ? 1.16 : 1,
        }}
        transition={
          isHovered
            ? { type: 'spring', stiffness: 320, damping: 20 }
            : {
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 },
                scale: { type: 'spring', stiffness: 320, damping: 22 },
              }
        }
        className="flex flex-col items-center cursor-pointer select-none"
      >
        {/* Shared square keeps all four tokens on one baseline */}
        <div
          style={{
            width: TOKEN_BOX,
            height: TOKEN_BOX,
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          {/* Pool of light under the piece, lifting on hover */}
          <div
            style={{
              position: 'absolute',
              inset: '-18%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 68%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              pointerEvents: 'none',
            }}
          />

          <img
            src={pillar.image}
            alt={pillar.title}
            draggable={false}
            style={{
              width: TOKEN_BOX,
              height: TOKEN_BOX,
              objectFit: 'contain',
            }}
            className="select-none pointer-events-none"
          />
        </div>

        {/* Index + name, so the row reads as the four pillars */}
        <div
          className="flex flex-col items-center gap-0.75 mt-3 pointer-events-none"
          style={{
            opacity: labelReveal,
            transform: `translateY(${(1 - labelReveal) * 7}px)`,
          }}
        >
          <span
            style={{
              fontFamily: '"Space Mono", ui-monospace, monospace',
              fontSize: 'clamp(8px, 0.78vw, 11px)',
              letterSpacing: '0.2em',
              color: isHovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.32)',
              transition: 'color 0.25s ease',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontFamily: '"Space Grotesk", "Lil Grotesk", "Inter", sans-serif',
              fontSize: 'clamp(10px, 1.05vw, 15px)',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.72)',
              transition: 'color 0.25s ease',
            }}
          >
            {pillar.title}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

interface TypewriterTextProps {
  text: string;
  progress: number;
}

function TypewriterText({ text, progress }: TypewriterTextProps) {
  const count = Math.ceil(progress * text.length);
  const visible = text.substring(0, count);
  const hidden = text.substring(count);
  return (
    <span>
      {visible}
      <span style={{ opacity: 0 }}>{hidden}</span>
    </span>
  );
}

interface KeycapButtonProps {
  char: 'V' | 'R' | 'Y' | 'K' | 'S';
  style?: React.CSSProperties;
  isPhysicallyPressed?: boolean;
}

function KeycapButton({ char, style, isPhysicallyPressed = false }: KeycapButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const playSound = () => {
    try {
      const sound = new Audio(`/four-pillar-keys/sounds/${char}.wav`);
      sound.volume = 0.85;
      sound.play().catch(err => {
        console.log('Audio play blocked until user interaction:', err);
      });
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  // Play sound when physically pressed
  const prevPressed = useRef(false);
  useEffect(() => {
    if (isPhysicallyPressed && !prevPressed.current) {
      playSound();
    }
    prevPressed.current = isPhysicallyPressed;
  }, [isPhysicallyPressed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isPressed = isHovered || isPhysicallyPressed;

  return (
    <div 
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => playSound()}
      onClick={() => playSound()}
      className="cursor-pointer"
    >
      <img 
        src={isPressed ? `/four-pillar-keys/pressed/${char}.png` : `/four-pillar-keys/normal/${char}.png`} 
        alt={char} 
        className="w-full h-full object-contain pointer-events-none select-none" 
      />
    </div>
  );
}

export function FourPillarsPage({ scrollProgress }: { scrollProgress?: number }) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [internalScroll, setInternalScroll] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const isControlled = scrollProgress !== undefined;

  // Track window scroll if no external scrollProgress prop is passed
  useEffect(() => {
    if (isControlled) return;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setInternalScroll(window.scrollY / maxScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial invoke
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isControlled]);

  // Global keyboard listener for physical keys V, R, Y, K, S to trigger visual press state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      const key = e.key.toUpperCase();
      if (['V', 'R', 'Y', 'K', 'S'].includes(key)) {
        setPressedKeys(prev => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['V', 'R', 'Y', 'K', 'S'].includes(key)) {
        setPressedKeys(prev => ({ ...prev, [key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // When not controlled (standalone route /four-pillars), start fully revealed!
  const effectiveProgress = isControlled ? scrollProgress : internalScroll;

  // Freeze document scroll when detail modal is open
  useEffect(() => {
    if (activeCard !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCard]);

  // Phased Scroll Reveal Calculations (Shared across both modes!)
  // 1. BG Reveal
  const bgOpacity = Math.min(1, Math.max(0, effectiveProgress / 0.12));

  // 2. Keycaps V, R, Y, K placement (0.00 -> 0.15)
  const tV = Math.min(1, Math.max(0, effectiveProgress / 0.06));
  const tR = Math.min(1, Math.max(0, (effectiveProgress - 0.03) / 0.06));
  const tY = Math.min(1, Math.max(0, (effectiveProgress - 0.06) / 0.06));
  const tK = Math.min(1, Math.max(0, (effectiveProgress - 0.09) / 0.06));

  // 3. "Four Pillars." typewriter (0.15 -> 0.30)
  const tFourPillars = Math.min(1, Math.max(0, (effectiveProgress - 0.15) / 0.15));

  // 4. "One " typewriter (0.24 -> 0.34)
  const tOne = Math.min(1, Math.max(0, (effectiveProgress - 0.24) / 0.10));

  // 5. "S" keycap fade/swipe (0.32 -> 0.42)
  const tS = Math.min(1, Math.max(0, (effectiveProgress - 0.32) / 0.10));

  // 6. "tudio." typewriter (0.38 -> 0.48)
  const tStudio = Math.min(1, Math.max(0, (effectiveProgress - 0.38) / 0.10));

  // 7. Pieces Formation (stacked at top center -> fanned deck)
  const formationProgress = Math.min(1, Math.max(0, (effectiveProgress - 0.35) / 0.18));

  // Pieces fade in during 0.35 -> 0.47, HOLD 100% visible through 0.88, then fade out during 0.88 -> 1.00
  const deckFadeOpacity = !isControlled 
    ? 1.0 
    : effectiveProgress < 0.88
    ? Math.min(1, Math.max(0, (effectiveProgress - 0.35) / 0.12))
    : Math.min(1, Math.max(0, (1.0 - effectiveProgress) / 0.12));

  // 8. "ZERO" and "SILOS."
  const tZero = Math.min(1, Math.max(0, (effectiveProgress - 0.50) / 0.15));
  const tSilos = Math.min(1, Math.max(0, (effectiveProgress - 0.52) / 0.15));

  // 9. Exit Procedural Fadeout (starts after 0.88 hold plateau)
  const exitProgress = Math.min(1, Math.max(0, (effectiveProgress - 0.88) / 0.12));
  const sceneExitOpacity = 1 - (exitProgress * exitProgress * (3 - 2 * exitProgress));
  const sceneBlur = Math.pow(exitProgress, 2.2) * 36;

  // Background heading smoothly eased slide down from top (-30vh -> 0vh)
  const vryksEase = Math.pow(Math.max(0, 1 - effectiveProgress / 0.20), 2.5);
  const vryksY = isControlled ? `${vryksEase * -30}vh` : '0px';

  // Scroll translation offset: slides in from bottom (100% -> 0%) and exit slides up (0% -> -100%)
  const yOffset = effectiveProgress < 0.20
    ? `${(1 - effectiveProgress / 0.20) * 100}%`
    : effectiveProgress > 0.95
    ? `${(exitProgress * -100)}%`
    : '0%';

  // Keycap dynamic styling helpers
  const getKeycapStyle = (t: number) => ({
    height: 'clamp(32px, 5.2vw, 75px)',
    width: 'clamp(32px, 5.2vw, 75px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: t,
    transform: `scale(${0.6 + t * 0.4}) translateY(${(1 - t) * 35}px)`,
    transition: 'opacity 0.05s ease-out, transform 0.05s ease-out',
  });

  const textStyle = {
    fontFamily: '"Space Grotesk", "Lil Grotesk", "Inter", sans-serif',
    fontSize: 'clamp(1.6rem, 4.4vw, 3.8rem)',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
  };

  return (
    <div 
      className="bg-[#000000] text-[#f8f8f8] font-sans relative"
      style={{
        minHeight: isControlled ? '100vh' : '300vh',
      }}
    >
      {/* Sticky Viewport Container (keeps layout fixed during window scroll in standalone mode) */}
      <div 
        className="w-full transition-all duration-300"
        style={{
          position: isControlled ? 'absolute' : 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          opacity: sceneExitOpacity * bgOpacity,
          filter: `blur(${sceneBlur}px)`,
          transform: `translateY(${yOffset})`,
        }}
      >
      
      {/* Standalone Header Navbar */}
      {!isControlled && (
        <header className="absolute top-0 left-0 right-0 h-16 flex justify-between items-center px-12 z-20 bg-transparent">
          {/* Logo */}
          <div className="font-serif text-xl tracking-tight text-white font-bold cursor-pointer" onClick={() => window.location.href = '/'}>
            vryks
          </div>
          {/* Centered links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 items-center text-[11px] tracking-wider uppercase">
            <span className="cursor-pointer hover:text-[#38bdf8] transition-colors text-white/50">Website</span>
            <span className="cursor-pointer hover:text-[#38bdf8] transition-colors font-bold text-[#38bdf8]">Design</span>
            <span className="cursor-pointer hover:text-[#38bdf8] transition-colors text-white/50">Scripting</span>
            <span className="cursor-pointer hover:text-[#38bdf8] transition-colors text-white/50">Marketing</span>
            <span className="cursor-pointer hover:text-[#38bdf8] transition-colors text-white/50">Production</span>
          </div>
          {/* Contact */}
          <button className="border border-white/20 rounded-full px-5 py-2 text-[10px] tracking-widest font-mono hover:bg-white/10 transition-colors uppercase">
            Secure Audit
          </button>
        </header>
      )}

      {/* Background Typography Layout (VRYK Four Pillars, One S tudio) */}
      <div 
        className="absolute left-0 right-0 pointer-events-none flex flex-col items-center justify-center text-center"
        style={{
          top: '22vh',
          transform: `translateY(${vryksY})`,
          opacity: bgOpacity * (1 - exitProgress),
          zIndex: 5,
        }}
      >
        <div className="flex flex-col items-center justify-center pointer-events-auto gap-[0.8vw]">
          {/* Line 1: V R Y K + "Four Pillars." */}
          <div className="flex items-center whitespace-nowrap">
            <div className="flex items-center gap-[0.4vw] md:gap-[0.6vw]">
              <KeycapButton char="V" style={getKeycapStyle(tV)} isPhysicallyPressed={pressedKeys['V']} />
              <KeycapButton char="R" style={getKeycapStyle(tR)} isPhysicallyPressed={pressedKeys['R']} />
              <KeycapButton char="Y" style={getKeycapStyle(tY)} isPhysicallyPressed={pressedKeys['Y']} />
              <KeycapButton char="K" style={getKeycapStyle(tK)} isPhysicallyPressed={pressedKeys['K']} />
            </div>
            <span style={{ ...textStyle, marginLeft: '10px' }}>
              <TypewriterText text="Four Pillars." progress={tFourPillars} />
            </span>
          </div>

          {/* Line 2: "One [S]tudio." (One is right beside S with 15px gap, S is 100% aligned under K) */}
          <div className="flex items-center whitespace-nowrap">
            <div 
              style={{ 
                width: 'calc(3 * clamp(32px, 5.2vw, 75px) + 3 * clamp(0.4vw, 0.5vw, 0.6vw))', 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
              }}
            >
              <span style={{ ...textStyle, marginRight: '15px' }}>
                <TypewriterText text="One" progress={tOne} />
              </span>
            </div>

            <KeycapButton char="S" style={getKeycapStyle(tS)} isPhysicallyPressed={pressedKeys['S']} />

            <span style={{ ...textStyle, marginLeft: '10px' }}>
              <TypewriterText text="tudio." progress={tStudio} />
            </span>
          </div>
        </div>
      </div>

      {/* Top Center Overhead Spotlight Cone Beam */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[85vh] pointer-events-none z-1"
        style={{
          background: 'conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgba(255, 255, 255, 0.12) 15deg, rgba(224, 242, 254, 0.16) 30deg, transparent 45deg)',
          filter: 'blur(35px)',
        }}
      />

      {/* Side Text Frame: ZERO (Blur fade animation) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '8vh',
          left: '6vw',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: tZero,
          filter: `blur(${(1 - tZero) * 20}px)`,
        }}
      >
        <span 
          style={{
            fontFamily: '"Helvetica Neue Local", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          ZERO
        </span>
      </motion.div>

      {/* Side Text Frame: SILOS. (Simple fade/blur animation matching ZERO) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '8vh',
          right: '6vw',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: tSilos,
          filter: `blur(${(1 - tSilos) * 20}px)`,
        }}
      >
        <span 
          style={{
            fontFamily: '"Helvetica Neue Local", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          SILOS.
        </span>
      </motion.div>

      {/* 4 Pillars HTML Items (Crisp 2D images for 3 items + Dedicated 3D Canvas for Marketing Dice).
          Sits under the "Four Pillars / One Studio" headline (z-index 5): this wrapper's
          z-index is the stacking context, so the per-token 10/20/30 only order the tokens
          against each other, never against the headline. */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 3 }}
      >
        {PILLARS.map((pillar, index) => (
          <PillarItemHTML
            key={pillar.id}
            index={index}
            pillar={pillar}
            active={activeCard === index}
            onClick={() => setActiveCard(activeCard === index ? null : index)}
            formationProgress={formationProgress}
            cardsOpacity={deckFadeOpacity}
          />
        ))}
      </div>

      {/* Active Card Modal — portalled to <body>.
          In place it was trapped twice over: this scene's wrapper sets a CSS
          `filter`, which creates both a stacking context and a containing
          block, and Home mounts the section at z-index 14 underneath its
          right-hand nav at z-index 70. That nav sits exactly where the modal's
          close button lands, so it swallowed every click. */}
      {createPortal(
        <AnimatePresence>
          {activeCard !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-end bg-black/75 backdrop-blur-md p-8 md:p-16"
              style={{ zIndex: 2000 }}
              onClick={() => setActiveCard(null)}
            >
            {/* Modal Box with Scheme Specific Colors */}
            <motion.div
              initial={{ x: 120, opacity: 0, scale: 0.92 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 120, opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={
                PILLARS[activeCard].scheme === 'design'
                  ? {
                      // Design: White & Red
                      background: '#ffffff',
                      border: '1.5px solid #dc2626',
                      borderRadius: '24px',
                      padding: '2.5rem 2.8rem',
                      maxWidth: '460px',
                      width: '100%',
                      boxShadow: '0 30px 80px rgba(220, 38, 38, 0.35)',
                      color: '#111111',
                    }
                  : PILLARS[activeCard].scheme === 'tech'
                  ? {
                      // Technology: Blue & White
                      background: 'linear-gradient(145deg, #090d16 0%, #1e3a8a 100%)',
                      border: '1.5px solid #38bdf8',
                      borderRadius: '24px',
                      padding: '2.5rem 2.8rem',
                      maxWidth: '460px',
                      width: '100%',
                      boxShadow: '0 30px 80px rgba(56, 189, 248, 0.35)',
                      color: '#ffffff',
                    }
                  : PILLARS[activeCard].scheme === 'marketing'
                  ? {
                      // Marketing: Red & Blue
                      background: 'linear-gradient(135deg, #450a0a 0%, #1e1b4b 60%, #030712 100%)',
                      border: '1.5px solid rgba(239, 68, 68, 0.65)',
                      borderRadius: '24px',
                      padding: '2.5rem 2.8rem',
                      maxWidth: '460px',
                      width: '100%',
                      boxShadow: '0 30px 80px rgba(220, 38, 38, 0.3), 0 0 40px rgba(37, 99, 235, 0.3)',
                      color: '#ffffff',
                    }
                  : {
                      // Production: Black & White
                      background: 'linear-gradient(145deg, #0a0a0c 0%, #18181b 100%)',
                      border: '1.5px solid rgba(255, 255, 255, 0.35)',
                      borderRadius: '24px',
                      padding: '2.5rem 2.8rem',
                      maxWidth: '460px',
                      width: '100%',
                      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95)',
                      color: '#ffffff',
                    }
              }
              className="relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActiveCard(null)}
                style={{ ...CLOSE_SHAPE, ...closeSkin(PILLARS[activeCard].scheme) }}
                className="hover:scale-110"
              >
                ✕
              </button>
              
              {/* Pill Badge */}
              <div 
                style={
                  PILLARS[activeCard].scheme === 'design'
                    ? { color: '#dc2626', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)' }
                    : PILLARS[activeCard].scheme === 'tech'
                    ? { color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.4)' }
                    : PILLARS[activeCard].scheme === 'marketing'
                    ? { color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)' }
                    : { color: '#ffffff', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }
                }
                className="inline-block px-3 py-1 rounded-full font-mono text-xs tracking-widest uppercase mb-6 font-bold"
              >
                0{activeCard + 1} — {PILLARS[activeCard].title}
              </div>
              
              {/* Title */}
              <h3 
                style={{ color: PILLARS[activeCard].scheme === 'design' ? '#111111' : '#ffffff' }}
                className="text-3xl font-bold mb-5 tracking-tight"
              >
                {PILLARS[activeCard].title}
              </h3>
              
              {/* Description */}
              <p 
                style={{ color: PILLARS[activeCard].scheme === 'design' ? 'rgba(20,20,20,0.80)' : 'rgba(245,245,250,0.80)' }}
                className="text-base leading-relaxed mb-8 font-normal"
              >
                {PILLARS[activeCard].description}
              </p>

              {/* Action CTA Button */}
              <button
                type="button"
                style={{ ...CTA_SHAPE, ...ctaSkin(PILLARS[activeCard].scheme) }}
                className="hover:scale-105"
              >
                Explore Services →
              </button>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      
      {/* Bottom CTA (when no card is active) */}
      <AnimatePresence>
        {activeCard === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <div className="text-white/40 font-mono text-xs uppercase tracking-widest flex items-center gap-4">
              
              <span className="w-12 h-px bg-white/20"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      </div>
    </div>
  );
}
