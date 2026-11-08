import { useRef, useEffect, useMemo, useCallback, useReducer, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';

/* ─── Constants ─────────────────────────────────────────────────────── */
const LOGO_SRC = '/client-logo.png';
const BG_SRC = '/road-bg.png';

/** Offscreen art board. Everything below is authored in this pixel space. */
const CANVAS_W = 2048;
const CANVAS_H = 580;

const FONT = '"Bebas Neue Local", "Helvetica Neue Local", Impact, sans-serif';

const C = {
  white: '#FFFFFF',
  soft: '#E2E2E2',
  green: '#3DFF6E',
  cyan: '#2FD2FF',
  gold: '#FFC61A',
  pink: '#FF4FA3',
  violet: '#C46BFF',
  orange: '#FF8A2B',
  rule: '#3A3A3A',
};

/* ─── Scroll speed tracker ───────────────────────────────────────────── */
const scrollState = { speed: 0, targetSpeed: 0 };

function useScrollSpeed() {
  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let rafId: number;

    const tick = () => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      const dy = Math.abs(window.scrollY - lastY);

      scrollState.targetSpeed = (dy / dt) * 180;
      scrollState.speed += (scrollState.targetSpeed - scrollState.speed) * 0.2;

      lastY = window.scrollY;
      lastTime = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
}

/* ─── Viewport ──────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 768) {
  const ref = useRef(typeof window !== 'undefined' && window.innerWidth <= breakpoint);
  const [, force] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => {
      if (mq.matches !== ref.current) {
        ref.current = mq.matches;
        force();
      }
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return ref.current;
}

/* ─── Marquee wrap ────────────────────────────────────────────────────
   The strip is `count` slots long but only a few are on screen. Mapping
   the tail slot to negative x lets an item leave on the right and re-enter
   from the left with its spacing intact — no gap at the loop point.
──────────────────────────────────────────────────────────────────────*/
function wrapSlot(base: number, stripW: number, slotW: number) {
  const raw = ((base % stripW) + stripW) % stripW;
  return raw > stripW - slotW ? raw - stripW : raw;
}

/* ─── Pre-process logo: clean white shape on transparent ─────────────── */
function createInvertedLogo(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, c.width, c.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const lit = 1.0 - lum / 255 > 0.25 ? 255 : 0;
    d[i] = lit;
    d[i + 1] = lit;
    d[i + 2] = lit;
    d[i + 3] = lit;
  }
  ctx.putImageData(imageData, 0, 0);
  return c;
}

/* ─── LED shader ──────────────────────────────────────────────────────
   The board art is never quantised into dots — the sign panel in the
   background plate already carries a physical dot texture, and screening
   the content on top of it just doubles the grid and smears everything.

   Instead a lamp grid rides over the art: full brightness on each dot,
   dimmed in the gaps between them. Coverage and alpha are untouched, so
   letterforms keep their shape and only pick up the LED texture.
──────────────────────────────────────────────────────────────────────*/
const LEDVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LEDFragmentShader = `
  uniform sampler2D uTex;
  uniform vec2 uResolution;
  uniform float uCell;
  uniform float uDotFill;
  uniform float uDepth;
  varying vec2 vUv;

  void main() {
    vec4 art = texture2D(uTex, vUv);
    if (art.a < 0.004) discard;   // empty board — let the panel plate show

    vec2 pixel = vUv * uResolution;
    vec2 cell = floor(pixel / uCell);
    vec2 center = (cell + 0.5) * uCell;
    float dist = length(pixel - center);

    float radius = uCell * uDotFill * 0.5;
    float lamp = 1.0 - smoothstep(radius - 1.0, radius + 0.8, dist);

    // Slight dome across each lamp, then dim the gutters between them.
    float dome = 1.0 - 0.16 * smoothstep(0.0, radius, dist);
    float grid = mix(1.0 - uDepth, dome, lamp);

    gl_FragColor = vec4(art.rgb * grid, art.a);
  }
`;

/* ─── Draw helpers ──────────────────────────────────────────────────── */
type Ctx = CanvasRenderingContext2D;

interface TextOpts {
  size: number;
  color: string;
  align?: CanvasTextAlign;
  track?: number;
  /** Hover emphasis only — sharp type needs no fattening. */
  fatten?: number;
}

function txt(ctx: Ctx, str: string, x: number, y: number, o: TextOpts) {
  ctx.save();
  ctx.font = `${o.size}px ${FONT}`;
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = o.color;
  if (o.track) ctx.letterSpacing = `${o.track}px`;
  ctx.fillText(str, x, y);
  if (o.fatten) {
    ctx.lineWidth = o.fatten;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = o.color;
    ctx.strokeText(str, x, y);
  }
  ctx.restore();
}

