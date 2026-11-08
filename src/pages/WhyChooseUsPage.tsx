import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─── Assets ──────────────────────────────────────────────────────────
   The plate and the car are separate exports of the same 16:9 frame, so
   they only stay registered if they crop as one unit — hence the shared
   full-bleed cover box below, rather than two independent images.
──────────────────────────────────────────────────────────────────────*/
const PLATE_SRC = '/why-choose-us.png';
const CAR_SRC = '/why-choose-us-car.png';
const BG_ASPECT = 16 / 9;

/* The car sits at roughly 66% across and 36% down the plate, spanning
   59–74% horizontally. The headline is sized and parked so the car floats
   over the middle of "Discerning" — between the "Discern" and the "ing":

       Why the Discern [car] ing
              Choose us!

   HEADER_TOP lines the car up with the first line's optical centre.
   HEADER_NUDGE_X slides the block a hair if the break lands off-centre
   under your machine's rendering of the serif. */
const HEADER_TOP = '30%';
const HEADER_NUDGE_X = '0%';

/* Wide enough that the "Discern|ing" break falls under the car. Shrinking
   this pulls the break left, away from it. */
const HEADLINE_SIZE = 'clamp(2rem, 5.7vw, 7rem)';

/* The car threads through the word: everything up to the tail passes behind
   it, and these last letters ride in front. Derived from one string so the
   two stacked copies of the line can never fall out of sync. */
const HEADLINE_LINE_1 = 'Why the Discerning';
const HEADLINE_TAIL = 'ng';
const HEADLINE_LEAD = HEADLINE_LINE_1.slice(0, -HEADLINE_TAIL.length);

const REASONS = [
  {
    id: '01',
    title: 'Founder-Level Attention',
    image: '/founder-attention.png',
    body: 'You aren’t handed off to junior account managers. Dedicated support and strategic insight from a team of specialists — not generalists.',
  },
  {
    id: '02',
    title: 'Obsession with Outcomes',
    // `obession-results` is spelled that way in /public.
    image: '/obession-results.png',
    body: 'Art-centric, data-driven, obsessed with making you look good in the boardroom. We measure our success solely by your growth.',
  },
  {
    id: '03',
    title: 'The Full-Stack Ecosystem',
    image: '/ecosystem-full.png',
    body: 'The craft of a boutique design studio, the deep tech of a development firm, and the ruthless discipline of a performance agency. All in one place.',
  },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Maps a raw progress value onto a [start, end] window, eased. */
const phase = (p: number, start: number, end: number) => smooth(clamp01((p - start) / (end - start)));

const SERIF = '"Apple Garamond", "Scholar", Georgia, "Times New Roman", serif';
const MONO = '"Space Mono", ui-monospace, monospace';
const SANS = '"Space Grotesk", "Lil Grotesk", "Inter", sans-serif';

/* Both stacked copies of line one must measure identically, so the metrics
   live in one place. */
const HEADLINE_LINE: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: HEADLINE_SIZE,
  fontWeight: 500,
  lineHeight: 1.04,
  letterSpacing: '-0.02em',
  color: '#ffffff',
  whiteSpace: 'nowrap',
};

