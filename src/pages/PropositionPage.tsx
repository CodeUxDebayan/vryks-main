import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PropositionPageProps {
  scrollProgress?: number;
}

interface TierItem {
  step: string;
  category: string;
  badge?: string;
  headline: string;
  tagline: string;
  description: string;
  bullets: string[];
  bestFor: string;
  cta: string;
  accent: string;
  accentGlow: string;
  isCenter: boolean;
}

const TIERS: TierItem[] = [
  {
    step: '01',
    category: 'PROJECT-BASED',
    badge: 'DEFINED SCOPE',
    headline: 'Creative Breakthrough',
    tagline: 'One brief. One team. One outcome.',
    description:
      'Ideal for launches, websites, high-impact campaigns, rebrands, and premium ad shoots. A defined scope executed with devastating precision.',
    bullets: [
      'Cross-pillar full activation',
      'Executive-level involvement',
      'Custom SLA & reporting cadence',
      'Fixed scope & agreed timeline',
    ],
    bestFor: 'Brand launches · Website builds · Campaign activations · Rebrands · Product shoots',
    cta: 'START A PROJECT ↗',
    accent: '#f5f5f0',
    accentGlow: 'rgba(255, 255, 255, 0.3)',
    isCenter: false,
  },
  {
    step: '02',
    category: 'EMBEDDED PARTNER',
    badge: 'MOST CHOSEN',
    headline: 'Studio Membership',
    tagline: 'Your studio on demand.',
    description:
      "Monthly engagement where VRYKS becomes an embedded creative partner — available, consistent, and always aligned with your brand's direction and momentum.",
    bullets: [
      'Priority turnaround guaranteed',
      'Dedicated creative team with strategic oversight',
      'Flexible monthly scope with rollover hours — zero waste',
      'Quarterly strategy review & compounding brand equity',
    ],
    bestFor: 'Ongoing brand building · Content creation · Continuous marketing · Month-to-month creative needs',
    cta: 'CLAIM MEMBERSHIP ↗',
    accent: '#eaff00',
    accentGlow: 'rgba(234, 255, 0, 0.45)',
    isCenter: true,
  },
  {
    step: '03',
    category: 'DEDICATED EXTENSION',
    badge: 'EXCLUSIVE',
    headline: 'Creative Residency',
    tagline: 'Integrated creative studio for your brand.',
    description:
      'For businesses that want VRYKS to operate as an embedded extension of their internal team. Dedicated squads for content, tech, and strategy.',
    bullets: [
      'Embedded team structure with dedicated production pipeline',
      'Annual strategic roadmap & milestone-based delivery',
      'Full IP transfer on completion',
      'Transparent, upfront investment',
    ],
    bestFor: 'Enterprise-level partnerships · Full brand overhauls · Long-term strategic engagements',
    cta: 'EXPLORE RESIDENCY ↗',
    accent: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    isCenter: false,
  },
];

