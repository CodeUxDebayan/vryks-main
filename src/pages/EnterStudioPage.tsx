import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { setCursor } from '../components/CustomCursor';
import { TextGenerateEffect } from '../components/ui/text-generate-effect';

const SENTENCES = [
  "You are entering a studio where creativity meets strategy.",
  "We design brand experiences that leave a cinematic impression.",
  "Every system is engineered for high impact results."
];

export function EnterStudioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const enterVideoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: rawScroll } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollYProgress = useSpring(rawScroll, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [currentProgress, setCurrentProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setCurrentProgress(latest);
  });

  // Stage 1 (0 -> 0.15): Static hero-bg slides to the left
  const heroBgX = useTransform(scrollYProgress, [0, 0.55], ['0%', '-100%']);
  const heroBgOpacity = useTransform(scrollYProgress, [0.10, 0.18], [1, 0]);

  // Stage 2 (0.12 -> 0.98): enter_studio video plays & text reveals
  const enterVideoOpacity = useTransform(scrollYProgress, [0.12, 0.20, 0.90, 0.98], [0, 1, 1, 0]);

  // Text content opacity: reveals letter-by-letter, holds after full reveal, then naturally fades out (0.58 -> 0.65)
  const contentTextOpacity = useTransform(scrollYProgress, [0.15, 0.90, 0.98], [1, 1, 0]);

  // Handle enter_studio video play state
  useEffect(() => {
    if (enterVideoRef.current) {
      if (currentProgress >= 0.12 && currentProgress < 0.98) {
        enterVideoRef.current.play().catch(() => {});
      } else {
        enterVideoRef.current.pause();
      }
    }
  }, [currentProgress]);

  // Sentence reveal calculation based on scroll progress (0.15 -> 0.58)
  // Sentence 1: 0.15 -> 0.28
  // Sentence 2: 0.29 -> 0.43
  // Sentence 3: 0.44 -> 0.58
  const getSentenceProgress = (index: number) => {
    const ranges = [
      [0.15, 0.38],
      [0.40, 0.63],
      [0.65, 0.88],
    ];
    const [start, end] = ranges[index];
    if (currentProgress < start) return 0;
    if (currentProgress > end) return 1;
    return (currentProgress - start) / (end - start);
  };

  return (
    <div ref={containerRef} style={{ background: '#050505', minHeight: '300vh', position: 'relative' }}>
      {/* Sticky Viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* 1. Hero Background Image (Slides left on initial scroll) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            x: heroBgX,
            opacity: heroBgOpacity,
            zIndex: 10,
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
              filter: 'contrast(1.05) brightness(0.95)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.85) 100%)',
            }}
          />
        </motion.div>

        {/* 2. Enter Studio Video (Plays as user scrolls & sentence text reveals, 3px light blur) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: enterVideoOpacity,
            zIndex: 5,
          }}
        >
          <video
            ref={enterVideoRef}
            src="/enter_studio.mp4"
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85) contrast(1.05) blur(1px)',
              transform: 'scale(1.01)', // Minimal scale compensation for 1px blur
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.80) 100%)',
              backdropFilter: 'blur(1px)',
              WebkitBackdropFilter: 'blur(1px)',
            }}
          />
        </motion.div>



        {/* 4. Scroll-Revealed Typography Text Overlay (Sentence by sentence, letter by letter) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 4rem',
            pointerEvents: 'none',
            opacity: contentTextOpacity,
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            {SENTENCES.map((sentence, sIdx) => {
              const prog = getSentenceProgress(sIdx);

              return (
                <TextGenerateEffect
                  key={sIdx}
                  words={sentence}
                  progress={prog}
                  filter={true}
                  className="font-normal text-left"
                  style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontStyle: 'normal',
                    fontSize: 'clamp(28px, 4.5vw, 50px)',
                    fontWeight: sIdx === 2 ? 700 : 400,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    color: '#f5f5f0',
                    minHeight: '1.3em',
                    textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), 0 8px 32px rgba(0, 0, 0, 0.7)',
                    textTransform: 'none',
                  }}
                  getWordStyle={(_word, _idx, wordProgress) => {
                    const isVisible = wordProgress > 0.3;
                    return {
                      color: isVisible ? '#ffffff' : 'rgba(255,255,255,0.15)',
                      transition: 'color 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      textTransform: 'none',
                    };
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Floating Controls / HUD Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2.5rem',
            right: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 30,
          }}
        >
          <a
            href="/hero"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('explore')}
            style={{
              fontFamily: '"Bebas Neue Local", "Bebas Neue", sans-serif',
              fontSize: '28px',
              letterSpacing: '0.12em',
              color: '#eaff00',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            VRYKS
          </a>

          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'rgba(245,245,240,0.6)',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            STUDIO / ENTER EXPERIENCE
          </div>
        </div>
      </div>
    </div>
  );
}

