"use client";

import { useEffect, useRef } from "react";

interface Bat {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  phase: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: "green" | "ember";
}

interface Eye {
  x: number;
  y: number;
  size: number;
  lookX: number;
  lookY: number;
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  return { w, h };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function drawBat(ctx: CanvasRenderingContext2D, bat: Bat, flap: number) {
  const s = bat.scale;
  const angle = Math.atan2(bat.vy, bat.vx);
  ctx.save();
  ctx.translate(bat.x, bat.y);
  ctx.rotate(angle * 0.35);
  ctx.fillStyle = "rgba(110, 150, 100, 0.82)";
  const wing = 8 + flap * 5;
  ctx.beginPath();
  ctx.moveTo(-wing * s, 0);
  ctx.quadraticCurveTo(-3 * s, -7 * s * flap, 0, -1 * s);
  ctx.quadraticCurveTo(3 * s, -7 * s * flap, wing * s, 0);
  ctx.quadraticCurveTo(2 * s, 3 * s, 0, 2 * s);
  ctx.quadraticCurveTo(-2 * s, 3 * s, -wing * s, 0);
  ctx.fill();
  ctx.fillStyle = "rgba(157, 255, 98, 0.9)";
  ctx.beginPath();
  ctx.arc(0, 0, 1.3 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function moonAnchor(w: number, h: number, mx: number, my: number) {
  return {
    x: w * 0.86 + (mx - 0.5) * 28,
    y: h * 0.12 + (my - 0.5) * 18,
    r: Math.max(28, Math.min(w, h) * 0.045),
  };
}

function drawMoonGlow(
  ctx: CanvasRenderingContext2D,
  moon: { x: number; y: number; r: number },
) {
  const glow = ctx.createRadialGradient(
    moon.x,
    moon.y,
    moon.r * 0.2,
    moon.x,
    moon.y,
    moon.r * 2.8,
  );
  glow.addColorStop(0, "rgba(255, 224, 150, 0.4)");
  glow.addColorStop(0.4, "rgba(255, 170, 70, 0.14)");
  glow.addColorStop(1, "rgba(255, 170, 70, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.r * 2.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoonDisc(
  ctx: CanvasRenderingContext2D,
  moon: { x: number; y: number; r: number },
) {
  ctx.fillStyle = "#f0ddb0";
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(7, 10, 7, 0.92)";
  ctx.beginPath();
  ctx.arc(moon.x + moon.r * 0.38, moon.y - moon.r * 0.08, moon.r * 0.82, 0, Math.PI * 2);
  ctx.fill();
}

function drawWitch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  bob: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.16 + bob * 0.1);
  ctx.scale(scale, scale);
  ctx.shadowColor = "rgba(255, 196, 110, 0.35)";
  ctx.shadowBlur = 10;

  ctx.strokeStyle = "#8a5a28";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-28, 5);
  ctx.lineTo(22, -3);
  ctx.stroke();

  ctx.strokeStyle = "#c4843a";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    ctx.beginPath();
    ctx.moveTo(-26, 5);
    ctx.lineTo(-38 - t * 2, -4 + t * 14);
    ctx.stroke();
  }