export function PropositionPage({ scrollProgress = 0 }: PropositionPageProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Section fade in: 0 -> 0.10, remains fully visible so cards don't prematurely disappear
  const sectionOpacity = (() => {
    if (scrollProgress < 0.10) return scrollProgress / 0.10;
    return 1;
  })();

  // Headline reveal: 0.04 -> 0.16
  const headlineProgress = Math.min(1, Math.max(0, (scrollProgress - 0.04) / 0.12));

  // Cards enter: staggered across 0.08 -> 0.36
  const getCardProgress = (i: number) => {
    const start = 0.08 + i * 0.08;
    const end = start + 0.16;
    return Math.min(1, Math.max(0, (scrollProgress - start) / (end - start)));
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        opacity: sectionOpacity,
      }}
    >
      {/* ═══ LAYER 1: RADIANT BACKGROUND (three-models.png) ═══ */}
      {/* Uncompressed brightness and vivid luminescence so glowing coil and blue rocks radiate through glass */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/three-models.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.96) saturate(1.22) contrast(1.05)',
          pointerEvents: 'none',
        }}
      />

      {/* ═══ LAYER 2: LIGHT ATMOSPHERIC OVERLAY ═══ */}
      {/* Gentle top/bottom atmospheric vignette for high contrast typography without killing the scene's brightness */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(4,4,7,0.50) 0%, rgba(4,4,7,0.12) 25%, rgba(4,4,7,0.10) 65%, rgba(4,4,7,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ═══ LAYER 3: CHROMATIC AMBIENT LIGHT BLOOMS ═══ */}
      {/* Warm amber/gold glow from helical coil in the center */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75vw',
          maxWidth: '1050px',
          height: '380px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(255, 125, 20, 0.18) 0%, rgba(234, 255, 0, 0.08) 45%, transparent 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Bioluminescent blue crystal reflections at lower flanks */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '10%',
          width: '450px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 180, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '10%',
          width: '450px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 180, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* ═══ LAYER 4: CONTENT WRAPPER ═══ */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1420px',
          padding: '0 clamp(1.2rem, 3vw, 2.8rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1.1rem, 2.2vh, 2.2rem)',
          alignItems: 'center',
        }}
      >
        {/* Header Block */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: headlineProgress }}>
            <span style={{ display: 'block', width: '28px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 700,
              }}
            >
              06 · HOW IT WORKS — THREE ENGAGEMENT MODELS
            </span>
            <span style={{ display: 'block', width: '28px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
          </div>

          {/* Headline with clip-path reveal */}
          <div style={{ overflow: 'hidden' }}>
            <h2
              style={{
                fontFamily: 'Gazpacho, "Space Grotesk", sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(2.4rem, 4.8vw, 4.6rem)',
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                color: '#f5f5f0',
                margin: 0,
                clipPath: `inset(0 ${(1 - headlineProgress) * 100}% 0 0)`,
              }}
            >
              Choose your
              <span style={{ fontStyle: 'italic', color: '#eaff00' }}> engagement.</span>
            </h2>
          </div>

          <p
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(13px, 1.05vw, 15px)',
              color: 'rgba(245,245,240,0.75)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '640px',
              alignSelf: 'center',
              opacity: headlineProgress,
              transform: `translateY(${(1 - headlineProgress) * 14}px)`,
            }}
          >
            Three models. Designed around you. No monthly subscriptions or retainer lock-in by default — pick the
            structure calibrated to your stage.
          </p>
        </div>

        {/* Three-Tier Glassmorphic Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(1rem, 1.6vw, 1.8rem)',
            width: '100%',
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((tier, i) => {
            const cp = getCardProgress(i);
            return (
              <motion.div
                key={tier.headline}
                initial={false}
                whileHover={{
                  y: -8,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
                style={{
                  opacity: cp,
                  transform: `translateY(${(1 - cp) * 32 + (tier.isCenter ? -10 : 0)}px)`,
                  borderRadius: '20px',
                  border: tier.isCenter
                    ? '1.5px solid rgba(234, 255, 0, 0.48)'
                    : '1px solid rgba(255, 255, 255, 0.22)',
                  background: tier.isCenter
                    ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 35%, rgba(22, 18, 36, 0.42) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 35%, rgba(12, 10, 20, 0.35) 100%)',
                  backdropFilter: 'blur(32px) saturate(190%) brightness(1.10)',
                  WebkitBackdropFilter: 'blur(32px) saturate(190%) brightness(1.10)',
                  padding: tier.isCenter
                    ? 'clamp(1.6rem, 2.5vh, 2.3rem) clamp(1.3rem, 1.8vw, 2.0rem)'
                    : 'clamp(1.4rem, 2.2vh, 2.0rem) clamp(1.2rem, 1.6vw, 1.8rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'clamp(0.8rem, 1.3vh, 1.15rem)',
                  position: 'relative',
                  boxShadow: tier.isCenter
                    ? '0 32px 75px rgba(0, 0, 0, 0.55), 0 0 35px rgba(234, 255, 0, 0.15), inset 0 2px 1.5px rgba(255, 255, 255, 0.7), inset 0 -1px 1.5px rgba(234, 255, 0, 0.25), inset 0 0 25px rgba(234, 255, 0, 0.04)'
                    : '0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1.5px 1px rgba(255, 255, 255, 0.45), inset 0 -1px 1px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02)',
                  overflow: 'hidden',
                }}
              >
                {/* Diagonal Specular Reflection Layer */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '55%',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Specular Glare Rim */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '8%',
                    right: '8%',
                    height: '1.5px',
                    background: tier.isCenter
                      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, #eaff00 50%, rgba(255,255,255,0.95) 70%, transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75) 50%, transparent)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Card Header: Tag & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <span
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      color: tier.accent,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: tier.accent,
                        boxShadow: `0 0 8px ${tier.accent}`,
                      }}
                    />
                    {tier.step} // {tier.category}
                  </span>
                  {tier.badge && (
                    <span
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '8px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: tier.isCenter ? '#050505' : tier.accent,
                        background: tier.isCenter
                          ? 'linear-gradient(90deg, #f4ff5e, #eaff00)'
                          : 'rgba(255,255,255,0.08)',
                        border: tier.isCenter ? 'none' : '1px solid rgba(255,255,255,0.18)',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        boxShadow: tier.isCenter ? '0 2px 10px rgba(234,255,0,0.35)' : 'none',
                      }}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>

                {/* Title, Tagline & Overview Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative', zIndex: 2 }}>
                  <h3
                    style={{
                      fontFamily: 'Gazpacho, "Space Grotesk", sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(22px, 1.8vw, 27px)',
                      letterSpacing: '-0.02em',
                      color: tier.accent,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {tier.headline}
                  </h3>
                  <div
                    style={{
                      fontFamily: '"Apple Garamond", "EB Garamond", Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: '14px',
                      color: 'rgba(245, 245, 240, 0.95)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {tier.tagline}
                  </div>
                  <p
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      color: 'rgba(245, 245, 240, 0.68)',
                      margin: '4px 0 0 0',
                    }}
                  >
                    {tier.description}
                  </p>
                </div>

                {/* Subtle Refractive Divider */}
                <div
                  style={{
                    height: '1px',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.14) 80%, transparent)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />

                {/* Every Point in the Content Copy */}
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(0.4rem, 0.65vh, 0.55rem)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {tier.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 'clamp(12px, 0.9vw, 13.5px)',
                        color: 'rgba(245, 245, 240, 0.90)',
                        lineHeight: 1.4,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: '3px' }}
                      >
                        <path
                          d="M2.5 7.5L5.5 10.5L11.5 3.5"
                          stroke={tier.accent}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Best For Container */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '8px',
                      letterSpacing: '0.14em',
                      color: 'rgba(255, 255, 255, 0.45)',
                      fontWeight: 700,
                    }}
                  >
                    BEST SUITED FOR:
                  </span>
                  <span
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(245, 245, 240, 0.75)',
                      lineHeight: 1.4,
                    }}
                  >
                    {tier.bestFor}
                  </span>
                </div>

                {/* Action CTA Button */}
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: tier.isCenter
                      ? '0 8px 30px rgba(234, 255, 0, 0.45), inset 0 1px 2px rgba(255,255,255,0.9)'
                      : '0 8px 24px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255,255,255,0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9.5px',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    color: tier.isCenter ? '#050505' : '#f5f5f0',
                    background: tier.isCenter
                      ? 'linear-gradient(180deg, #f4ff5e 0%, #eaff00 55%, #b8d400 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: tier.isCenter
                      ? '1px solid rgba(255, 255, 255, 0.8)'
                      : '1px solid rgba(255, 255, 255, 0.22)',
                    padding: '11px 18px',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: tier.isCenter
                      ? '0 6px 20px rgba(234,255,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8)'
                      : 'none',
                    backdropFilter: 'blur(8px)',
                    transition: 'background 0.2s ease, border-color 0.2s ease',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {tier.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div
          style={{
            opacity: Math.min(1, Math.max(0, (scrollProgress - 0.35) / 0.14)),
            fontFamily: 'Space Mono, monospace',
            fontSize: '8.5px',
            letterSpacing: '0.20em',
            color: 'rgba(255, 255, 255, 0.50)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#eaff00' }} />
          ALL ENGAGEMENTS BEGIN WITH A FREE 30-MINUTE BRAND AUDIT
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#eaff00' }} />
        </div>
      </div>
    </div>
  );
}
