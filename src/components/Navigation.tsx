import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setCursor } from './CustomCursor';

interface NavProps {
  scrollY: number;
}

const NAV_LINKS = ['WORK', 'SERVICES', 'FAQ', 'WORK WITH US'];

export function Navigation({ scrollY }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(scrollY > 60);
  }, [scrollY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          height: '64px',
          borderBottom: scrolled ? '1px solid rgba(245,245,240,0.06)' : '1px solid transparent',
          background: scrolled
            ? 'rgba(5,5,5,0.88)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '0.05em',
              color: '#f5f5f0',
              cursor: 'pointer',
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            VRYKS®
          </span>
          <span
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '8px',
              letterSpacing: '0.18em',
              color: 'rgba(245,245,240,0.3)',
            }}
          >
            DIGITAL STUDIO / 2026
          </span>
        </div>

        {/* Center: Nav links — desktop only */}
        <div
          className="nav-center"
          style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(245,245,240,0.55)',
                background: 'none',
                border: 'none',
                cursor: 'none',
                transition: 'color 0.25s ease',
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = '#f5f5f0')
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  'rgba(245,245,240,0.55)')
              }
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right: CTA + Mobile menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            className="nav-cta"
            onMouseEnter={() => setCursor('enter')}
            onMouseLeave={() => setCursor('default')}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: '#050505',
              background: '#eaff00',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '40px',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 24px rgba(234, 255, 0,0.35)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            START A PROJECT ↗
          </button>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: '1px solid rgba(245,245,240,0.2)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <span
              style={{
                display: 'block',
                width: 14,
                height: 1,
                background: '#f5f5f0',
                transition: 'transform 0.3s ease',
                transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 14,
                height: 1,
                background: '#f5f5f0',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: menuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(5,5,5,0.97)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <motion.button
              key={link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => scrollTo(link.toLowerCase())}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 10vw, 5rem)',
                letterSpacing: '-0.04em',
                color: '#f5f5f0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {link}
            </motion.button>
          ))}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-center { display: none !important; }
          .nav-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

