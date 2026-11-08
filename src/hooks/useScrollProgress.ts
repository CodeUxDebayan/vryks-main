import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const onScroll = () => {
      const currentY = window.scrollY;
      const currentTime = performance.now();
      const dt = currentTime - lastTime || 16;
      const v = (currentY - lastScrollY) / dt * 16;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(maxScroll > 0 ? currentY / maxScroll : 0);
      setScrollY(currentY);
      setVelocity(v);

      lastScrollY = currentY;
      lastTime = currentTime;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { progress, scrollY, velocity };
}