function dashedLine(ctx: Ctx, x1: number, y1: number, x2: number, y2: number, color = C.rule, w = 2) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.setLineDash([3, 9]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function dashedRect(ctx: Ctx, x: number, y: number, w: number, h: number, color = C.rule, lw = 2) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.setLineDash([3, 9]);
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

/* ─── Icons: stroked glyphs authored at unit size, centred on (0,0) ──── */
function icon(ctx: Ctx, name: string, cx: number, cy: number, size: number, color: string, boost = 1) {
  const s = size * boost;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 0.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  switch (name) {
    case 'shield':
      ctx.moveTo(0, -0.5);
      ctx.lineTo(0.4, -0.33);
      ctx.lineTo(0.4, 0.05);
      ctx.quadraticCurveTo(0.4, 0.36, 0, 0.5);
      ctx.quadraticCurveTo(-0.4, 0.36, -0.4, 0.05);
      ctx.lineTo(-0.4, -0.33);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.18, 0.0);
      ctx.lineTo(-0.04, 0.16);
      ctx.lineTo(0.22, -0.16);
      ctx.stroke();
      break;

    case 'lock':
      ctx.moveTo(-0.24, -0.06);
      ctx.lineTo(-0.24, -0.24);
      ctx.arc(0, -0.24, 0.24, Math.PI, 0);
      ctx.lineTo(0.24, -0.06);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-0.4, -0.06, 0.8, 0.52);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0.2, 0.08, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'check':
      ctx.arc(0, 0, 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.21, 0.02);
      ctx.lineTo(-0.05, 0.19);
      ctx.lineTo(0.24, -0.19);
      ctx.stroke();
      break;

    case 'smile':
      ctx.arc(0, 0, 0.47, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-0.18, -0.14, 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0.18, -0.14, 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0.02, 0.27, 0.22 * Math.PI, 0.78 * Math.PI);
      ctx.stroke();
      break;

    case 'user':
      ctx.arc(0, -0.2, 0.21, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.37, 0.48);
      ctx.quadraticCurveTo(-0.37, 0.1, 0, 0.1);
      ctx.quadraticCurveTo(0.37, 0.1, 0.37, 0.48);
      ctx.stroke();
      break;

    case 'star': {
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 0.5 : 0.22;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }

    case 'heart':
      ctx.moveTo(0, 0.44);
      ctx.bezierCurveTo(-0.56, 0.08, -0.4, -0.44, -0.13, -0.27);
      ctx.bezierCurveTo(-0.05, -0.22, -0.02, -0.14, 0, -0.09);
      ctx.bezierCurveTo(0.02, -0.14, 0.05, -0.22, 0.13, -0.27);
      ctx.bezierCurveTo(0.4, -0.44, 0.56, 0.08, 0, 0.44);
      ctx.stroke();
      break;

    case 'phone':
      ctx.moveTo(-0.34, -0.36);
      ctx.quadraticCurveTo(-0.18, -0.44, -0.08, -0.24);
      ctx.quadraticCurveTo(0.0, -0.08, -0.14, 0.0);
      ctx.quadraticCurveTo(-0.02, 0.22, 0.16, 0.3);
      ctx.quadraticCurveTo(0.24, 0.16, 0.4, 0.24);
      ctx.quadraticCurveTo(0.5, 0.34, 0.4, 0.44);
      ctx.quadraticCurveTo(0.1, 0.58, -0.2, 0.2);
      ctx.quadraticCurveTo(-0.46, -0.14, -0.34, -0.36);
      ctx.stroke();
      break;

    case 'bars':
      for (let i = 0; i < 4; i++) {
        const bh = 0.2 + i * 0.2;
        ctx.rect(-0.44 + i * 0.24, 0.44 - bh, 0.14, bh);
      }
      ctx.fill();
      break;

    case 'globe':
      ctx.arc(0, 0, 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, 0.21, 0.46, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.43, -0.15);
      ctx.lineTo(0.43, -0.15);
      ctx.moveTo(-0.43, 0.15);
      ctx.lineTo(0.43, 0.15);
      ctx.stroke();
      break;

    case 'rocket':
      ctx.moveTo(0, -0.5);
      ctx.quadraticCurveTo(0.27, -0.16, 0.22, 0.2);
      ctx.lineTo(-0.22, 0.2);
      ctx.quadraticCurveTo(-0.27, -0.16, 0, -0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.22, 0.06);
      ctx.lineTo(-0.44, 0.34);
      ctx.lineTo(-0.16, 0.27);
      ctx.moveTo(0.22, 0.06);
      ctx.lineTo(0.44, 0.34);
      ctx.lineTo(0.16, 0.27);
      ctx.stroke();
      break;

    case 'thumb':
      ctx.rect(-0.46, -0.02, 0.2, 0.44);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.18, 0.42);
      ctx.lineTo(0.28, 0.42);
      ctx.quadraticCurveTo(0.44, 0.42, 0.44, 0.24);
      ctx.quadraticCurveTo(0.44, 0.06, 0.28, 0.06);
      ctx.lineTo(0.02, 0.06);
      ctx.quadraticCurveTo(0.12, -0.2, 0.02, -0.42);
      ctx.quadraticCurveTo(-0.14, -0.5, -0.18, -0.24);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'hexagon':
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = Math.cos(a) * 0.46;
        const py = Math.sin(a) * 0.46;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 0.18, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'pivot':
      ctx.arc(0, 0, 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 0.24, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'nexus':
      ctx.rect(-0.4, -0.4, 0.8, 0.8);
      ctx.moveTo(-0.4, -0.4);
      ctx.lineTo(0.4, 0.4);
      ctx.moveTo(0.4, -0.4);
      ctx.lineTo(-0.4, 0.4);
      ctx.stroke();
      break;

    case 'vortex':
      ctx.arc(0, 0, 0.46, 0.4, Math.PI * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 0.24, 1.4, Math.PI * 2.4);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

/* ─── Layout ────────────────────────────────────────────────────────── */
const PAD = 46;
const HEADER_H = 150;
const MID_TOP = 168;
const MARQ_H = 190;
const FEAT_TOP = 370;
const BAR_TOP = 492;
const LEFT_R = 1568;            // right edge of the marquee + feature column
const COL_X = 1614;             // left edge of the KPI column
const COL_R = CANVAS_W - PAD;
const COL_DIV = 1592;

const TICK_DIV = [330, 630, 1400, 1740];

/* Where the sign sits inside road-bg.png, as a fraction of the image.
   Shared by the leva mapping defaults and the mobile crop below. */
const MAP = { displayW: 0.82, displayH: 0.40, offsetX: 0.52, offsetY: 0.49 };
const BG_ASPECT = 1458 / 820;   // the plate is 16:9, so it fills a 16:9 viewport exactly

/* Mobile: a 16:9 plate in a portrait viewport would crop away most of the
   sign, so instead the plate is zoomed until the board spans the width and
   parked at the middle of the screen. */
const M_ZOOM = 1.3;
const M_WRAP_W = M_ZOOM * 100;                 // vw
const M_WRAP_H = M_WRAP_W / BG_ASPECT;         // vw
const M_WRAP_LEFT = 50 - MAP.offsetX * M_WRAP_W;
const M_SIGN_CY = MAP.offsetY * M_WRAP_H;      // vw, from the plate's top edge

/* ─── Scroll choreography ─────────────────────────────────────────────
   Two scroll-downs while the board is pinned: each one kicks the marquee,
   the second one takes the screen out. Home drives the same states through
   `scrollProgress`; standalone the section counts the gestures itself.
──────────────────────────────────────────────────────────────────────*/
const SCROLL_STEPS = 2;
const STEP_THRESHOLD = 150;    // wheel/touch delta that counts as one scroll
const STEP_COOLDOWN = 600;     // ms, so one flick cannot spend both steps
const FADE_MS = 900;

/** Marquee kick, decaying in the draw loop. Exported so Home can trigger it. */
const marqueeBoost = { value: 0 };

export function pulseClientsMarquee(amount = 1) {
  marqueeBoost.value = Math.min(3, marqueeBoost.value + amount);
}

interface HitRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const brands = [
  { name: 'ACME CORP', color: C.white, shape: 'logo' },
  { name: 'HEXAGON', color: C.cyan, shape: 'hexagon' },
  { name: 'PIVOTLABS', color: C.gold, shape: 'pivot' },
  { name: 'WAVEFLOW', color: C.violet, shape: 'wave' },
  { name: 'NEXUS AI', color: C.green, shape: 'nexus' },
  { name: 'VORTEX', color: C.pink, shape: 'vortex' },
];

const badges = [
  { icon: 'check', color: C.green, l1: 'FOUNDER', l2: 'LED', c2: C.white },
  { icon: 'user', color: C.cyan, l1: 'SMALL TEAM', l2: 'BIG CARE', c2: C.white },
  { icon: 'star', color: C.gold, l1: 'CRAFT OVER', l2: 'CHECKLISTS', c2: C.white },
  { icon: 'smile', color: C.pink, l1: 'REPLIES IN', l2: 'HOURS', c2: C.pink },
];

const features = [
  { icon: 'rocket', color: C.green, title: 'WE SHIP IT', l1: 'LAUNCHED, NOT', l2: 'LEFT IN A DECK' },
  { icon: 'user', color: C.cyan, title: 'FEW CLIENTS', l1: 'SO YOURS GETS', l2: 'ALL OF US' },
  { icon: 'star', color: C.gold, title: 'IDEAS FIRST', l1: 'STRATEGY BEFORE', l2: 'DECORATION' },
  { icon: 'heart', color: C.pink, title: 'MADE TO BE FELT', l1: 'WORK THAT MOVES', l2: 'PEOPLE, NOT KPIS' },
];

const ticker = [
  { icon: 'bars', color: C.green, l1: 'FIRST DRAFTS', l2: 'IN 5 DAYS', c2: C.white, x: 60, w: 250 },
  { icon: 'globe', color: C.cyan, l1: '3 TIMEZONES', l2: 'ONE STUDIO', c2: C.cyan, x: 360, w: 240 },
  { icon: 'rocket', color: C.violet, l1: 'NO QUEUE', l2: 'WE START MONDAY', c2: C.violet, x: 1430, w: 290 },
  { icon: 'thumb', color: C.orange, l1: 'WORTH', l2: 'SHOWING OFF', c2: C.orange, x: 1770, w: 250 },
];

/* ─── Offscreen art boards ──────────────────────────────────────────── */
/** Board pixels per authored unit. Matched to the sign's on-screen device
 *  pixels: oversampling past that only trades sharpness for shimmer, since
 *  the boards carry no mipmaps. Coordinates always stay in CANVAS_W/H space. */
const SS = (() => {
  if (typeof window === 'undefined') return 1;
  const signDevicePx = window.innerWidth * (window.devicePixelRatio || 1) * 0.8;
  return Math.min(2, Math.max(1, signDevicePx / CANVAS_W));
})();

function makeBoard() {
  const c = document.createElement('canvas');
  c.width = Math.round(CANVAS_W * SS);
  c.height = Math.round(CANVAS_H * SS);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return { canvas: c, ctx: c.getContext('2d')!, tex };
}

function useLEDCanvas() {
  const boardRef = useRef<ReturnType<typeof makeBoard> | null>(null);

  const logoRef = useRef<HTMLCanvasElement | null>(null);
  const fontsReady = useRef(false);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const hitsRef = useRef<HitRect[]>([]);

  if (!boardRef.current) {
    boardRef.current = makeBoard();
  }

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoRef.current = createInvertedLogo(img);
    };
    img.src = LOGO_SRC;

    // Canvas text needs the face actually loaded, not merely declared in CSS.
    Promise.all([
      document.fonts.load(`58px ${FONT}`),
      document.fonts.load(`30px ${FONT}`),
    ])
      .catch(() => undefined)
      .then(() => {
        fontsReady.current = true;
      });
  }, []);

  const update = useCallback((time: number, hovered: string | null, isMobile: boolean) => {
    const board = boardRef.current;
    if (!board || !fontsReady.current) return;

    // One board now that nothing is quantised. Kept as two names so each call
    // site still says whether it is laying down artwork or type.
    const g = board.ctx;
    const s = board.ctx;

    const dt = lastTimeRef.current === 0 ? 0.016 : Math.min(time - lastTimeRef.current, 0.1);
    lastTimeRef.current = time;

    marqueeBoost.value *= Math.exp(-dt * 1.1);
    const speed = 100 + marqueeBoost.value * 1400 + Math.min(scrollState.speed * 8.0, 620);
    offsetRef.current += speed * dt;

    const hits: HitRect[] = [];

    g.setTransform(SS, 0, 0, SS, 0, 0);
    s.setTransform(SS, 0, 0, SS, 0, 0);
    g.clearRect(0, 0, CANVAS_W, CANVAS_H);
    s.clearRect(0, 0, CANVAS_W, CANVAS_H);

    /* ── MOBILE: headline + logo marquee only, at double the scale ──── */
    if (isMobile) {
      const midX = CANVAS_W / 2;

      txt(s, 'TRUSTED BY BRANDS', midX, 116, { size: 104, color: C.white, align: 'center', track: 2 });
      txt(s, 'THAT REFUSE TO SETTLE', midX, 232, { size: 104, color: C.green, align: 'center', track: 2 });

      dashedLine(s, PAD, 272, COL_R, 272, '#2E2E2E', 3);

      const mTop = 296;
      const mH = CANVAS_H - mTop - 24;
      dashedRect(s, PAD, mTop, COL_R - PAD, mH, C.rule, 3);

      const mSlotW = (COL_R - PAD) / 3;
      const mStripW = brands.length * mSlotW;
      // Icon band and label band are kept apart explicitly: the logo art is
      // square, so its box reaches well past the drawn shape.
      const mIconCy = mTop + 92;
      const mNameBase = mTop + 218;

      s.save();
      s.beginPath();
      s.rect(PAD + 2, mTop + 2, COL_R - PAD - 4, mH - 4);
      s.clip();

      for (let i = 0; i < brands.length; i++) {
        const b = brands[i];
        const slotX = PAD + wrapSlot(i * mSlotW + offsetRef.current, mStripW, mSlotW);
        const hot = hovered === `brand-${i}`;
        const color = hot ? C.white : b.color;
        const cx = slotX + mSlotW * 0.5;
        const scale = hot ? 1.08 : 1;

        dashedLine(s, slotX + mSlotW, mTop + 18, slotX + mSlotW, mTop + mH - 18, '#333333');

        if (b.shape === 'logo' && logoRef.current) {
          const sz = 126 * scale;
          g.drawImage(logoRef.current, cx - sz / 2, mIconCy - sz / 2, sz, sz);
        } else if (b.shape === 'wave') {
          txt(g, 'W', cx, mIconCy + 44, { size: 126 * scale, color, align: 'center' });
        } else {
          icon(g, b.shape, cx, mIconCy, 116 * scale, color);
        }

        txt(s, b.name, cx, mNameBase, { size: 54, color, align: 'center', track: 1.5 });

        if (slotX < COL_R && slotX + mSlotW > PAD) {
          hits.push({ id: `brand-${i}`, x: slotX, y: mTop, w: mSlotW, h: mH });
        }
      }

      s.restore();

      hitsRef.current = hits;
      board.tex.needsUpdate = true;
      return;
    }

    /* ── 1. HEADER ─────────────────────────────────────────────────── */
    txt(s, 'TRUSTED BY BRANDS', PAD + 4, 74, { size: 60, color: C.white, track: 1 });
    txt(s, 'THAT REFUSE TO SETTLE', PAD + 4, 132, { size: 60, color: C.green, track: 1 });

    const badgeX0 = 960;
    const badgeW = (COL_R - badgeX0) / badges.length;
    badges.forEach((b, i) => {
      const bx = badgeX0 + i * badgeW;
      if (i > 0) dashedLine(s, bx - 16, 34, bx - 16, HEADER_H - 34);

      const hot = hovered === `badge-${i}`;
      icon(g, b.icon, bx + 36, 76, 66, hot ? C.white : b.color, hot ? 1.1 : 1);
      txt(s, b.l1, bx + 82, 68, { size: 32, color: hot ? C.white : b.color, track: 0.5 });
      txt(s, b.l2, bx + 82, 108, { size: 32, color: hot ? C.white : b.c2, track: 0.5 });

      hits.push({ id: `badge-${i}`, x: bx - 12, y: 28, w: badgeW - 8, h: HEADER_H - 56 });
    });

    dashedLine(s, PAD, HEADER_H, COL_R, HEADER_H, '#2E2E2E');

    /* ── 2. BRAND MARQUEE ──────────────────────────────────────────── */
    dashedRect(s, PAD, MID_TOP, LEFT_R - PAD, MARQ_H);

    const slotW = (LEFT_R - PAD) / 4;
    const stripW = brands.length * slotW;
    const iconCy = MID_TOP + 72;
    const nameBase = MID_TOP + 168;

    s.save();
    s.beginPath();
    s.rect(PAD + 2, MID_TOP + 2, LEFT_R - PAD - 4, MARQ_H - 4);
    s.clip();

    for (let i = 0; i < brands.length; i++) {
      const b = brands[i];
      const slotX = PAD + wrapSlot(i * slotW + offsetRef.current, stripW, slotW);
      const hot = hovered === `brand-${i}`;
      const color = hot ? C.white : b.color;

      dashedLine(s, slotX + slotW, MID_TOP + 14, slotX + slotW, MID_TOP + MARQ_H - 14, '#333333');

      const cx = slotX + slotW * 0.5;
      const scale = hot ? 1.1 : 1;

      if (b.shape === 'logo' && logoRef.current) {
        const sz = 102 * scale;
        g.drawImage(logoRef.current, cx - sz / 2, iconCy - sz / 2, sz, sz);
      } else if (b.shape === 'wave') {
        txt(g, 'W', cx, iconCy + 36, { size: 104 * scale, color, align: 'center' });
      } else {
        icon(g, b.shape, cx, iconCy, 94 * scale, color);
      }

      txt(s, b.name, cx, nameBase, { size: 40, color, align: 'center', track: 1.5, fatten: hot ? 1.2 : 0 });

      // Only the on-screen part of a wrapping slot is hoverable.
      if (slotX < LEFT_R && slotX + slotW > PAD) {
        hits.push({ id: `brand-${i}`, x: slotX, y: MID_TOP, w: slotW, h: MARQ_H });
      }
    }
    s.restore();

    /* ── 3. FEATURE CARDS ──────────────────────────────────────────── */
    const featW = (LEFT_R - PAD) / features.length;
    features.forEach((f, i) => {
      const fx = PAD + i * featW;
      if (i > 0) dashedLine(s, fx - 12, FEAT_TOP + 4, fx - 12, BAR_TOP - 30, '#333333');

      const hot = hovered === `feat-${i}`;
      icon(g, f.icon, fx + 46, FEAT_TOP + 42, 74, hot ? C.white : f.color, hot ? 1.1 : 1);
      txt(s, f.title, fx + 98, FEAT_TOP + 26, { size: 36, color: hot ? C.white : f.color, track: 0.5, fatten: hot ? 1.2 : 0 });
      txt(s, f.l1, fx + 98, FEAT_TOP + 58, { size: 29, color: hot ? C.white : C.soft, track: 0.5 });
      txt(s, f.l2, fx + 98, FEAT_TOP + 88, { size: 29, color: hot ? C.white : C.soft, track: 0.5 });

      hits.push({ id: `feat-${i}`, x: fx - 8, y: FEAT_TOP - 6, w: featW - 8, h: BAR_TOP - FEAT_TOP - 24 });
    });

    /* ── 4. RIGHT KPI COLUMN ───────────────────────────────────────── */
    dashedLine(s, COL_DIV, MID_TOP - 6, COL_DIV, BAR_TOP - 30, '#333333');

    const kpiHot = hovered === 'kpi';
    icon(g, 'smile', COL_X + 44, 196, 80, kpiHot ? C.white : C.gold, kpiHot ? 1.08 : 1);
    txt(s, 'REPEAT CLIENTS', COL_X + 100, 196, { size: 32, color: kpiHot ? C.white : C.gold, track: 0.5 });
    txt(g, '100%', COL_R, 272, { size: 96, color: kpiHot ? C.white : C.gold, align: 'right' });
    txt(s, 'CAME BACK FOR MORE', COL_R, 306, { size: 32, color: C.white, align: 'right', track: 0.5 });
    hits.push({ id: 'kpi', x: COL_DIV + 10, y: MID_TOP - 4, w: COL_R - COL_DIV, h: 148 });

    dashedLine(s, COL_DIV + 14, 320, COL_R, 320, '#333333');

    txt(s, 'SMALL STUDIO', COL_R, 352, { size: 32, color: C.violet, align: 'right', track: 0.5 });
    txt(s, 'OUTSIZED IDEAS', COL_R, 384, { size: 32, color: C.violet, align: 'right', track: 0.5 });

    dashedLine(s, COL_DIV + 14, 400, COL_R, 400, '#333333');

    const supHot = hovered === 'support';
    icon(g, 'phone', COL_X + 34, 442, 56, supHot ? C.white : C.green, supHot ? 1.1 : 1);
    txt(s, 'DIRECT LINE', COL_R, 434, { size: 32, color: supHot ? C.white : C.green, align: 'right', track: 0.5 });
    txt(s, 'TO THE MAKERS', COL_R, 466, { size: 32, color: C.white, align: 'right', track: 0.5 });
    hits.push({ id: 'support', x: COL_DIV + 10, y: 408, w: COL_R - COL_DIV, h: 70 });

    /* ── 5. BOTTOM TICKER ──────────────────────────────────────────── */
    dashedLine(s, PAD, BAR_TOP - 16, COL_R, BAR_TOP - 16, '#2E2E2E');

    ticker.forEach((t, i) => {
      const hot = hovered === `tick-${i}`;
      icon(g, t.icon, t.x + 24, BAR_TOP + 42, 58, hot ? C.white : t.color, hot ? 1.1 : 1);
      txt(s, t.l1, t.x + 66, BAR_TOP + 30, { size: 32, color: hot ? C.white : t.color, track: 0.5 });
      txt(s, t.l2, t.x + 66, BAR_TOP + 66, { size: 32, color: hot ? C.white : t.c2, track: 0.5 });

      hits.push({ id: `tick-${i}`, x: t.x - 10, y: BAR_TOP, w: t.w, h: 82 });
    });

    TICK_DIV.forEach((dx) => dashedLine(s, dx, BAR_TOP + 4, dx, CANVAS_H - 16, '#333333'));

    const midX = (TICK_DIV[1] + TICK_DIV[2]) / 2;
    txt(s, 'THINK • MAKE • MOVE', midX, BAR_TOP + 30, { size: 34, color: C.white, align: 'center', track: 1 });
    txt(s, 'SMALL TEAM. LOUD RESULTS.', midX, BAR_TOP + 66, { size: 34, color: C.green, align: 'center', track: 1 });

    hitsRef.current = hits;

    board.tex.needsUpdate = true;
  }, []);

  return { texture: boardRef.current.tex, update, hitsRef };
}