  ctx.fillStyle = "#3d2a52";
  ctx.beginPath();
  ctx.moveTo(-1, 0);
  ctx.quadraticCurveTo(-18, 7, -14, 20);
  ctx.quadraticCurveTo(1, 12, 9, 18);
  ctx.quadraticCurveTo(7, 3, 5, -1);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#4a3560";
  ctx.beginPath();
  ctx.ellipse(2, 1, 4.6, 5.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5a4470";
  ctx.beginPath();
  ctx.arc(3.4, -7, 2.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2c1c3d";
  ctx.beginPath();
  ctx.moveTo(-4.2, -7.8);
  ctx.lineTo(12, -8.2);
  ctx.lineTo(4, -22);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3.6, -8, 8, 1.5, -0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#4a3560";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(5.8, 3.2);
  ctx.lineTo(16, 0.6);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(57, 255, 20, 0.85)";
  ctx.beginPath();
  ctx.arc(4.6, -20.6, 1.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  eyes: Eye[],
) {
  for (const eye of eyes) {
    ctx.fillStyle = "rgba(57, 255, 20, 0.08)";
    ctx.beginPath();
    ctx.arc(eye.x - eye.size * 0.7, eye.y, eye.size * 1.6, 0, Math.PI * 2);
    ctx.arc(eye.x + eye.size * 0.7, eye.y, eye.size * 1.6, 0, Math.PI * 2);
    ctx.fill();

    for (const side of [-1, 1] as const) {
      const ex = eye.x + side * eye.size * 0.7;
      ctx.fillStyle = "rgba(215, 255, 200, 0.9)";
      ctx.beginPath();
      ctx.ellipse(
        ex,
        eye.y,
        eye.size * 0.3,
        eye.size * 0.24,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.fillStyle = "#102010";
      ctx.beginPath();
      ctx.arc(
        eye.lookX + side * eye.size * 0.7,
        eye.lookY,
        eye.size * 0.12,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
}

export default function HalloweenScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let { w, h } = resizeCanvas(canvas, ctx);
    const mouse = { x: 0.5, y: 0.32 };
    const smooth = { x: 0.5, y: 0.32 };
    let raf = 0;
    let running = true;

    const bats: Bat[] = Array.from({ length: reduced ? 0 : 4 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.45,
      scale: 0.75 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
    }));

    const sparks: Spark[] = [];
    const witch = { progress: 0.18, pause: 0 };
    const placeEyes = (): Eye[] => [
      { x: w * 0.08, y: h * 0.18, size: 6, lookX: w * 0.08, lookY: h * 0.18 },
      { x: w * 0.91, y: h * 0.22, size: 7, lookX: w * 0.91, lookY: h * 0.22 },
    ];
    let eyes = placeEyes();

    const spawnSparks = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        sparks.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.7,
          vy: -0.25 - Math.random() * 0.7,
          life: 1,
          max: 55 + Math.random() * 40,
          hue: Math.random() > 0.4 ? "green" : "ember",
        });
      }
    };

    const burstBats = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        bats.push({
          x,
          y,
          vx: Math.cos(angle) * (1.1 + Math.random()),
          vy: Math.sin(angle) * (0.8 + Math.random() * 0.6),
          scale: 0.75 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
        });
        if (bats.length > 10) bats.shift();
      }
      spawnSparks(x, y, 8);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / w;
      mouse.y = e.clientY / h;
    };

    const onClick = (e: MouseEvent) => {
      if (reduced) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, select, textarea")) return;
      burstBats(e.clientX, e.clientY);
    };

    const onResize = () => {
      ({ w, h } = resizeCanvas(canvas, ctx));
      eyes = placeEyes();
    };

    let last = performance.now();
    let trailAcc = 0;
    let scrolling = false;
    let scrollIdle = 0;
    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollIdle);
      scrollIdle = window.setTimeout(() => {
        scrolling = false;
        last = performance.now();
      }, 140);
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (scrolling) {
        last = now;
        return;
      }
      const dt = Math.min(32, now - last) / 16.67;
      last = now;

      smooth.x = lerp(smooth.x, mouse.x, 0.08 * dt);
      smooth.y = lerp(smooth.y, mouse.y, 0.08 * dt);

      ctx.clearRect(0, 0, w, h);
      const moon = moonAnchor(w, h, smooth.x, smooth.y);
      drawMoonGlow(ctx, moon);

      const mx = smooth.x * w;
      const my = smooth.y * h;

      if (!reduced) {
        if (witch.pause > 0) {
          witch.pause -= dt;
        } else {
          witch.progress += dt * 0.0024;
          if (witch.progress >= 1) {
            witch.progress = 0;
            witch.pause = 70 + Math.random() * 90;
          }
        }

        if (witch.pause <= 0) {
          const p = Math.max(0, Math.min(1, witch.progress));
          const x = lerp(-90, moon.x, p);
          const y =
            lerp(h * 0.05, moon.y, p) + Math.sin(now / 420 + p * 6) * 8;
          const dist = Math.hypot(x - moon.x, y - moon.y);
          const behind = dist < moon.r * 0.92;
          const fade = behind
            ? Math.max(0, (dist - moon.r * 0.2) / (moon.r * 0.72))
            : p < 0.04
              ? p / 0.04
              : 1;
          if (fade > 0.03) {
            ctx.globalAlpha = fade;
            drawWitch(ctx, x, y, 1.85, Math.sin(now / 260));
            ctx.globalAlpha = 1;
          }
        }
      }

      drawMoonDisc(ctx, moon);

      for (const eye of eyes) {
        const dx = mx - eye.x;
        const dy = my - eye.y;
        const dist = Math.hypot(dx, dy) || 1;
        const look = Math.min(eye.size * 0.28, 4);
        eye.lookX = lerp(eye.lookX, eye.x + (dx / dist) * look, 0.12 * dt);
        eye.lookY = lerp(eye.lookY, eye.y + (dy / dist) * look, 0.12 * dt);
      }
      drawEyes(ctx, eyes);

      const aura = ctx.createRadialGradient(mx, my, 16, mx, my, 190);
      aura.addColorStop(0, "rgba(57, 255, 20, 0.08)");
      aura.addColorStop(0.5, "rgba(255, 140, 40, 0.045)");
      aura.addColorStop(1, "rgba(255, 140, 40, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(mx - 190, my - 190, 380, 380);

      if (!reduced) {
        const speed = Math.hypot(mouse.x - smooth.x, mouse.y - smooth.y);
        trailAcc += speed * dt;
        if (trailAcc > 0.012) {
          spawnSparks(mx, my, 1);
          trailAcc = 0;
        }

        for (const bat of bats) {
          const dx = bat.x - mx;
          const dy = bat.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200 && d2 > 36) {
            const d = Math.sqrt(d2);
            const force = 0.12 * (1 - d / 200);
            bat.vx += (dx / d) * force;
            bat.vy += (dy / d) * force;
          }
          bat.vx += Math.sin(now / 1100 + bat.phase) * 0.012;
          bat.vy += Math.cos(now / 1400 + bat.phase) * 0.01;
          bat.vx *= 0.985;
          bat.vy *= 0.985;
          const max = 1.6;
          const mag = Math.hypot(bat.vx, bat.vy);
          if (mag > max) {
            bat.vx = (bat.vx / mag) * max;
            bat.vy = (bat.vy / mag) * max;
          }
          bat.x += bat.vx * dt;
          bat.y += bat.vy * dt;
          if (bat.x < 12) bat.vx = Math.abs(bat.vx);
          if (bat.x > w - 12) bat.vx = -Math.abs(bat.vx);
          if (bat.y < 12) bat.vy = Math.abs(bat.vy);
          if (bat.y > h * 0.62) bat.vy = -Math.abs(bat.vy);
          const flap = 0.45 + (Math.sin(now / 180 + bat.phase) + 1) * 0.28;
          drawBat(ctx, bat, flap);
        }

        for (let i = sparks.length - 1; i >= 0; i--) {
          const spark = sparks[i];
          spark.x += spark.vx * dt;
          spark.y += spark.vy * dt;
          spark.life -= dt / spark.max;
          if (spark.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = Math.max(0, spark.life) * 0.55;
          ctx.fillStyle =
            spark.hue === "green"
              ? "rgba(57, 255, 20, 0.95)"
              : "rgba(255, 150, 55, 0.9)";
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(scrollIdle);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ contain: "strict" }}
    />
  );
}
