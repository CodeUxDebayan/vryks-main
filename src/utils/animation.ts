// ─── VRYKS Animation Utilities ───────────────────────────────────────────────

import { lerp, clamp } from './math';

/** Smoothed mouse state shared across components */
export interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  previousX: number;
  previousY: number;
}

export const createMouseState = (): MouseState => ({
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  velocityX: 0,
  velocityY: 0,
  previousX: 0,
  previousY: 0,
});

/** Update smoothed mouse position */
export const updateMouse = (state: MouseState, factor = 0.08): void => {
  state.previousX = state.x;
  state.previousY = state.y;
  state.x = lerp(state.x, state.targetX, factor);
  state.y = lerp(state.y, state.targetY, factor);
  state.velocityX = state.x - state.previousX;
  state.velocityY = state.y - state.previousY;
};

/** Get total mouse velocity magnitude */
export const getMouseVelocity = (state: MouseState): number =>
  Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);

/** Stagger delay calculator */
export const staggerDelay = (index: number, base = 0.1, multiplier = 0.08): number =>
  base + index * multiplier;

/** Build a CSS cubic-bezier string */
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number): string =>
  `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

/** VRYKS standard easing presets */
export const ease = {
  /** Smooth, physical deceleration */
  out: cubicBezier(0.16, 1, 0.3, 1),
  /** Slight anticipation then fast deceleration */
  inOut: cubicBezier(0.76, 0, 0.24, 1),
  /** Spring-like overshoot */
  spring: cubicBezier(0.34, 1.56, 0.64, 1),
  /** Linear */
  linear: 'linear',
};

/** Generate a noise-like value using time */
export const noise1D = (x: number): number =>
  Math.sin(x * 127.1) * Math.cos(x * 311.7) * 0.5 + 0.5;

/** Apply spring to a value */
export const applySpring = (
  current: number,
  target: number,
  velocity: { value: number },
  stiffness = 0.1,
  damping = 0.8
): number => {
  const force = (target - current) * stiffness;
  velocity.value = velocity.value * damping + force;
  return current + velocity.value;
};

/** Clamp scroll velocity for distortion */
export const distortionFromVelocity = (
  velocity: number,
  maxDistortion = 30
): number => clamp(Math.abs(velocity) * 0.5, 0, maxDistortion);

/** Create CSS transform string from object */
export const buildTransform = (opts: {
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  skewX?: number;
  skewY?: number;
}): string => {
  const parts: string[] = [];
  if (opts.translateX !== undefined) parts.push(`translateX(${opts.translateX}px)`);
  if (opts.translateY !== undefined) parts.push(`translateY(${opts.translateY}px)`);
  if (opts.translateZ !== undefined) parts.push(`translateZ(${opts.translateZ}px)`);
  if (opts.rotateX !== undefined) parts.push(`rotateX(${opts.rotateX}deg)`);
  if (opts.rotateY !== undefined) parts.push(`rotateY(${opts.rotateY}deg)`);
  if (opts.rotateZ !== undefined) parts.push(`rotateZ(${opts.rotateZ}deg)`);
  if (opts.scale !== undefined) parts.push(`scale(${opts.scale})`);
  if (opts.skewX !== undefined) parts.push(`skewX(${opts.skewX}deg)`);
  if (opts.skewY !== undefined) parts.push(`skewY(${opts.skewY}deg)`);
  return parts.join(' ');
};
