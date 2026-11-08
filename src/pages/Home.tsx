import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import TextPressure from '../components/TextPressure';
import { setCursor } from '../components/CustomCursor';
import { EnterStudioOverlay } from '../components/EnterStudioOverlay';
import { SplittingText } from '../components/ui/splitting-text';
import Text3DFlip, { HeaderHoverContext } from '../components/ui/text-3d-flip';
import { FourPillarsPage } from './FourPillarsPage';
import { WhyChooseUsPage } from './WhyChooseUsPage';
import { PropositionPage } from './PropositionPage';
import { RemainingSections } from './RemainingSections';
import { ScrollCounter } from '../components/ScrollCounter';
import { MobileNav } from '../components/MobileNav';

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress across the container
  const { scrollYProgress: rawScroll } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Apply a spring to smooth out the discrete "ticks" of standard mouse wheels
  const globalScrollYProgress = useSpring(rawScroll, {
    stiffness: 50,
    damping: 28,
    restDelta: 0.001
  });

  const scrollYProgress = useTransform(globalScrollYProgress, [0, 0.26], [0, 1]);
  const studioProgress = useTransform(globalScrollYProgress, [0.22, 0.56], [0, 1]);
  // Pillars: starts at 0.50, fully visible 0.55-0.72, starts fading at 0.72, gone by 0.80
  const pillarsProgress = useTransform(globalScrollYProgress, [0.50, 0.82], [0, 1.25]);
  const heroContentOpacity = useTransform(scrollYProgress, [0.70, 0.95], [1, 0]);

  // Pillars fade-OUT opacity: fully visible 0.50-0.72, fades to 0 at 0.80
  const pillarsFadeOpacity = useTransform(globalScrollYProgress, [0.72, 0.80], [1, 0]);
  const [pillarsFadeValue, setPillarsFadeValue] = useState(1);
  useMotionValueEvent(pillarsFadeOpacity, 'change', (latest) => setPillarsFadeValue(latest));

  // Why Choose Us: fades IN as pillars fade out (0.76-0.84), holds, fades OUT at 0.88-0.92
  const whyProgress = useTransform(globalScrollYProgress, [0.76, 0.92], [0, 1]);
  const [whyValue, setWhyValue] = useState(0);
  useMotionValueEvent(whyProgress, 'change', (latest) => setWhyValue(latest));
  const whyFadeOpacity = useTransform(globalScrollYProgress, [0.88, 0.93], [1, 0]);
  const [whyFadeValue, setWhyFadeValue] = useState(1);
  useMotionValueEvent(whyFadeOpacity, 'change', (latest) => setWhyFadeValue(latest));

  // Proposition: fades IN as Why fades out (0.90-0.96)
  const propositionProgress = useTransform(globalScrollYProgress, [0.90, 1.00], [0, 1]);
  const [propositionValue, setPropositionValue] = useState(0);
  useMotionValueEvent(propositionProgress, 'change', (latest) => setPropositionValue(latest));

  const [pillarsValue, setPillarsValue] = useState(0);
  useMotionValueEvent(pillarsProgress, "change", (latest) => {
    setPillarsValue(latest);
  });

  // Scroll Counter state for mouse-following loader
  const [counterState, setCounterState] = useState<{ isVisible: boolean; value: number; label: string }>({
    isVisible: false,
    value: 0,
    label: 'HERO // STUDIO',
  });

  useMotionValueEvent(globalScrollYProgress, 'change', (latest) => {
    const pVal = pillarsProgress.get(); // 0 to 1.25

    if (pVal < 0.05) {
      // Joint Scroll Counter for Hero Section + Enter Studio (0% -> 100%)
      if (latest >= 0.005) {
        const val = Math.min(100, Math.max(0, (latest / 0.60) * 100));
        setCounterState({ isVisible: true, value: val, label: 'HERO // STUDIO' });
      } else {
        setCounterState(prev => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      }
    } else if (pVal >= 0.05 && pVal <= 0.98) {
      // Stage 2: Four Pillars (0% -> 100%)
      const val = Math.min(100, Math.max(0, ((pVal - 0.05) / 0.90) * 100));
      setCounterState({ isVisible: true, value: val, label: 'FOUR PILLARS' });
    } else {
      setCounterState(prev => (prev.isVisible ? { ...prev, isVisible: false } : prev));
    }
  });

  // Keyboard navigation shortcuts: Ctrl+1..6 or Cmd+1..6
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const keyMap: Record<string, number> = {
          '1': 0.15, // STAGE 1 / FUTURE
          '2': 0.35, // STAGE 2 / INNOVATION
          '3': 0.55, // STAGE 3 / COLLABORATION
          '4': 0.72, // STAGE 4 / EXCELLENCE
          '5': 0.88, // STAGE 5 / PURPOSE
          '6': 1.0,  // STAGE 6 / LEGACY
        };
        if (keyMap[e.key] !== undefined) {
          e.preventDefault();
          const targetProgress = keyMap[e.key];
          if (containerRef.current) {
            const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
            const targetScrollY = targetProgress * containerHeight;
            window.scrollTo({
              top: targetScrollY,
              behavior: 'smooth',
            });
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ambient Background Audio Controller
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.55;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio playback waiting for user permission:', err);
      });
    }
  };

  // ─── STAGE 1 (0 -> 0.18): Vryks docking scale and position (enlarged logo: 0.16)
  const scale = useTransform(scrollYProgress, [0, 0.18], [1, 0.16]);
  const x = useTransform(scrollYProgress, [0, 0.18], [
    'calc(50vw + -50% + 0px)', 
    'calc(0vw + 0% + 40px)'
  ]);
  const y = useTransform(scrollYProgress, [0, 0.18], [
    'calc(50vh + -50% + 0px)', 
    'calc(0vh + -50% + 32px)'
  ]);

  // Navbar shows up as docking completes
  const navOpacity = useTransform(scrollYProgress, [0.12, 0.18], [0, 1]);
  const navY = useTransform(scrollYProgress, [0.12, 0.18], [-20, 0]);

  // Turn off TextPressure animation after scrolling slightly down to save memory
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isInPageNavCollapsed, setIsInPageNavCollapsed] = useState(false);

  // Auto-collapse in-page nav after 3 seconds on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInPageNavCollapsed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic brightness pulse (-20% to 0% i.e. 0.80 -> 1.00) for Hero background
  // Very slow & subtle idle breath. Only heavy/rapid mouse movements accelerate the pulse!
  const [heroBrightness, setHeroBrightness] = useState(0.90);
  const pulsePhaseRef = useRef(0);
  const pulseSpeedRef = useRef(0.25); // Very slow, subtle initial ambient speed
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      if (lastMousePosRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Thresholding: Ignore subtle/little mouse movements (< 18px delta)
        if (dist > 18) {
          // Non-linear response: only heavy/fast movement generates speed boost
          const heavyMoveFactor = Math.pow(dist - 18, 1.4) * 0.008;
          pulseSpeedRef.current = Math.min(3.5, pulseSpeedRef.current + heavyMoveFactor);
        }
      }
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updatePulse = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Base idle speed is 0.25 (very slow, luxurious subtle breath)
      pulseSpeedRef.current += (0.25 - pulseSpeedRef.current) * Math.min(1, dt * 1.8);

      pulsePhaseRef.current += pulseSpeedRef.current * dt * 1.2;

      // Oscillate brightness subtly between 0.80 (-20%) and 1.00 (0%)
      const b = 0.90 + Math.sin(pulsePhaseRef.current) * 0.10;
      setHeroBrightness(b);

      animId = requestAnimationFrame(updatePulse);
    };

    animId = requestAnimationFrame(updatePulse);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Ensure page reload always starts at the initial scene (scroll position 0,0)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsScrolled(latest > 0.05);
    setIsDocked(latest >= 0.18);
  });



  // Initial stage 1 background fade: initial_bg.png fades out as scroll starts (0 -> 0.08)
  const initialBgOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroBgOpacity = useTransform(scrollYProgress, [0.03, 0.12], [0, 1]);
  // Hero Background transform: slide left and fade out completely early in studioProgress (0.0 -> 0.28)
  const heroBgFadeOut = useTransform(studioProgress, [0.0, 0.28], [1, 0]);

  const heroBgBlur = useTransform(studioProgress, (latest) => {
    const t = Math.min(1, Math.max(0, latest / 0.28));
    const easedT = Math.pow(t, 2.2);
    const blurPx = (easedT * 36).toFixed(1);
    return `blur(${blurPx}px)`;
  });

  const heroBgScale = useTransform(studioProgress, (latest) => {
    const t = Math.min(1, Math.max(0, latest / 0.28));
    const easedT = Math.sin((t * Math.PI) / 2);
    return 1.0 + easedT * 0.08;
  });

  const heroBgX = useTransform(studioProgress, [0.0, 0.28], ['0%', '-50%']);

  const combinedHeroBgOpacity = useTransform(
    [heroBgOpacity, heroBgFadeOut],
    ([opIn, opOut]) => (opIn as number) * (opOut as number)
  );

  // Dynamic in-page nav ambient bloom color: Lime Green in Hero (#eaff00) -> Red in Enter Studio (#dc2323)
  const navBloomBg1 = useTransform(studioProgress, (latest) => {
    const t = Math.min(1, Math.max(0, latest / 0.50));
    const r = Math.round(234 + (220 - 234) * t);
    const g = Math.round(255 + (35 - 255) * t);
    const b = Math.round(0 + (35 - 0) * t);
    return `radial-gradient(ellipse at 55% 55%, rgba(${r}, ${g}, ${b}, 0.45) 0%, rgba(${r}, ${g}, ${b}, 0.18) 40%, transparent 80%)`;
  });

  const navBloomBg2 = useTransform(studioProgress, (latest) => {
    const t = Math.min(1, Math.max(0, latest / 0.50));
    const r = Math.round(234 + (240 - 234) * t);
    const g = Math.round(255 + (50 - 255) * t);
    const b = Math.round(0 + (40 - 0) * t);
    return `radial-gradient(ellipse at 50% 40%, rgba(${r}, ${g}, ${b}, 0.50) 0%, rgba(${r}, ${g}, ${b}, 0.20) 40%, transparent 75%)`;
  });


  // Apple-style fade out for WEB CREATIVES STRATEGY IDENTITY on scroll
  const initialWordsOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const initialWordsY = useTransform(scrollYProgress, [0, 0.06], [0, -20]);

  // Headline reveal: appears centered (left 0%, top 38vh) at stage 1 -> moves left to left 0%, top 14vh
  const headerLeft = useTransform(scrollYProgress, [0.06, 0.21, 0.47, 0.73], ['50%', '0%', '0%', '0%']);
  const headerTop = useTransform(scrollYProgress, [0.06, 0.21, 0.47, 0.73], ['38vh', 'calc(14vh - 20px)', 'calc(14vh - 20px)', 'calc(14vh - 20px)']);
  const headerWidth = useTransform(scrollYProgress, [0.06, 0.21, 0.47, 0.73], [
    'calc(750px + 0%)', 
    'calc(750px + 0%)', 
    'calc(750px + 0%)', 
    'calc(750px + 0%)'
  ]);
  const headerScale = useTransform(scrollYProgress, [0.06, 0.21, 0.47, 0.73], [1.0, 1.0, 1.0, 1.0]);
  const contentOpacity = useTransform(scrollYProgress, [0.06, 0.16], [0, 1]);

  // Sub-header & Side Nav reveal together in 1 scroll phase (0.21 -> 0.47)
  const subOpacity = useTransform(scrollYProgress, [0.21, 0.47], [0, 1]);
  const subWidth = useTransform(scrollYProgress, [0.21, 0.47], [
    'calc(560px + 0%)', 
    'calc(560px + 0%)'
  ]);
  const subScale = useTransform(scrollYProgress, [0.21, 0.47], [1.0, 1.0]);
  const subColor = useTransform(scrollYProgress, [0.47, 0.73], ['rgba(245, 245, 240, 0.95)', 'rgba(245, 245, 240, 0.55)']);
  const subSpanColor = useTransform(scrollYProgress, [0.47, 0.73], ['rgba(245, 245, 240, 0.75)', 'rgba(245, 245, 240, 0.35)']);

  // Word-by-word scroll-linked reveal variables for the header
  const word0_opacity = useTransform(scrollYProgress, [0.06, 0.10], [0, 1]);
  const word0_y = useTransform(scrollYProgress, [0.06, 0.10], [15, 0]);

  const word1_opacity = useTransform(scrollYProgress, [0.07, 0.11], [0, 1]);
  const word1_y = useTransform(scrollYProgress, [0.07, 0.11], [15, 0]);

  const word2_opacity = useTransform(scrollYProgress, [0.08, 0.12], [0, 1]);
  const word2_y = useTransform(scrollYProgress, [0.08, 0.12], [15, 0]);

  const word3_opacity = useTransform(scrollYProgress, [0.09, 0.13], [0, 1]);
  const word3_y = useTransform(scrollYProgress, [0.09, 0.13], [15, 0]);

  const word4_opacity = useTransform(scrollYProgress, [0.10, 0.14], [0, 1]);
  const word4_y = useTransform(scrollYProgress, [0.10, 0.14], [15, 0]);

  const word5_opacity = useTransform(scrollYProgress, [0.11, 0.15], [0, 1]);
  const word5_y = useTransform(scrollYProgress, [0.11, 0.15], [15, 0]);

  const word6_opacity = useTransform(scrollYProgress, [0.12, 0.16], [0, 1]); // FILM
  const word6_y = useTransform(scrollYProgress, [0.12, 0.16], [15, 0]);

  const word7_opacity = useTransform(scrollYProgress, [0.13, 0.17], [0, 1]); // /
  const word7_y = useTransform(scrollYProgress, [0.13, 0.17], [15, 0]);

  const word8_opacity = useTransform(scrollYProgress, [0.14, 0.18], [0, 1]);
  const word8_y = useTransform(scrollYProgress, [0.14, 0.18], [15, 0]);

  const word9_opacity = useTransform(scrollYProgress, [0.15, 0.19], [0, 1]);
  const word9_y = useTransform(scrollYProgress, [0.15, 0.19], [15, 0]);

  const word10_opacity = useTransform(scrollYProgress, [0.16, 0.20], [0, 1]);
  const word10_y = useTransform(scrollYProgress, [0.16, 0.20], [15, 0]);

  const word11_opacity = useTransform(scrollYProgress, [0.17, 0.21], [0, 1]);
  const word11_y = useTransform(scrollYProgress, [0.17, 0.21], [15, 0]);

  const wordTransforms = [
    { opacity: word0_opacity, y: word0_y },
    { opacity: word1_opacity, y: word1_y },
    { opacity: word2_opacity, y: word2_y },
    { opacity: word3_opacity, y: word3_y },
    { opacity: word4_opacity, y: word4_y },
    { opacity: word5_opacity, y: word5_y },
    { opacity: word6_opacity, y: word6_y },
    { opacity: word7_opacity, y: word7_y },
    { opacity: word8_opacity, y: word8_y },
    { opacity: word9_opacity, y: word9_y },
    { opacity: word10_opacity, y: word10_y },
    { opacity: word11_opacity, y: word11_y },
  ];

  // Camera lens focus simulation for word "FILM"
  const filmBlur = useTransform(scrollYProgress, [0.06, 0.12, 0.18], ['blur(12px)', 'blur(8px)', 'blur(0px)']);

  // Side Navigation panel reveals simultaneously with sub-heading in 1 scroll down phase (0.21 -> 0.47)
  const navMenuOpacity = useTransform(scrollYProgress, [0.21, 0.47], [0, 1]);
  const navPointerEvents = useTransform(scrollYProgress, (latest) => latest > 0.35 ? 'auto' : 'none');

  // CTAs reveal right after sub-heading and side nav (0.47 -> 0.73)
  const extraUiOpacity = useTransform(scrollYProgress, [0.47, 0.73], [0, 1]);
  const ctaPointerEvents = useTransform(scrollYProgress, (latest) => latest > 0.60 ? 'auto' : 'none');

  return (
    <>
      <div ref={containerRef} style={{ background: '#050505', minHeight: '1200vh', position: 'relative' }}>
        <div id="grain-overlay" aria-hidden="true" />
        {/* Sticky Viewport Container */}
      <div 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          overflow: 'hidden'
        }}
      >
        {/* 1A. Initial Landing Background (initial_bg.png) - Fades out on first scroll */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
            overflow: 'hidden',
            opacity: initialBgOpacity,
          }}
        >
          <img
            src="/initial_bg.png"
            alt="Initial Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'contrast(1.05) brightness(0.92)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.75) 100%)',
            }}
          />
        </motion.div>

        {/* 1B. Hero Background Image (hero-bg.png) - Darkened for optimal contrast */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            overflow: 'hidden',
            opacity: combinedHeroBgOpacity,
            filter: heroBgBlur,
            scale: heroBgScale,
            x: heroBgX,
          }}
        >
          <motion.img
            src="/hero-bg.png"
            alt="Hero Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: `contrast(1.03) brightness(${heroBrightness.toFixed(3)})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 25% 45%, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.10) 65%, rgba(5,5,5,0.45) 100%),
                linear-gradient(to bottom, rgba(5,5,5,0.15) 0%, transparent 40%, rgba(5,5,5,0.45) 88%, #050505 100%)
              `,
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* 4. The Animated "VRYKS" Text (Stage 1 scroll tracking - moved outside wrapper so it stays in navbar) */}
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (isDocked) {
              window.location.href = '/';
            }
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x,
            y,
            scale,
            transformOrigin: 'left center',
            zIndex: 100,
            cursor: isDocked ? 'pointer' : 'default',
            pointerEvents: isDocked ? 'auto' : 'none',
          }}
        >
          {/* Entrance Animation */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 45, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            style={{ perspective: '1000px', position: 'relative' }}
          >
            <div style={{ position: 'relative', width: 'clamp(300px, 45vw, 600px)', height: 'clamp(100px, 15vw, 240px)' }}>
              <TextPressure
                text="vryks"
                flex={true}
                alpha={false}
                stroke={false}
                width={false}
                weight={true}
                italic={false}
                textColor="#ffffff"
                strokeColor="#000000"
                minFontSize={36}
                isAnimating={!isScrolled}
                fontFamily="Newsreader, serif"
                fontUrl="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,200..800&display=swap"
              />
            </div>

            {/* Apple-style fade animated discipline words with custom typography */}
            <motion.div
              style={{
                opacity: initialWordsOpacity,
                y: initialWordsY,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.2rem',
                marginTop: '1.2rem',
                color: 'rgba(245, 245, 240, 0.85)',
              }}
            >
              {[
                { word: 'WEB', font: '"Space Grotesk", sans-serif', weight: 600, style: 'normal', letterSpacing: '0.22em', size: '1.0em' },
                { word: 'CREATIVES', font: 'Scholar, "Playfair Display", Georgia, serif', weight: 400, style: 'italic', letterSpacing: '0.12em', size: '1.18em' },
                { word: 'STRATEGY', font: '"Apple Garamond", "EB Garamond", Georgia, serif', weight: 400, style: 'italic', letterSpacing: '0.14em', size: '1.15em' },
                { word: 'IDENTITY', font: '"Bebas Neue Local", "Bebas Neue", sans-serif', weight: 400, style: 'normal', letterSpacing: '0.18em', size: '1.25em' },
              ].map((item, idx) => (
                <div 
                  key={item.word} 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '1.2rem',
                    pointerEvents: 'none'
                  }}
                >
                  <SplittingText
                    text={item.word}
                    type="words"
                    delay={1000 + idx * 240}
                    motionVariants={{
                      initial: { y: 14, x: 0, filter: 'blur(8px)', opacity: 0 },
                      animate: { y: 0, x: 0, filter: 'blur(0px)', opacity: 1 },
                      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontFamily: item.font,
                      fontWeight: item.weight,
                      fontStyle: item.style,
                      fontSize: `clamp(11px, 1.2vw, ${item.size})`,
                      letterSpacing: item.letterSpacing,
                      textTransform: 'uppercase',
                    }}
                  />
                  {idx < 3 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.6, scale: 1 }}
                      transition={{ delay: 1.0 + idx * 0.24 + 0.3, duration: 0.6 }}
                      style={{ color: '#eaff00', fontSize: '0.8em', fontStyle: 'normal' }}
                    >
                      •
                    </motion.span>
                  )}
                </div>
              ))}
            </motion.div>
            {/* Elegant Tooltip overlay */}
            <AnimatePresence>
              {isHovered && !isDocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 10, x: '-50%' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: '#eaff00',
                    letterSpacing: '0.12em',
                    pointerEvents: 'none',
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 0px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    boxShadow: 'none',
                  }}
                >
                  [ Scroll down ]
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* --- START HERO CONTENT WRAPPER --- */}
        <motion.div style={{ opacity: heroContentOpacity, position: 'absolute', inset: 0, zIndex: 10, pointerEvents: useTransform(scrollYProgress, (latest) => latest < 0.95 ? 'auto' : 'none') }}>
          
        {/* 2. Technical Grid Overlay (reveals in Stage 6) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(245,245,240,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,245,240,0.015) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)',
            opacity: extraUiOpacity,
          }}
        />

        {/* Procedural Geometry Field removed */}

        {/* 5. Left-aligned morphing text container (Headline + Sub description) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '0 2.5rem',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100vh',
            }}
          >
            {/* Eyebrow label (Stage 6) */}


            {/* Combined Flow Container for Headline, Sub-heading, and CTAs with exact gaps */}
            <motion.div
              style={{
                position: 'absolute',
                left: headerLeft,
                top: headerTop,
                marginTop: '45px',
                width: headerWidth,
                scale: headerScale,
                transformOrigin: 'top left',
                opacity: contentOpacity,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '25px',
              }}
            >
              {/* Header (Headline) */}
              <div
                onMouseEnter={() => setIsHeaderHovered(true)}
                onMouseLeave={() => setIsHeaderHovered(false)}
                style={{
                  position: 'relative',
                  display: 'flex', flexWrap: 'wrap', columnGap: '0.26em', rowGap: '0.05em',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  fontSize: 'clamp(2.1rem, 4.8vw, 5.8rem)', letterSpacing: '-0.04em',
                  lineHeight: 0.95, color: '#f5f5f0',
                }}
              >
                <HeaderHoverContext.Provider value={isHeaderHovered}>
                  {[
                  { word: 'Positioning', font: 'bebas', style: {} },
                  { word: 'brands', font: 'bebas', style: {} },
                  { word: 'to', font: 'bebas', style: {} },
                  { word: 'look', font: 'bebas', style: {} },
                  { word: 'like', font: 'bebas', style: { color: 'rgba(245,245,240,0.65)' } },
                  { word: 'a', font: 'garamond', style: { color: '#eaff00', fontStyle: 'italic' } },
                  { word: 'FLIM', font: 'garamond', style: { color: '#eaff00', fontStyle: 'italic' } },
                  { word: 'and', font: 'bebas', style: { color: 'rgba(245,245,240,0.65)' } },
                  { word: 'sell', font: 'bebas', style: {} },
                  { word: 'like', font: 'bebas', style: {} },
                  { word: 'a', font: 'bebas', style: { color: 'rgba(245,245,240,0.65)' } },
                  { word: 'FUNNEL', font: 'bebas', style: {} },
                ].map((item, i) => {
                  const isFilm = item.word.toLowerCase() === 'flim';
                  const isFunnel = item.word.toLowerCase().startsWith('funnel');
                  
                  // Determine font styling based on the segment
                  let fontStyle = {};
                  if (item.font === 'scholar') {
                    fontStyle = { fontFamily: 'Scholar, "Playfair Display", Georgia, serif', fontWeight: 400, letterSpacing: '0.05em' };
                  } else if (item.font === 'garamond') {
                    fontStyle = { fontFamily: '"Apple Garamond", "EB Garamond", Georgia, serif', fontWeight: 400, letterSpacing: '0.02em' };
                  } else if (item.font === 'bebas') {
                    if (isFunnel) {
                      fontStyle = { fontFamily: '"Bebas Neue Local", "Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '0.04em' };
                    } else {
                      fontStyle = { fontFamily: '"Lil Grotesk", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' };
                    }
                  }

                  return (
                    <motion.span
                      key={i}
                      style={{
                        display: 'inline-block',
                        opacity: wordTransforms[i].opacity,
                        y: wordTransforms[i].y,
                        position: 'relative',
                        ...fontStyle,
                        ...item.style,
                        ...(isFilm ? { filter: filmBlur } : {}),
                        ...(isFilm || isFunnel ? { padding: '0 8px' } : {})
                      }}
                    >
                      {isFilm ? (
                        <span style={{ position: 'relative', display: 'inline-block' }}>
                          {item.word}
                          {/* Glowing crop-brackets for focus */}
                          <motion.div
                            initial={{ opacity: 0, scale: 1.5 }}
                            animate={{
                              opacity: isHeaderHovered ? 1 : 0,
                              scale: isHeaderHovered ? 1.0 : 1.5
                            }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{
                              position: 'absolute',
                              inset: '-4px -8px',
                              pointerEvents: 'none'
                            }}
                          >
                            {/* Top-Left Corner */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '6px', borderLeft: '2px solid #eaff00', borderTop: '2px solid #eaff00', filter: 'drop-shadow(0 0 2px #eaff00)' }} />
                            {/* Top-Right Corner */}
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderRight: '2px solid #eaff00', borderTop: '2px solid #eaff00', filter: 'drop-shadow(0 0 2px #eaff00)' }} />
                            {/* Bottom-Left Corner */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '6px', height: '6px', borderLeft: '2px solid #eaff00', borderBottom: '2px solid #eaff00', filter: 'drop-shadow(0 0 2px #eaff00)' }} />
                            {/* Bottom-Right Corner */}
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '6px', height: '6px', borderRight: '2px solid #eaff00', borderBottom: '2px solid #eaff00', filter: 'drop-shadow(0 0 2px #eaff00)' }} />
                          </motion.div>
                        </span>
                      ) : isFunnel ? (
                        <Text3DFlip as="span" className="inline-flex" rotateDirection="top">
                          {item.word}
                        </Text3DFlip>
                      ) : (
                        item.word
                      )}
                    </motion.span>
                  )
                })}
                </HeaderHoverContext.Provider>
              </div>

              {/* Sub-header & CTAs inner wrapper with 15px gap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Sub-header (Paragraph description) - reveals on scroll */}
                <motion.div
                  style={{
                    width: subWidth,
                    scale: subScale,
                    transformOrigin: 'top left',
                    opacity: subOpacity,
                    pointerEvents: 'auto',
                  }}
                >
                  <motion.p
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(17px, 1.8vw, 22px)',
                      letterSpacing: '0.01em',
                      color: subColor,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    VRYKS builds brands that look like cinema, communicate like
                    strategy, and sell like engineered systems.
                    <motion.span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.6em', marginTop: '1.0rem', color: subSpanColor }}>
                      <span style={{ fontFamily: '"Apple Garamond", "EB Garamond", Georgia, serif', fontStyle: 'italic', fontSize: '1.05em' }}>
                        One studio.
                      </span>
                      <span style={{ fontFamily: '"Apple Garamond", "EB Garamond", Georgia, serif', fontStyle: 'italic', fontSize: '1.20em' }}>
                        Every discipline.
                      </span>
                      <span style={{ fontFamily: '"Apple Garamond", "EB Garamond", Georgia, serif', fontStyle: 'italic', fontSize: '1.40em' }}>
                        Own your results.
                      </span>
                    </motion.span>
                  </motion.p>
                </motion.div>

                {/* CTAs (Stage 6) - 15px gap below sub-heading */}
                <motion.div
                  style={{
                    opacity: extraUiOpacity,
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    pointerEvents: ctaPointerEvents,
                    perspective: '1000px',
                  }}
                >
              {/* Primary 3D Isometric Magnetic CTA Button */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  rotateX: 10,
                  rotateY: -8,
                  rotateZ: 1.2,
                  boxShadow: '0 20px 40px rgba(234, 255, 0, 0.40), inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.35)',
                  borderColor: 'rgba(255, 255, 255, 1)',
                }}
                whileTap={{ scale: 0.96, y: 0, rotateX: 0, rotateY: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#050505',
                  background: 'linear-gradient(180deg, #f4ff5e 0%, #eaff00 60%, #b8d400 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  padding: '13px 28px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  minWidth: '220px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(234, 255, 0, 0.25), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.25)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Dynamic Specular Shimmer Sweep on Hover */}
                <motion.span
                  initial={{ x: '-130%', opacity: 0 }}
                  whileHover={{ x: '170%', opacity: 0.8 }}
                  transition={{ duration: 0.65, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
                    transform: 'skewX(-25deg)',
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ position: 'relative', zIndex: 2 }}>VISUALISE YOUR JOURNEY</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'relative', zIndex: 2, fontSize: '13px' }}
                >
                  ↗
                </motion.span>
              </motion.button>

              {/* Secondary Refined Frosted Glass Button */}
              <motion.button
                whileHover={{
                  scale: 1.03,
                  y: -2,
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.98, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  color: 'rgba(245, 245, 240, 0.85)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(245, 245, 240, 0.22)',
                  padding: '13px 26px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                SECURE AN AUDIT
              </motion.button>
            </motion.div>
          </div>
        </motion.div>



            {/* Micro details label (Stage 6) */}
            <motion.div style={{ position: 'absolute', bottom: '4vh', right: '0%', opacity: extraUiOpacity, textAlign: 'right' }}>
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
          </div>
        </div>
        </motion.div>
        {/* --- END HERO CONTENT WRAPPER --- */}

        {/* Mobile Hamburger Nav — visible only on mobile, merges both nav sources */}
        <MobileNav containerRef={containerRef} isPlaying={isPlaying} toggleAudio={toggleAudio} />

        {/* 6. Right-side In-page Navigation — Ultra Glassmorphic Control Panel with Blurred Blob & BorderGlow (Stage 5, hidden on mobile) */}
        <motion.div
          className="hidden md:block"
          animate={{
            x: isInPageNavCollapsed ? 380 : 0
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          style={{
            position: 'absolute',
            right: '3.5rem',
            top: '50%',
            y: '-50%',
            zIndex: 70,
            opacity: navMenuOpacity,
            pointerEvents: navPointerEvents,
          }}
        >
          {/* ═══ LAYER 1 — AMBIENT BLOOM (Lime Green in Hero, Red in Enter Studio) ═══ */}
          <motion.div
            style={{
              position: 'absolute',
              top: '0%',
              right: '-40px',
              width: '380px',
              height: '500px',
              borderRadius: '50%',
              background: navBloomBg1,
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          {/* Lower-right intense glow source */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '5%',
              right: '-20px',
              width: '220px',
              height: '250px',
              borderRadius: '50%',
              background: navBloomBg2,
              filter: 'blur(45px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Floating Hamburger / Close Toggle Button (Always on screen) */}
          <div
            style={{
              position: 'absolute',
              left: '-165px',
              top: '24px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 80,
              pointerEvents: 'auto',
            }}
            onClick={() => setIsInPageNavCollapsed(!isInPageNavCollapsed)}
          >
            <motion.span
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'rgba(255, 255, 255, 0.75)',
                marginRight: '12px',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {isInPageNavCollapsed ? 'SHOW NAV' : 'HIDE NAV'}
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.08, borderColor: '#eaff00' }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(15, 15, 20, 0.72)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {/* Top Line */}
              <motion.div
                animate={{ rotate: isInPageNavCollapsed ? 0 : 45, y: isInPageNavCollapsed ? 0 : 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px' }}
              />
              {/* Middle Line */}
              <motion.div
                animate={{ opacity: isInPageNavCollapsed ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                style={{ width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px' }}
              />
              {/* Bottom Line */}
              <motion.div
                animate={{ rotate: isInPageNavCollapsed ? 0 : -45, y: isInPageNavCollapsed ? 0 : -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px' }}
              />
            </motion.div>
          </div>

          {/* ═══ FLUTED GLASS LAYERED PANEL ═══ */}
          <div
            style={{
              width: 'clamp(280px, 21vw, 320px)',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            }}
          >
            {/* Layer 1 — Base blur and tint */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(170deg, rgba(10, 5, 8, 0.50) 0%, rgba(8, 3, 5, 0.45) 40%, rgba(12, 4, 7, 0.40) 70%, rgba(8, 3, 5, 0.35) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 0,
              }}
            />
            {/* Layer 2 — Grooves/Ridges */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                maskImage: 'repeating-linear-gradient(90deg, black 0px, black 1px, transparent 3px, transparent 6px)',
                WebkitMaskImage: 'repeating-linear-gradient(90deg, black 0px, black 1px, transparent 3px, transparent 6px)',
                zIndex: 1,
              }}
            />
            {/* Layer 3 — Diffusion / Highlights */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.05)',
                maskImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, black 4px, black 5px, transparent 6px)',
                WebkitMaskImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, black 4px, black 5px, transparent 6px)',
                zIndex: 2,
              }}
            />

            {/* Layer 4 — Interactive Content Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.20)',
                padding: '1.25rem',
              }}
            >
            {/* Top specular highlight line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent 10%, rgba(255, 255, 255, 0.50) 50%, transparent 90%)',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />

            {/* Left specular highlight line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1px',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.50), transparent 35%, transparent 75%, rgba(255, 255, 255, 0.15))',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />

            {/* ═══ LAYER 2 — VISIBLE VERTICAL LIGHT STREAKS (like reference) ═══ */}
            <motion.div
              animate={{
                y: [-4, 5, -3, 4, -4],
                x: [-2, 2, -1, 2, -2],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1,
                /* Fade to dark at top, let it glow at bottom */
                maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.8) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.8) 100%)',
              }}
            >
              {/* Streak 1 — tallest, right-center, prominent */}
              <div
                style={{
                  position: 'absolute',
                  left: '60%',
                  bottom: '0%',
                  width: '22px',
                  height: '85%',
                  background: 'linear-gradient(to top, rgba(220, 50, 40, 0.70) 0%, rgba(180, 30, 28, 0.45) 30%, rgba(140, 20, 20, 0.18) 65%, transparent 90%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Streak 2 — bright, slightly right */}
              <div
                style={{
                  position: 'absolute',
                  left: '68%',
                  bottom: '0%',
                  width: '16px',
                  height: '75%',
                  background: 'linear-gradient(to top, rgba(240, 60, 50, 0.75) 0%, rgba(200, 40, 35, 0.40) 35%, rgba(150, 25, 22, 0.15) 70%, transparent 92%)',
                  filter: 'blur(6px)',
                }}
              />

              {/* Streak 3 — widest, overlapping center-right */}
              <div
                style={{
                  position: 'absolute',
                  left: '55%',
                  bottom: '0%',
                  width: '35px',
                  height: '70%',
                  background: 'linear-gradient(to top, rgba(180, 35, 30, 0.55) 0%, rgba(140, 25, 22, 0.30) 40%, rgba(100, 15, 12, 0.10) 75%, transparent 95%)',
                  filter: 'blur(14px)',
                }}
              />

              {/* Streak 4 — far right, shorter */}
              <div
                style={{
                  position: 'absolute',
                  left: '78%',
                  bottom: '0%',
                  width: '18px',
                  height: '60%',
                  background: 'linear-gradient(to top, rgba(200, 45, 38, 0.65) 0%, rgba(160, 30, 25, 0.30) 40%, rgba(120, 18, 15, 0.10) 70%, transparent 90%)',
                  filter: 'blur(7px)',
                }}
              />

              {/* Streak 5 — thin accent, between 1 and 2 */}
              <div
                style={{
                  position: 'absolute',
                  left: '64%',
                  bottom: '0%',
                  width: '10px',
                  height: '78%',
                  background: 'linear-gradient(to top, rgba(255, 70, 50, 0.60) 0%, rgba(220, 45, 38, 0.30) 35%, rgba(160, 25, 20, 0.08) 70%, transparent 95%)',
                  filter: 'blur(4px)',
                }}
              />

              {/* Streak 6 — medium, right edge */}
              <div
                style={{
                  position: 'absolute',
                  left: '85%',
                  bottom: '0%',
                  width: '14px',
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(190, 40, 32, 0.55) 0%, rgba(140, 25, 20, 0.25) 45%, transparent 80%)',
                  filter: 'blur(6px)',
                }}
              />

              {/* Streak 7 — faint, center */}
              <div
                style={{
                  position: 'absolute',
                  left: '45%',
                  bottom: '0%',
                  width: '20px',
                  height: '55%',
                  background: 'linear-gradient(to top, rgba(160, 28, 25, 0.40) 0%, rgba(120, 18, 15, 0.18) 40%, rgba(80, 10, 10, 0.05) 70%, transparent 90%)',
                  filter: 'blur(10px)',
                }}
              />

              {/* Streak 8 — very faint left-center */}
              <div
                style={{
                  position: 'absolute',
                  left: '35%',
                  bottom: '0%',
                  width: '15px',
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(130, 22, 18, 0.30) 0%, rgba(90, 12, 10, 0.12) 45%, transparent 80%)',
                  filter: 'blur(10px)',
                }}
              />

              {/* Streak 9 — barely visible far-left */}
              <div
                style={{
                  position: 'absolute',
                  left: '22%',
                  bottom: '0%',
                  width: '12px',
                  height: '30%',
                  background: 'linear-gradient(to top, rgba(100, 15, 12, 0.22) 0%, rgba(70, 10, 8, 0.08) 50%, transparent 85%)',
                  filter: 'blur(12px)',
                }}
              />

              {/* Streak 10 — thin bright accent */}
              <div
                style={{
                  position: 'absolute',
                  left: '73%',
                  bottom: '0%',
                  width: '8px',
                  height: '68%',
                  background: 'linear-gradient(to top, rgba(250, 80, 60, 0.65) 0%, rgba(210, 50, 40, 0.28) 40%, rgba(160, 25, 20, 0.06) 75%, transparent 95%)',
                  filter: 'blur(4px)',
                }}
              />
            </motion.div>

            {/* ═══ LAYER 3 — ATMOSPHERIC HAZE (wide diffuse glow behind streaks) ═══ */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              {/* Bottom-right glow source */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20%',
                  right: '-10%',
                  width: '80%',
                  height: '60%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(200, 40, 35, 0.45) 0%, rgba(150, 25, 22, 0.20) 35%, rgba(100, 15, 12, 0.08) 60%, transparent 80%)',
                  filter: 'blur(30px)',
                }}
              />

              {/* Center-right atmospheric wash */}
              <div
                style={{
                  position: 'absolute',
                  top: '20%',
                  right: '0%',
                  width: '65%',
                  height: '70%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at 60% 55%, rgba(140, 22, 20, 0.25) 0%, rgba(90, 12, 10, 0.10) 40%, transparent 65%)',
                  filter: 'blur(35px)',
                }}
              />

              {/* Left dark zone — keeps contrast */}
              <div
                style={{
                  position: 'absolute',
                  top: '0%',
                  left: '0%',
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(0, 0, 0, 0.25) 0%, transparent 80%)',
                }}
              />
            </div>

            {/* Panel Internal Content */}
            <div style={{ position: 'relative', zIndex: 3, padding: '1.4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Header Status Bar: Pill Badge + System */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '3.5px 11px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    background: 'rgba(255, 255, 255, 0.14)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eaff00', boxShadow: '0 0 8px #eaff00' }} />
                  INDEX // NAV
                </div>
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '8.5px',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontWeight: 600,
                  }}
                >
                  VRYKS // CTRL
                </div>
              </div>

              {/* Navigation Links List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[
                  { idx: '01', title: 'WORK', font: 'Space Mono, monospace', progress: 0.15 },
                  { idx: '02', title: 'SERVICES', font: 'Space Mono, monospace', progress: 0.40 },
                  { idx: '03', title: 'STUDIO', font: 'Space Mono, monospace', progress: 0.70 },
                  { idx: '04', title: 'INSIGHTS', font: 'Space Mono, monospace', progress: 0.95 },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`#${item.title.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (containerRef.current) {
                        const total = containerRef.current.scrollHeight - window.innerHeight;
                        window.scrollTo({ top: item.progress * total, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = '#ffffff';
                      el.style.background = 'rgba(255, 255, 255, 0.16)';
                      el.style.borderColor = 'rgba(234, 255, 0, 0.4)';
                      el.style.boxShadow = '0 4px 14px rgba(0, 160, 255, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)';
                      el.style.transform = 'translateX(3px)';
                    }}
                    onMouseOut={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = '#ffffff';
                      el.style.background = 'rgba(255, 255, 255, 0.04)';
                      el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      el.style.boxShadow = 'none';
                      el.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'Space Mono, monospace',
                          fontSize: '9px',
                          color: '#38bdf8',
                          fontWeight: 700,
                        }}
                      >
                        {item.idx}
                      </span>
                      <span style={{ fontFamily: item.font, fontStyle: (item as any).style || 'normal' }}>{item.title}</span>
                    </div>
                    
                    {/* Arrow Accent */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', transition: 'color 0.2s ease' }}>
                        ↗
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Bottom Footer Section */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  marginTop: '0.1rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '8px',
                    letterSpacing: '0.08em',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                  }}
                >
                  SYS // READY
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(234, 255, 0, 0.6))',
                  }}
                />
              </div>
            </div>
          </div>
          </div>
        </motion.div>



        {/* 8. Fake Header Navbar (reveals when Vryks finishes docking, hidden on mobile) */}
        <motion.div
          className="hidden md:flex"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 2.5rem',
            zIndex: 90,
            opacity: navOpacity,
            y: navY,
            borderBottom: 'none',
            background: 'transparent',
            backdropFilter: 'none',
          }}
        >
          {/* Subtitle slot - Vryks will dock next to this */}
          <div style={{ position: 'relative', height: '100%', width: '240px', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                letterSpacing: '0.18em',
                color: 'rgba(245,245,240,0.4)',
                transform: 'translateY(1px)',
                marginLeft: '110px',
              }}
            >
              STUDIOS // 2026
            </span>
          </div>
          
          {/* Centered Top Navbar Navigation: Service Categories in custom fonts */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2.0rem', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {[
              { name: 'Website', font: 'Scholar, "Playfair Display", Georgia, serif', style: 'normal', size: '17px' },
              { name: 'Design', font: '"Lil Grotesk", sans-serif', style: 'normal', size: '15px', weight: 800, tracking: '0.04em' },
              { name: 'Scripting', font: '"Apple Garamond", "EB Garamond", Georgia, serif', style: 'italic', size: '17px' },
              { name: 'Marketing', font: '"Bebas Neue Local", "Bebas Neue", sans-serif', style: 'normal', size: '16px', tracking: '0.08em' },
              { name: 'Production', font: '"Space Grotesk", sans-serif', style: 'normal', size: '16px', weight: 600 },
              { name: 'Art Direction', font: '"Allura", cursive', style: 'normal', size: '19px' },
            ].map(item => (
              <a
                key={item.name}
                href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  fontFamily: item.font,
                  fontStyle: item.style as any,
                  fontWeight: item.weight || 400,
                  fontSize: item.size,
                  letterSpacing: item.tracking || '0.02em',
                  color: 'rgba(245, 245, 240, 0.85)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease, transform 0.25s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = '#eaff00';
                  el.style.transform = 'translateY(-1px)';
                  setCursor('hover');
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = 'rgba(245, 245, 240, 0.85)';
                  el.style.transform = 'translateY(0)';
                  setCursor('explore');
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Ambient Sound Controller & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            {/* Ambient Sound Toggle Button */}
            <motion.button
              onClick={toggleAudio}
              whileHover={{ scale: 1.05, borderColor: isPlaying ? '#eaff00' : 'rgba(255,255,255,0.45)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Space Mono, monospace',
                fontSize: '9.5px',
                letterSpacing: '0.14em',
                color: isPlaying ? '#eaff00' : 'rgba(245, 245, 240, 0.55)',
                background: isPlaying ? 'rgba(234, 255, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                border: isPlaying ? '1px solid rgba(234, 255, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.14)',
                padding: '7px 14px',
                borderRadius: '30px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Dynamic Soundwave Equalizer Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '11px' }}>
                {[0.6, 1.0, 0.4, 0.8].map((h, idx) => (
                  <motion.span
                    key={idx}
                    animate={isPlaying ? {
                      scaleY: [0.25, h, 0.2, h * 0.95, 0.25],
                    } : {
                      scaleY: 0.25,
                    }}
                    transition={isPlaying ? {
                      duration: 0.75 + idx * 0.15,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    } : { duration: 0.2 }}
                    style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '100%',
                      background: isPlaying ? '#eaff00' : 'rgba(245,245,240,0.45)',
                      borderRadius: '2px',
                      transformOrigin: 'bottom center',
                    }}
                  />
                ))}
              </div>
              <span>{isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </motion.button>

            {/* 3D Isometric Transforming CTA Button with Bevel + Emboss + Shiny Border */}
            <motion.button
              whileHover={{
                scale: 1.06,
                rotateX: 14,
                rotateY: -16,
                rotateZ: 2,
                y: -3,
                x: -2,
                boxShadow: 'inset 1px 2px 2px rgba(255, 255, 255, 0.85), inset -2px -3px 4px rgba(0, 0, 0, 0.4), 6px 12px 24px rgba(234, 255, 0, 0.35), 8px 16px 28px rgba(0, 0, 0, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.95)',
              }}
              whileTap={{
                scale: 0.97,
                rotateX: 4,
                rotateY: -4,
                y: 0,
                x: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 22,
              }}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: '#050505',
                background: 'linear-gradient(180deg, #f0ff4d 0%, #eaff00 55%, #b8d400 100%)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                padding: '9px 20px',
                borderRadius: '40px',
                fontWeight: 700,
                cursor: 'pointer',
                perspective: '800px',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.7), inset -1px -2px 3px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer reflection sweep on hover */}
              <motion.span
                initial={{ x: '-120%', opacity: 0 }}
                whileHover={{ x: '160%', opacity: 0.7 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                  transform: 'skewX(-25deg)',
                  pointerEvents: 'none',
                }}
              />
              <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                START A PROJECT ↗
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Ambient Floating Sound Pill (Always accessible bottom-left) */}
        <motion.button
          onClick={toggleAudio}
          whileHover={{ scale: 1.06, borderColor: isPlaying ? '#eaff00' : 'rgba(255,255,255,0.45)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2.5rem',
            zIndex: 95,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: isPlaying ? '#eaff00' : 'rgba(245, 245, 240, 0.6)',
            background: isPlaying ? 'rgba(234, 255, 0, 0.08)' : 'rgba(15, 15, 20, 0.65)',
            border: isPlaying ? '1px solid rgba(234, 255, 0, 0.45)' : '1px solid rgba(255, 255, 255, 0.15)',
            padding: '7px 14px',
            borderRadius: '30px',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.25s ease',
          }}
        >
          {/* Dynamic Soundwave Equalizer Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '10px' }}>
            {[0.5, 1.0, 0.3, 0.8].map((h, idx) => (
              <motion.span
                key={idx}
                animate={isPlaying ? {
                  scaleY: [0.25, h, 0.2, h * 0.95, 0.25],
                } : {
                  scaleY: 0.25,
                }}
                transition={isPlaying ? {
                  duration: 0.75 + idx * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                } : { duration: 0.2 }}
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '100%',
                  background: isPlaying ? '#eaff00' : 'rgba(245,245,240,0.45)',
                  borderRadius: '2px',
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>
          <span>{isPlaying ? 'AMBIENT SOUND [ON]' : 'AMBIENT SOUND [OFF]'}</span>
        </motion.button>

        {/* Ambient HTML5 Audio Element */}
        <audio ref={audioRef} src="/bg.mp3" loop preload="auto" />

        <EnterStudioOverlay studioProgress={studioProgress} />

        {/* ═══ FOUR PILLARS SECTION ═══ */}
        {pillarsValue > 0.01 && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 14,
              pointerEvents: pillarsValue > 0.08 ? 'auto' : 'none',
              opacity: pillarsFadeValue,
            }}
          >
            <FourPillarsPage scrollProgress={pillarsValue} />
          </motion.div>
        )}

        {/* ═══ WHY CHOOSE US SECTION ═══ */}
        {whyValue > 0.01 && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 16,
              pointerEvents: whyValue > 0.08 ? 'auto' : 'none',
              opacity: whyFadeValue,
            }}
          >
            <WhyChooseUsPage scrollProgress={whyValue} />
          </motion.div>
        )}

        {/* ═══ PROPOSITION SECTION ═══ */}
        {propositionValue > 0.01 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 17,
              pointerEvents: propositionValue > 0.08 ? 'auto' : 'none',
            }}
          >
            <PropositionPage scrollProgress={propositionValue} />
          </div>
        )}

        {/* Mouse-following loader Scroll Counter */}
        <ScrollCounter 
          value={counterState.value} 
          isVisible={counterState.isVisible} 
          stageLabel={counterState.label} 
        />
      </div>
    </div>
    <RemainingSections />
    </>
  );
}

