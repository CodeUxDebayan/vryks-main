import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { setCursor } from './CustomCursor';
import { projects } from '../data/projects';

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="work"
      ref={ref}
      style={{
        background: '#050505',
        padding: 'clamp(6rem, 14vw, 12rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(245,245,240,0.3)',
          marginBottom: '4rem',
          padding: '0 2.5rem',
        }}
      >
        03 / SELECTED WORK
      </motion.div>

      {/* Project list */}
      <div>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            inView={inView}
            isHovered={hoveredId === project.id}
            anyHovered={hoveredId !== null}
            onHover={(id) => {
              setHoveredId(id);
              setCursor(id ? 'view' : 'default');
            }}
          />
        ))}
      </div>
    </section>
  );
}

interface ProjectRowProps {
  project: (typeof projects)[0];
  index: number;
  inView: boolean;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: (id: string | null) => void;
}

function ProjectRow({ project, index, inView, isHovered, anyHovered, onHover }: ProjectRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(245,245,240,0.06)',
        padding: '2.5rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto 340px',
        gridTemplateRows: 'auto',
        gap: '2rem',
        alignItems: 'center',
        cursor: 'none',
        transition: 'background 0.4s ease',
        background: isHovered
          ? 'rgba(245,245,240,0.02)'
          : 'transparent',
        opacity: anyHovered && !isHovered ? 0.35 : 1,
      }}
    >
      {/* Index */}
      <motion.span
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: isHovered ? project.accent : 'rgba(245,245,240,0.25)',
          transition: 'color 0.3s ease',
        }}
      >
        {project.index}
      </motion.span>

      {/* Name + Category */}
      <div>
        <div
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4.5vw, 5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: '#f5f5f0',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            transform: isHovered ? 'translateX(12px)' : 'translateX(0)',
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: isHovered ? project.accent : 'rgba(245,245,240,0.3)',
            marginTop: '6px',
            transition: 'color 0.3s ease',
          }}
        >
          {project.category}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: 'rgba(245,245,240,0.2)',
              opacity: isHovered ? 0.8 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Reveal image placeholder */}
      <div
        style={{
          position: 'relative',
          height: '180px',
          borderRadius: '4px',
          overflow: 'hidden',
          clipPath: isHovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Placeholder visual for future project image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 40% 40%, ${project.accent}22 0%, ${project.accent}06 50%, #111 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '2rem',
              letterSpacing: '-0.04em',
              color: project.accent,
              opacity: 0.4,
            }}
          >
            {project.name}
          </span>
          <span
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '8px',
              letterSpacing: '0.2em',
              color: 'rgba(245,245,240,0.2)',
            }}
          >
            {project.year}
          </span>
        </div>
        {/* Description overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 50%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '12px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease 0.2s',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              color: 'rgba(245,245,240,0.6)',
              lineHeight: 1.5,
            }}
          >
            {project.description}
          </p>
        </div>
      </div>

      {/* Arrow indicator */}
      <div
        style={{
          position: 'absolute',
          right: '2.5rem',
          top: '50%',
          transform: `translateY(-50%) translateX(${isHovered ? 0 : 20}px)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          fontFamily: 'Space Mono, monospace',
          fontSize: '12px',
          color: project.accent,
        }}
      >
        ↗
      </div>
    </motion.div>
  );
}