/* ─── Card ──────────────────────────────────────────────────────────── */
function ReasonCard({ reason, reveal }: { reason: typeof REASONS[number]; reveal: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        flex: '1 1 0',
        // Floor turns the row into a horizontal swipe strip on phones instead
        // of three unreadable slivers; on desktop they expand past it evenly.
        minWidth: 'min(68vw, 300px)',
        height: 'clamp(220px, 27vh, 330px)',
        borderRadius: '18px',
        overflow: 'hidden',
        border: `1px solid rgba(255,255,255,${hovered ? 0.28 : 0.12})`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 34}px)`,
        transition: 'border-color 0.35s ease',
        pointerEvents: reveal > 0.05 ? 'auto' : 'none',
      }}
    >
      {/* Artwork — blurs and dims so the body copy can sit on top of it */}
      <img
        src={reason.image}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: hovered ? 'blur(7px) brightness(0.34) saturate(0.9)' : 'blur(0px) brightness(0.78)',
          transform: `scale(${hovered ? 1.06 : 1})`,
          transition: 'filter 0.45s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Grounding wash so the heading always holds against busy artwork */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(4,4,6,0.88) 0%, rgba(4,4,6,0.35) 45%, rgba(4,4,6,0.12) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(18px, 1.8vw, 28px)',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: hovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.42)',
            transition: 'color 0.35s ease',
          }}
        >
          {reason.id}
        </span>

        <h3
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(17px, 1.35vw, 23px)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            color: '#ffffff',
            margin: 0,
          }}
        >
          {reason.title}
        </h3>

        {/* Body is the reward for hovering — it takes no space until then */}
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(12.5px, 0.92vw, 15px)',
            lineHeight: 1.55,
            color: 'rgba(240,240,245,0.86)',
            margin: 0,
            maxHeight: hovered ? '11em' : '0em',
            opacity: hovered ? 1 : 0,
            transform: `translateY(${hovered ? 0 : 8}px)`,
            transition: 'opacity 0.4s ease, transform 0.45s ease, max-height 0.45s ease',
            overflow: 'hidden',
          }}
        >
          {reason.body}
        </p>
      </div>
    </article>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export interface WhyChooseUsPageProps {
  /** 0 → 1 from Home's scroll timeline. Omitted (standalone route) renders
   *  the section fully revealed. */
  scrollProgress?: number;
}

export function WhyChooseUsPage({ scrollProgress }: WhyChooseUsPageProps = {}) {
  const controlled = scrollProgress !== undefined;
  const p = controlled ? clamp01(scrollProgress!) : 1;

  const sceneIn = phase(p, 0.0, 0.16);
  const headerIn = phase(p, 0.08, 0.32);

  /* ── Dolly ────────────────────────────────────────────────────────
     Entering the section is a push into the frame: every layer starts
     oversized and settles to 1, the nearer ones travelling further so
     they appear to rush past the plate. All of them land on exactly 1
     at the end of the move, so the car and the headline are perfectly
     registered with the plate at rest — the parallax only exists while
     something is moving to hide it. */
  const dolly = phase(p, 0.0, 0.42);
  const plateScale = 1.14 - 0.14 * dolly;
  const carScale = 1.22 - 0.22 * dolly;
  const headScale = 1.30 - 0.30 * dolly;
  const cardsScale = 0.93 + 0.07 * dolly;

  /* Depth of field: the plate resolves as we arrive. */
  const plateBlur = (1 - dolly) * 5;

  /* ── Pointer parallax ─────────────────────────────────────────────
     Motion values, not state — the pointer must not re-render the tree.
     Amplitudes rise with depth: plate least, headline most. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 55, damping: 20, mass: 0.7 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const plateX = useTransform(sx, [-1, 1], [12, -12]);
  const plateY = useTransform(sy, [-1, 1], [8, -8]);
  const carX = useTransform(sx, [-1, 1], [26, -26]);
  const carY = useTransform(sy, [-1, 1], [16, -16]);
  const headX = useTransform(sx, [-1, 1], [38, -38]);
  const headY = useTransform(sy, [-1, 1], [22, -22]);
  const cardX = useTransform(sx, [-1, 1], [8, -8]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    px.set((e.clientX / window.innerWidth) * 2 - 1);
    py.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: controlled ? 'absolute' : 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04040a',
        opacity: sceneIn,
      }}
    >
      {/* Full-bleed cover box. Plate, headline and car all live inside it so
          the car/word overlap holds however the frame crops. */}
      <div
        style={{
          position: 'absolute',
          width: `max(100%, ${(100 * BG_ASPECT).toFixed(2)}vh)`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Plate stays in flow so it keeps defining the cover box height —
            transforms do not affect layout, so the box is unaffected. */}
        <motion.div
          style={{
            x: plateX,
            y: plateY,
            scale: plateScale,
            filter: `blur(${plateBlur.toFixed(2)}px)`,
            transformOrigin: '66% 36%',
          }}
        >
          <img
            src={PLATE_SRC}
            alt=""
            draggable={false}
            style={{ display: 'block', width: '100%', height: 'auto', userSelect: 'none' }}
          />
        </motion.div>

        {/* Headline sits under the car in z, so the car occludes the middle
            of "Discerning" as it floats. */}
        <motion.div
          style={{
            position: 'absolute',
            left: HEADER_NUDGE_X,
            right: 0,
            top: HEADER_TOP,
            zIndex: 1,
            textAlign: 'center',
            opacity: headerIn,
            x: headX,
            y: headY,
            scale: headScale,
            transformOrigin: '66% 40%',
            pointerEvents: 'none',
          }}
        >
          <div style={HEADLINE_LINE}>{HEADLINE_LINE_1}</div>
          <div style={HEADLINE_LINE}>Choose us!</div>

          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(11px, 0.95vw, 15px)',
              letterSpacing: '0.02em',
              color: 'rgba(235,235,245,0.55)',
              marginTop: 'clamp(10px, 1.2vw, 20px)',
              whiteSpace: 'nowrap',
            }}
          >
            — and why they never settle for less thereafter.
          </div>
        </motion.div>

        {/* Car rides above the headline. The wrapper owns the dolly and the
            pointer parallax; the image owns the float — they are separate
            elements because `y` is a single transform channel and one would
            otherwise overwrite the other. */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            x: carX,
            y: carY,
            scale: carScale,
            transformOrigin: '66% 36%',
            pointerEvents: 'none',
          }}
        >
          <motion.img
            src={CAR_SRC}
            alt=""
            draggable={false}
            animate={{ y: ['-1.3%', '1.3%'] }}
            transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* The tail of "Discerning" again, this time ABOVE the car, so the
            car threads through the word instead of sitting flatly in front
            of it. The lead is rendered but hidden: it still takes up its
            exact width, so these glyphs land precisely on their twins in the
            layer underneath. Same transforms, same metrics, same motion
            values — nothing here can drift out of register. */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            left: HEADER_NUDGE_X,
            right: 0,
            top: HEADER_TOP,
            zIndex: 3,
            textAlign: 'center',
            opacity: headerIn,
            x: headX,
            y: headY,
            scale: headScale,
            transformOrigin: '66% 40%',
            pointerEvents: 'none',
          }}
        >
          <div style={HEADLINE_LINE}>
            <span style={{ visibility: 'hidden' }}>{HEADLINE_LEAD}</span>
            {HEADLINE_TAIL}
          </div>
        </motion.div>
      </div>

      {/* Cards — one centred row below the headline, viewport-anchored so
          they stay well placed at any aspect. */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '62vh',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(12px, 1.5vw, 26px)',
          padding: '0 clamp(18px, 6vw, 110px)',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          x: cardX,
          scale: cardsScale,
          transformOrigin: '50% 0%',
        }}
      >
        {REASONS.map((reason, i) => (
          <ReasonCard
            key={reason.id}
            reason={reason}
            reveal={phase(p, 0.3 + i * 0.12, 0.48 + i * 0.12)}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default WhyChooseUsPage;