/* ─── LED display mesh ──────────────────────────────────────────────── */
interface LEDDisplayProps {
  displayW: number;
  displayH: number;
  offsetX: number;
  offsetY: number;
  pitch: number;
  dotFill: number;
  depth: number;
  isMobile: boolean;
}

function LEDDisplay({ displayW, displayH, offsetX, offsetY, pitch, dotFill, depth, isMobile }: LEDDisplayProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { texture, update, hitsRef } = useLEDCanvas();
  const { viewport } = useThree();
  const hoveredRef = useRef<string | null>(null);

  const w = viewport.width * displayW;
  const h = viewport.height * displayH;
  const x = viewport.width * (offsetX - 0.5);
  const y = viewport.height * (0.5 - offsetY);

  const shaderData = useMemo(() => ({
    uniforms: {
      uTex: { value: texture },
      uResolution: { value: new THREE.Vector2(CANVAS_W, CANVAS_H) },
      uCell: { value: pitch },
      uDotFill: { value: dotFill },
      uDepth: { value: depth },
    },
    vertexShader: LEDVertexShader,
    fragmentShader: LEDFragmentShader,
    transparent: true,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [texture]);

  useFrame(({ clock }) => {
    update(clock.getElapsedTime(), hoveredRef.current, isMobile);
    const m = materialRef.current;
    if (!m) return;
    // Coarser grid on mobile: the sign is physically smaller, so the dots
    // have to grow with it to stay legible as dots.
    m.uniforms.uCell.value = pitch * (isMobile ? 1.7 : 1);
    m.uniforms.uDotFill.value = dotFill;
    m.uniforms.uDepth.value = depth;
    // Square cells in screen space, so dots stay round however the sign is mapped.
    m.uniforms.uResolution.value.set(CANVAS_W, (CANVAS_W * h) / w);
  });

  const handlePointerMove = (e: { uv?: THREE.Vector2 }) => {
    if (!e.uv) return;
    const px = e.uv.x * CANVAS_W;
    const py = (1 - e.uv.y) * CANVAS_H;

    let found: string | null = null;
    for (const r of hitsRef.current) {
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        found = r.id;
        break;
      }
    }
    if (found !== hoveredRef.current) {
      hoveredRef.current = found;
      document.body.style.cursor = found ? 'pointer' : 'auto';
    }
  };

  const handlePointerOut = () => {
    hoveredRef.current = null;
    document.body.style.cursor = 'auto';
  };

  useEffect(() => () => {
    document.body.style.cursor = 'auto';
  }, []);

  return (
    <mesh
      position={[x, y, 0]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[w, h]} />
      <shaderMaterial ref={materialRef} {...shaderData} transparent depthWrite={false} />
    </mesh>
  );
}

/* ─── Scene ─────────────────────────────────────────────────────────── */
function Scene({ isMobile }: { isMobile: boolean }) {
  const { displayW, displayH, offsetX, offsetY } = useControls('Sign Display Mapping', {
    displayW: { value: MAP.displayW, min: 0.1, max: 1.0, step: 0.01, label: 'Width %' },
    displayH: { value: MAP.displayH, min: 0.1, max: 1.0, step: 0.01, label: 'Height %' },
    offsetX: { value: MAP.offsetX, min: 0.0, max: 1.0, step: 0.005, label: 'Offset X' },
    offsetY: { value: MAP.offsetY, min: 0.0, max: 1.0, step: 0.005, label: 'Offset Y' },
  });

  const { pitch, dotFill, depth } = useControls('LED Grid', {
    pitch: { value: 9.0, min: 4, max: 18, step: 0.2, label: 'Dot Pitch' },
    dotFill: { value: 0.72, min: 0.3, max: 1.0, step: 0.02, label: 'Dot Size' },
    depth: { value: 0.45, min: 0.0, max: 0.9, step: 0.01, label: 'Dot Depth' },
  });

  return (
    <LEDDisplay
      displayW={displayW}
      displayH={displayH}
      offsetX={offsetX}
      offsetY={offsetY}
      pitch={pitch}
      dotFill={dotFill}
      depth={depth}
      isMobile={isMobile}
    />
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export interface ClientsPageProps {
  /** 0..1 from Home's scroll timeline. When supplied the section stops
   *  counting its own gestures and follows this instead. */
  scrollProgress?: number;
  /** Fires once the board has faded out, so Home can hand off to the next
   *  section (or the standalone route can release the scroll lock). */
  onComplete?: () => void;
  /** Home renders this inside its own sticky container; the standalone route
   *  pins itself. */
  pinned?: boolean;
}

export function ClientsPage({ scrollProgress, onComplete, pinned = true }: ClientsPageProps = {}) {
  useScrollSpeed();
  const isMobile = useIsMobile();

  const driven = scrollProgress !== undefined;
  const [step, setStep] = useState(0);
  const [faded, setFaded] = useState(false);
  const stepRef = useRef(0);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /* One place decides what a step means, whoever triggered it. */
  const advanceTo = useCallback((next: number) => {
    if (next <= stepRef.current || doneRef.current) return;
    stepRef.current = next;
    setStep(next);
    pulseClientsMarquee(next >= SCROLL_STEPS ? 1.6 : 1);

    if (next >= SCROLL_STEPS) {
      doneRef.current = true;
      // Let the last kick read before the board leaves.
      window.setTimeout(() => setFaded(true), 480);
      window.setTimeout(() => onCompleteRef.current?.(), 480 + FADE_MS);
    }
  }, []);

  /* Home-driven: the timeline picks the step and the fade. */
  useEffect(() => {
    if (!driven) return;
    const p = scrollProgress!;
    advanceTo(p >= 0.62 ? 2 : p >= 0.3 ? 1 : 0);
  }, [driven, scrollProgress, advanceTo]);

  /* Standalone: count scroll-downs against a pinned screen. */
  useEffect(() => {
    if (driven) return;

    let acc = 0;
    let lastStep = 0;

    const feed = (dy: number) => {
      if (doneRef.current) return;
      if (dy <= 0) {
        acc = Math.max(0, acc + dy);
        return;
      }
      acc += dy;
      const now = performance.now();
      if (acc >= STEP_THRESHOLD && now - lastStep > STEP_COOLDOWN) {
        acc = 0;
        lastStep = now;
        advanceTo(stepRef.current + 1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!doneRef.current) e.preventDefault();
      feed(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!doneRef.current) e.preventDefault();
      const y = e.touches[0].clientY;
      feed(touchY - y);
      touchY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (!doneRef.current) e.preventDefault();
        feed(STEP_THRESHOLD);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [driven, advanceTo]);

  /* Standalone: hand scrolling back once the board is gone. */
  useEffect(() => {
    if (driven || !faded) return;
    const id = window.setTimeout(() => {
      document.body.style.overflow = '';
    }, FADE_MS);
    return () => window.clearTimeout(id);
  }, [driven, faded]);

  return (
    <section
      data-clients-step={step}
      style={{
        position: pinned ? 'fixed' : 'relative',
        inset: pinned ? 0 : undefined,
        width: '100%',
        height: pinned ? '100vh' : '56.25vw',
        lineHeight: 0,
        overflow: 'hidden',
        background: '#000000',
        opacity: faded ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: faded ? 'none' : 'auto',
        zIndex: pinned ? 1 : undefined,
      }}
    >
      {/* Plate and WebGL overlay always share a box, so the sign mapping holds
          whether the plate is filling the viewport or zoomed for mobile. */}
      <div
        style={
          isMobile
            ? {
                position: 'absolute',
                width: `${M_WRAP_W}vw`,
                left: `${M_WRAP_LEFT}vw`,
                top: `calc(50% - ${M_SIGN_CY}vw)`,
              }
            : {
                // The cover box, sized explicitly rather than via object-fit:
                // the mesh is placed against this wrapper, so plate and LEDs
                // have to crop as one on viewports that are not 16:9.
                position: 'absolute',
                width: `max(100%, ${(100 * BG_ASPECT).toFixed(2)}vh)`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }
        }
      >
        <img
          src={BG_SRC}
          alt="Road signboard"
          draggable={false}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
          <Canvas
            orthographic
            camera={{ zoom: 1, position: [0, 0, 100], near: 0.1, far: 1000 }}
            gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
            style={{ background: 'transparent' }}
            resize={{ debounce: 0 }}
          >
            <Scene isMobile={isMobile} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
