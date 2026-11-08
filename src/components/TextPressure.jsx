// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  isAnimating = true,
  minFontSize = 24
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    // Only update sizes if we are active/animating, to prevent scaling bugs when docked.
    if (!isAnimating) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale, isAnimating]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    if (!isAnimating) return; // Stop animation loop when not active

    let rafId;
    let idleFrames = 0;
    // Last values written per character, so a frame that resolves to the same
    // numbers touches no styles at all.
    const prev = [];

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const cursor = cursorRef.current;
      const smoothed = mouseRef.current;
      const dx = cursor.x - smoothed.x;
      const dy = cursor.y - smoothed.y;

      // Once the eased point has caught up to the cursor the field is static,
      // so skip the whole pass — including the layout read — until it moves.
      if (Math.abs(dx) < 0.08 && Math.abs(dy) < 0.08) {
        if (idleFrames > 2) return;
        idleFrames += 1;
      } else {
        idleFrames = 0;
      }

      smoothed.x += dx / 15;
      smoothed.y += dy / 15;

      const title = titleRef.current;
      if (!title) return;

      const spans = spansRef.current;

      /* ── Read phase ──────────────────────────────────────────────────
         Every measurement happens before any mutation. Interleaving them
         made each write invalidate layout and each following read force a
         synchronous reflow — one full text re-shape per character, per
         frame. Batched, the browser lays out once per frame. */
      const titleRect = title.getBoundingClientRect();
      const maxDist = titleRect.width / 2;

      const centers = [];
      for (let i = 0; i < spans.length; i += 1) {
        const span = spans[i];
        if (!span) {
          centers.push(null);
          continue;
        }
        const rect = span.getBoundingClientRect();
        centers.push({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
      }

      /* ── Write phase ─────────────────────────────────────────────── */
      for (let i = 0; i < spans.length; i += 1) {
        const span = spans[i];
        const center = centers[i];
        if (!span || !center) continue;

        const d = dist(smoothed, center);

        const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
        const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
        const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0';
        const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : '1';

        const last = prev[i];
        if (!last || last.wdth !== wdth || last.wght !== wght || last.italVal !== italVal) {
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        }
        if (alpha && (!last || last.alphaVal !== alphaVal)) {
          span.style.opacity = alphaVal;
        }

        prev[i] = { wdth, wght, italVal, alphaVal };
      }
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, isAnimating]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        @import url('${fontUrl}');

        .flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
          text-shadow: 0 8px 30px rgba(0, 0, 0, 0.85);
        }
      `}</style>
    );
  }, [fontFamily, fontUrl, textColor, strokeColor]);

  const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
          // Keeps the per-frame re-shaping from invalidating the rest of the page
          contain: 'layout style'
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor,
              fontVariationSettings: `'wght' 700, 'wdth' 90, 'ital' 0`
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
