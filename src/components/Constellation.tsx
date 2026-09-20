import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };

export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes: Node[] = Array.from({ length: 54 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00009,
      vy: (Math.random() - 0.5) * 0.00009,
      r: i % 13 === 0 ? 1.9 : Math.random() * 0.9 + 0.45,
      accent: i % 17 === 0
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!reduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > 1) a.vx *= -1;
          if (a.y < 0 || a.y > 1) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 88) {
            const alpha = (1 - dist / 88) * 0.16;
            ctx.strokeStyle = `rgba(166, 186, 205, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const x = n.x * width;
        const y = n.y * height;
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? 'rgba(127,215,223,.92)' : 'rgba(225,235,244,.62)';
        ctx.fill();
        if (n.accent) {
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(127,215,223,.06)';
          ctx.fill();
        }
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-label="A slowly moving constellation of connected points representing systems, evidence, and writing."
      role="img"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
