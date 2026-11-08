import { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import Threads from './Threads';


/** Multi-line typographic reveal — wraps each line in its own overflow:hidden clip */
function TypeRevealBlock({
  lines,
  progress,
  style,
  lineStyle,
  stagger = 0.12,
}: {
  lines: string[];
  progress: number;
  style?: React.CSSProperties;
  lineStyle?: React.CSSProperties;
  stagger?: number;
}) {
  return (
    <div style={style}>
      {lines.map((line, i) => {
        const lineProgress = Math.min(1, Math.max(0, (progress - i * stagger) / (1 - i * stagger)));
        const translateY = (1 - lineProgress) * 105;
        const opacity = lineProgress;
        return (
          <div key={i} style={{ overflow: 'hidden', display: 'block', lineHeight: '1.0' }}>
            <div
              style={{
                transform: `translateY(${translateY}%)`,
                opacity,
                transition: 'none',
                ...lineStyle,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EnterStudioOverlay({ 
  studioProgress
}: { 
  studioProgress: MotionValue<number>;
  onProceed?: () => void;
  isUnlocked?: boolean;
}) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    return studioProgress.on('change', (latest) => setCurrentProgress(latest));
  }, [studioProgress]);

  // Overall Enter Studio Overlay Opacity
  const overlayOpacity = useTransform(studioProgress, [0.02, 0.15, 0.88, 0.98], [0, 1, 1, 0]);

  // Dark background opacity with Threads (fades in as user scrolls down)
  const bgOpacity = useTransform(studioProgress, [0.02, 0.18, 0.84, 0.96], [0, 1, 1, 0]);

  // 1. Door Animation: Slide down from top center AFTER Hero BG has completely faded out (progress >= 0.24)
  const doorY = useTransform(studioProgress, [0.24, 0.42], ['-100vh', '6vh']);
  const doorInitialOpacity = useTransform(studioProgress, [0.24, 0.38], [0, 1]);
  
  // 2. Door Animation: Subtle Y-axis rotation with scroll progress
  const doorRotateY = useTransform(studioProgress, [0.42, 0.70], [0, -14]);
  const doorScale = useTransform(studioProgress, [0.42, 0.70, 0.96], [1.0, 1.12, 1.30]);
  
  // 3. Door Animation: Fade out seamlessly after 1-scroll hold plateau (0.84 -> 0.96)
  const doorFadeOut = useTransform(studioProgress, [0.84, 0.96], [1, 0]);
  const combinedDoorOpacity = useTransform(
    [doorInitialOpacity, doorFadeOut],
    ([opIn, opOut]) => (opIn as number) * (opOut as number)
  );

  // Text progress windows (mapped to 0–1 local range for each block)
  const getTextProgress = (globalStart: number, globalEnd: number) => {
    if (currentProgress < globalStart) return 0;
    if (currentProgress > globalEnd) return 1;
    return (currentProgress - globalStart) / (globalEnd - globalStart);
  };

  const headlineProgress = getTextProgress(0.42, 0.54);
  const subProgress = getTextProgress(0.50, 0.62);
  const sub2Progress = getTextProgress(0.57, 0.68);
  const rightProgress = getTextProgress(0.60, 0.72);

  // Text container opacity: holds 100% visible through 0.84, then fades out into Four Pillars
  const contentTextOpacity = useTransform(studioProgress, [0.84, 0.96], [1, 0]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: overlayOpacity,
        zIndex: 15,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Dark background with Threads effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: bgOpacity,
          background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #030305 100%)',
          zIndex: 1,
        }}
      >
        <Threads amplitude={1.7} distance={0.4} enableMouseInteraction={true} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.70) 100%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* Cinematic Enter Door (enter_door.png) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          translateY: doorY,
          rotateY: doorRotateY,
          scale: doorScale,
          opacity: combinedDoorOpacity,
          zIndex: 18,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/enter_door.png"
          alt="Enter Studio Door"
          style={{
            maxHeight: '68vh',
            maxWidth: '85vw',
            objectFit: 'contain',
            mixBlendMode: 'lighten',
          }}
        />
      </motion.div>

      {/* Enter Studio Texts — typographic clip-path reveals */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: 'none',
          opacity: contentTextOpacity,
        }}
      >
        {/* Top-Left Group */}
        <div
          style={{
            position: 'absolute',
            top: '18vh',
            left: '5.5rem',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            pointerEvents: 'auto',
          }}
        >
          {/* H2 — multi-line type reveal */}
          <TypeRevealBlock
            lines={['You are not', 'hiring another agency']}
            progress={headlineProgress}
            stagger={0.18}
            lineStyle={{
              fontFamily: '"Space Grotesk", "Lil Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 3.4vw, 48px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: '#ffffff',
            }}
          />

          {/* Sub 1 */}
          <TypeRevealBlock
            lines={['You are entering a studio where creativity', 'meets strategy.']}
            progress={subProgress}
            stagger={0.22}
            lineStyle={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(16px, 1.6vw, 22px)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(245,245,240,0.80)',
              paddingBottom: '2px',
            }}
          />

          {/* Sub 2 */}
          <TypeRevealBlock
            lines={['We design brand experiences that leave', 'a cinematic impression.']}
            progress={sub2Progress}
            stagger={0.22}
            lineStyle={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(14px, 1.3vw, 18px)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: 'rgba(245,245,240,0.58)',
              paddingBottom: '2px',
            }}
          />
        </div>

        {/* Bottom-Right — editorial italic */}
        <div
          style={{
            position: 'absolute',
            bottom: '14vh',
            right: '5.5rem',
            maxWidth: '520px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            pointerEvents: 'auto',
          }}
        >
          <TypeRevealBlock
            lines={['Every system is engineered', 'for high impact results.']}
            progress={rightProgress}
            stagger={0.20}
            lineStyle={{
              fontFamily: 'Scholar, "Playfair Display", "Apple Garamond", "EB Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(24px, 2.6vw, 36px)',
              fontWeight: 400,
              letterSpacing: '0.01em',
              lineHeight: 1.35,
              color: '#ffffff',
              paddingBottom: '2px',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
