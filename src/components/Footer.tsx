import { setCursor } from './CustomCursor';

const NAV_LINKS = ['WORK', 'SERVICES', 'STUDIO', 'INSIGHTS'];
const SOCIAL_LINKS = ['INSTAGRAM', 'LINKEDIN', 'BEHANCE'];

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        background: '#030303',
        borderTop: '1px solid rgba(245,245,240,0.06)',
        padding: 'clamp(4rem, 8vw, 6rem) 2.5rem 2.5rem',
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '4rem',
          alignItems: 'flex-start',
          marginBottom: '4rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo + tagline */}
        <div>
          <div
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              color: '#f5f5f0',
              marginBottom: '1rem',
            }}
          >
            VRYKS®
          </div>
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.22em',
              color: 'rgba(245,245,240,0.25)',
              lineHeight: 2,
            }}
          >
            DIGITAL STUDIO
            <br />
            STRATEGY / DESIGN / TECHNOLOGY
          </div>
        </div>

        {/* Nav columns */}
        <div style={{ display: 'flex', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'rgba(245,245,240,0.35)',
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  textAlign: 'left',
                  transition: 'color 0.25s ease',
                }}
                onMouseOver={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#f5f5f0')
                }
                onMouseOut={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    'rgba(245,245,240,0.35)')
                }
              >
                {link}
              </button>
            ))}
            <button
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: 'rgba(245,245,240,0.35)',
                background: 'none',
                border: 'none',
                cursor: 'none',
                textAlign: 'left',
                transition: 'color 0.25s ease',
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = '#f5f5f0')
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  'rgba(245,245,240,0.35)')
              }
            >
              CONTACT
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SOCIAL_LINKS.map((link) => (
              <button
                key={link}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'rgba(245,245,240,0.35)',
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  textAlign: 'left',
                  transition: 'color 0.25s ease',
                }}
                onMouseOver={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#eaff00')
                }
                onMouseOut={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    'rgba(245,245,240,0.35)')
                }
              >
                {link} ↗
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'rgba(245,245,240,0.06)',
          marginBottom: '2rem',
        }}
      />

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: 'rgba(245,245,240,0.2)',
          }}
        >
          © 2026 VRYKS. ALL RIGHTS RESERVED.
        </span>

        <span
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'rgba(234, 255, 0,0.35)',
          }}
        >
          BUILT TO MOVE.
        </span>
      </div>
    </footer>
  );
}

