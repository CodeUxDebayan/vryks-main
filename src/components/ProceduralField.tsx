import { useEffect, useRef } from 'react';

interface ProceduralFieldProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

export function ProceduralField({ mouseX, mouseY, scrollY }: ProceduralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Internal smoothed values
  const smooth = useRef({ mx: 0, my: 0, rot: 0, scale: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const s = smooth.current;

      // Smooth mouse
      s.mx += (mouseX - s.mx) * 0.04;
      s.my += (mouseY - s.my) * 0.04;

      const nx = (s.mx / w) * 2 - 1; // -1 to 1
      const ny = (s.my / h) * 2 - 1;

      const scrollInfluence = scrollY * 0.0005;
      s.rot += (nx * 0.018 - s.rot) * 0.05;

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.translate(cx + nx * 18, cy + ny * 12 - scrollY * 0.08);
      ctx.rotate(s.rot + scrollInfluence);

      // ── Outer orbital ring (faint)
      const outerR = Math.min(w, h) * 0.38;
      ctx.beginPath();
      ctx.arc(0, 0, outerR + ny * 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(109,53,255,0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // ── Second ring with dashes
      ctx.save();
      ctx.rotate(s.rot * 0.5);
      ctx.beginPath();
      ctx.setLineDash([4, 24]);
      ctx.arc(0, 0, outerR * 0.74, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 255, 0,0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── Inner ellipse (tilted)
      ctx.save();
      ctx.rotate(Math.PI / 4 + s.rot * 0.3);
      ctx.scale(1, 0.55);
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(155,92,255,0.07)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();

      // ── Radial tick marks
      const ticks = 36;
      for (let i = 0; i < ticks; i++) {
        const angle = (i / ticks) * Math.PI * 2;
        const r1 = outerR - 6;
        const r2 = outerR + (i % 3 === 0 ? 14 : 6);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.strokeStyle =
          i % 9 === 0
            ? 'rgba(234, 255, 0,0.25)'
            : 'rgba(245,245,240,0.04)';
        ctx.lineWidth = i % 9 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      // ── Small data nodes on the outer ring
      const nodes = 8;
      for (let i = 0; i < nodes; i++) {
        const angle = (i / nodes) * Math.PI * 2 + s.rot * 0.4;
        const x = Math.cos(angle) * outerR;
        const y = Math.sin(angle) * outerR;
        ctx.beginPath();
        ctx.arc(x, y, i === 0 ? 3 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#eaff00' : 'rgba(245,245,240,0.25)';
        ctx.fill();

        // Crosshair on first node
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x - 8, y);
          ctx.lineTo(x + 8, y);
          ctx.moveTo(x, y - 8);
          ctx.lineTo(x, y + 8);
          ctx.strokeStyle = 'rgba(234, 255, 0,0.4)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // ── Inner nodes cluster
      const innerNodes = 5;
      const innerR = outerR * 0.28;
      for (let i = 0; i < innerNodes; i++) {
        const angle = (i / innerNodes) * Math.PI * 2 - s.rot * 0.8;
        const x = Math.cos(angle) * innerR;
        const y = Math.sin(angle) * innerR;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(109,53,255,0.5)';
        ctx.fill();
      }

      // ── Fragmented arc segments
      const segments = 6;
      for (let i = 0; i < segments; i++) {
        const startAngle = (i / segments) * Math.PI * 2 + s.rot * 0.15;
        const length = Math.PI / 12;
        ctx.beginPath();
        ctx.arc(0, 0, outerR * 0.88, startAngle, startAngle + length);
        ctx.strokeStyle = 'rgba(109,53,255,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // ── Floating coordinate labels (fixed positions, slight parallax)
      const labels = [
        { x: w * 0.08, y: h * 0.78, text: '22°34\' N' },
        { x: w * 0.08, y: h * 0.82, text: '88°22\' E' },
        { x: w * 0.85, y: h * 0.2, text: 'FIELD / ACTIVE' },
        { x: w * 0.86, y: h * 0.85, text: 'SYS / 001' },
      ];

      ctx.font = '700 8px "Space Mono", monospace';
      labels.forEach(({ x, y, text }) => {
        ctx.fillStyle = 'rgba(245,245,240,0.12)';
        ctx.letterSpacing = '0.18em';
        ctx.fillText(text, x + nx * 6, y + ny * 4);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mouseX, mouseY, scrollY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    />
  );
}

