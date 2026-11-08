import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  toggleAudio: () => void;
}

const NAV_LINKS = [
  { idx: '01', title: 'WORK', progress: 0.15 },
  { idx: '02', title: 'SERVICES', progress: 0.40 },
  { idx: '03', title: 'STUDIO', progress: 0.70 },
  { idx: '04', title: 'INSIGHTS', progress: 0.95 },
];

const SERVICE_LINKS = [
  { name: 'Website', font: 'Scholar, "Playfair Display", Georgia, serif', style: 'normal', weight: 400 },
  { name: 'Design', font: '"Lil Grotesk", sans-serif', style: 'normal', weight: 800 },
  { name: 'Scripting', font: '"Apple Garamond", "EB Garamond", Georgia, serif', style: 'italic', weight: 400 },
  { name: 'Marketing', font: '"Bebas Neue Local", "Bebas Neue", sans-serif', style: 'normal', weight: 400 },
  { name: 'Production', font: '"Space Grotesk", sans-serif', style: 'normal', weight: 600 },
  { name: 'Art Direction', font: '"Allura", cursive', style: 'normal', weight: 400 },
];

export function MobileNav({ containerRef, isPlaying, toggleAudio }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (progress: number) => {
    setIsOpen(false);
    if (containerRef.current) {
      const total = containerRef.current.scrollHeight - window.innerHeight;
      window.scrollTo({ top: progress * total, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hamburger button – fixed top-right, mobile only via CSS */}
      <style>{`
        @media (min-width: 768px) {
          .vryks-mobile-nav-trigger { display: none !important; }
          .vryks-mobile-overlay { display: none !important; }
        }
      `}</style>
      <div
        className="vryks-mobile-nav-trigger"
        style={{ position: 'fixed', top: '1.1rem', right: '1.25rem', zIndex: 999, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
      >
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: 'rgba(245,245,240,0.9)',
          }}
        >
          VRYKS
        </span>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(12,12,16,0.80)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4.5px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.55)',
          }}
        >
          <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{ display: 'block', width: '17px', height: '2px', background: '#fff', borderRadius: '2px' }} />
          <motion.span animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0.4 : 1 }} transition={{ duration: 0.18 }}
            style={{ display: 'block', width: '17px', height: '2px', background: '#fff', borderRadius: '2px' }} />
          <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{ display: 'block', width: '17px', height: '2px', background: '#fff', borderRadius: '2px' }} />
        </motion.button>
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="vryks-mobile-overlay flex flex-col"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 998,
              background: 'rgba(5,5,5,0.92)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              padding: '5.5rem 1.75rem 2.5rem',
              overflowY: 'auto',
            }}
          >
            {/* Top rule */}
            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)', marginBottom: '1.8rem' }} />

            {/* INDEX badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', color: '#fff', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', width: 'fit-content', marginBottom: '1.5rem' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eaff00', boxShadow: '0 0 8px #eaff00', flexShrink: 0 }} />
              INDEX // NAV
            </div>

            {/* Main nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '2rem' }}>
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item.idx}
                  href={`#${item.title.toLowerCase()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.progress); }}
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '14px', fontWeight: 600, letterSpacing: '0.13em', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#38bdf8', fontWeight: 700 }}>{item.idx}</span>
                    {item.title}
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>↗</span>
                </motion.a>
              ))}
            </nav>

            {/* Divider */}
            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)', marginBottom: '1.6rem' }} />

            {/* Services */}
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '8.5px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>SERVICES</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {SERVICE_LINKS.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + i * 0.05, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIsOpen(false)}
                  style={{ fontFamily: item.font, fontStyle: item.style as 'normal' | 'italic', fontWeight: item.weight, fontSize: '15px', color: 'rgba(245,245,240,0.78)', textDecoration: 'none', padding: '7px 14px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'inline-block' }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)', marginBottom: '1.6rem' }} />

            {/* Audio toggle */}
            <motion.button
              onClick={toggleAudio}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52 }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', color: isPlaying ? '#eaff00' : 'rgba(245,245,240,0.55)', background: isPlaying ? 'rgba(234,255,0,0.08)' : 'rgba(255,255,255,0.04)', border: isPlaying ? '1px solid rgba(234,255,0,0.4)' : '1px solid rgba(255,255,255,0.14)', padding: '12px 18px', borderRadius: '30px', cursor: 'pointer', width: '100%', marginBottom: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '12px' }}>
                {[0.6, 1.0, 0.4, 0.8].map((h, idx) => (
                  <motion.span key={idx} animate={isPlaying ? { scaleY: [0.25, h, 0.2, h * 0.95, 0.25] } : { scaleY: 0.25 }} transition={isPlaying ? { duration: 0.75 + idx * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                    style={{ display: 'inline-block', width: '2.5px', height: '100%', background: isPlaying ? '#eaff00' : 'rgba(245,245,240,0.45)', borderRadius: '2px', transformOrigin: 'bottom center' }} />
                ))}
              </div>
              {isPlaying ? 'AMBIENT SOUND [ON]' : 'AMBIENT SOUND [OFF]'}
            </motion.button>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.60, duration: 0.4 }}
              onClick={() => setIsOpen(false)}
              style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.16em', color: '#050505', background: 'linear-gradient(180deg, #f0ff4d 0%, #eaff00 55%, #b8d400 100%)', border: 'none', padding: '15px 24px', borderRadius: '40px', fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 8px 28px rgba(234,255,0,0.32)' }}
            >
              START A PROJECT ↗
            </motion.button>

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68 }}
              style={{ marginTop: 'auto', paddingTop: '2rem', fontFamily: 'Space Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(245,245,240,0.2)', display: 'flex', justifyContent: 'space-between' }}>
              <span>VRYKS / 001</span>
              <span style={{ color: 'rgba(234,255,0,0.35)' }}>SYSTEM ACTIVE</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
