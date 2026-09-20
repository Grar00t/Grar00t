import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
type Palette = { line: string; node: string; accent: string; glow: string };

const readPalette = (): Palette => {
  const style = getComputedStyle(document.documentElement);
  const value = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;

  return {
    line: value('--constellation-line', 'rgba(166, 186, 205, 0.16)'),
    node: value('--constellation-node', 'rgba(225, 235, 244, 0.62)'),
    accent: value('--constellation-accent', 'rgba(127, 215, 223, 0.92)'),
    glow: value('--constellation-glow', 'rgba(127, 215, 223, 0.06)')
  };
};

export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compactMedia = window.matchMedia('(max-width: 640px)');
    let compact = compactMedia.matches;

    const nodes: Node[] = Array.from({ length: 54 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.000075,
      vy: (Math.random() - 0.5) * 0.000075,
      r: i % 13 === 0 ? 1.8 : Math.random() * 0.85 + 0.4,
      accent: i % 17 === 0
    }));

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let palette = readPalette();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const activeCount = compact ? 30 : nodes.length;
      const threshold = compact ? 76 : 92;

      for (let i = 0; i < activeCount; i++) {
        const a = nodes[i];
        if (!reduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > 1) a.vx *= -1;
          if (a.y < 0 || a.y > 1) a.vy *= -1;
        }

        for (let j = i + 1; j < activeCount; j++) {
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < threshold) {
            ctx.globalAlpha = (1 - dist / threshold) * 0.95;
            ctx.strokeStyle = palette.line;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      for (let i = 0; i < activeCount; i++) {
        const n = nodes[i];
        const x = n.x * width;
        const y = n.y * height;
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? palette.accent : palette.node;
        ctx.fill();

        if (n.accent) {
          ctx.beginPath();
          ctx.arc(x, y, compact ? 5 : 7, 0, Math.PI * 2);
          ctx.fillStyle = palette.glow;
          ctx.fill();
        }
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw();
    };

    const onThemeMutation = () => {
      palette = readPalette();
      if (reduced) draw();
    };

    const onCompactChange = (event: MediaQueryListEvent) => {
      compact = event.matches;
      if (reduced) draw();
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const themeObserver = new MutationObserver(onThemeMutation);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    compactMedia.addEventListener('change', onCompactChange);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      themeObserver.disconnect();
      compactMedia.removeEventListener('change', onCompactChange);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
