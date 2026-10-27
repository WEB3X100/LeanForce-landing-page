import { useEffect, useRef } from 'react';

type Point = { ox: number; oy: number; x: number; y: number };
type Ripple = { x: number; y: number; born: number };

const GAP = 48;
const PULL_RADIUS = 200;
const PULL = 32;
const RIPPLE_LIFE = 1100;

export function CursorGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;
    const ctx = context;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cols = 0;
    let rows = 0;
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let px = -9999;
    let py = -9999;
    let inside = false;
    let running = false;
    let frame = 0;
    let visible = true;
    const ripples: Ripple[] = [];

    const influence = (x: number, y: number) => {
      if (!inside) return 0;
      return Math.max(0, 1 - Math.hypot(x - px, y - py) / PULL_RADIUS);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / GAP) + 1;
      rows = Math.ceil(height / GAP) + 1;
      points = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const ox = c * GAP;
          const oy = r * GAP;
          points.push({ ox, oy, x: ox, y: oy });
        }
      }
    };

    const draw = (now: number) => {
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        if (now - ripples[i].born > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      let moving = inside || ripples.length > 0;
      if (!reduce.matches) {
        for (const point of points) {
          let x = point.ox;
          let y = point.oy;
          if (inside) {
            const dx = px - point.ox;
            const dy = py - point.oy;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < PULL_RADIUS) {
              const falloff = 1 - dist / PULL_RADIUS;
              const pull = falloff * falloff * PULL;
              x += (dx / dist) * pull;
              y += (dy / dist) * pull;
            }
          }
          for (const ripple of ripples) {
            const age = (now - ripple.born) / RIPPLE_LIFE;
            const dx = point.ox - ripple.x;
            const dy = point.oy - ripple.y;
            const dist = Math.hypot(dx, dy) || 1;
            const delta = Math.abs(dist - age * 360);
            const band = 76;
            if (delta < band) {
              const mag = Math.sin((1 - delta / band) * Math.PI) * (1 - age) * 18;
              x += (dx / dist) * mag;
              y += (dy / dist) * mag;
            }
          }
          point.x += (x - point.x) * 0.2;
          point.y += (y - point.y) * 0.2;
          if (Math.abs(x - point.x) > 0.2 || Math.abs(y - point.y) > 0.2) moving = true;
        }
      }

      ctx.clearRect(0, 0, width, height);
      const at = (r: number, c: number) => points[r * cols + c];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const point = at(r, c);
          if (c + 1 < cols) link(point, at(r, c + 1));
          if (r + 1 < rows) link(point, at(r + 1, c));
        }
      }
      for (const point of points) {
        const glow = influence(point.x, point.y);
        ctx.beginPath();
        ctx.fillStyle = glow > 0.08 ? `rgba(126, 231, 245, ${0.16 + glow * 0.18})` : 'rgba(214, 226, 232, 0.18)';
        ctx.arc(point.x, point.y, 1.3 + glow * 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
      return moving;

      function link(a: Point, b: Point) {
        const glow = influence((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.beginPath();
        ctx.strokeStyle = glow > 0.04 ? `rgba(25, 195, 220, ${0.06 + glow * 0.16})` : 'rgba(186, 206, 216, 0.09)';
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      if (!visible) {
        running = false;
        return;
      }
      const moving = draw(now);
      if (moving && !reduce.matches) frame = requestAnimationFrame(loop);
      else running = false;
    };

    const start = () => {
      if (reduce.matches) {
        draw(performance.now());
        return;
      }
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const pointFrom = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reduce.matches) return;
      const point = pointFrom(event);
      px = point.x;
      py = point.y;
      inside = true;
      start();
    };
    const onLeave = () => {
      inside = false;
      start();
    };
    const onDown = (event: PointerEvent) => {
      if (reduce.matches) return;
      const point = pointFrom(event);
      ripples.push({ x: point.x, y: point.y, born: performance.now() });
      if (ripples.length > 5) ripples.shift();
      start();
    };

    const onReduce = () => {
      inside = false;
      ripples.length = 0;
      resize();
      start();
    };

    const observer = new ResizeObserver(() => {
      resize();
      start();
    });
    observer.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    visibility.observe(host);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);
    reduce.addEventListener('change', onReduce);
    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      reduce.removeEventListener('change', onReduce);
    };
  }, []);

  return <canvas ref={ref} className="cursor-grid" aria-hidden="true" />;
}
