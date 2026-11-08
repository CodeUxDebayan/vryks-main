import { createContext, useContext, useRef, type ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
export type ScrollPhase = 0 | 1 | 2 | 3;

export interface AnimationContextValue {
  heroProgress: React.MutableRefObject<number>;
  scrollPhase: React.MutableRefObject<ScrollPhase>;
  navLogoRef: React.RefObject<HTMLSpanElement | null>;
  setPhase: (phase: ScrollPhase) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AnimationContext = createContext<AnimationContextValue | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const heroProgress = useRef<number>(0);
  const scrollPhase = useRef<ScrollPhase>(0);
  const navLogoRef = useRef<HTMLSpanElement | null>(null);

  const setPhase = (phase: ScrollPhase) => {
    scrollPhase.current = phase;
  };

  return (
    <AnimationContext.Provider value={{ heroProgress, scrollPhase, navLogoRef, setPhase }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error('useAnimation must be used within AnimationProvider');
  return ctx;
}
