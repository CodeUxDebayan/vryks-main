// ─── VRYKS Mathematical Motion System ───────────────────────────────────────

/** Linear interpolation */
export const lerp = (current: number, target: number, factor: number): number =>
  current + (target - current) * factor;

/** Clamp a value between min and max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/** Map a value from one range to another */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const ratio = (value - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
};

/** Euclidean distance between two points */
export const distance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

/** Normalize a value to [0, 1] range */
export const normalize = (value: number, min: number, max: number): number =>
  clamp((value - min) / (max - min), 0, 1);

/** Calculate scroll progress as [0, 1] */
export const scrollProgress = (): number => {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 0;
};

/** Convert mouse position to normalized coordinates [-1, 1] */
export const normalizeMousePosition = (
  x: number,
  y: number,
  width: number,
  height: number
): { nx: number; ny: number } => ({
  nx: (x / width) * 2 - 1,
  ny: (y / height) * 2 - 1,
});

/** Smooth damp — more physically accurate than lerp */
export const smoothDamp = (
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  deltaTime: number,
  maxSpeed = Infinity
): number => {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const originalTo = target;
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  const _target = current - change;
  const temp = (velocity.value + omega * change) * deltaTime;
  velocity.value = (velocity.value - omega * temp) * exp;
  let output = _target + (change + temp) * exp;
  if (originalTo - current > 0 === output > originalTo) {
    output = originalTo;
    velocity.value = (output - originalTo) / deltaTime;
  }
  return output;
};

/** Calculate angle between two points in radians */
export const angleBetween = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.atan2(y2 - y1, x2 - x1);

/** Convert degrees to radians */
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;

/** Convert radians to degrees */
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

/** Generate a point on a circle */
export const pointOnCircle = (
  cx: number,
  cy: number,
  radius: number,
  angle: number
): { x: number; y: number } => ({
  x: cx + radius * Math.cos(angle),
  y: cy + radius * Math.sin(angle),
});

/** Ease in-out cubic */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Ease out expo */
export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
