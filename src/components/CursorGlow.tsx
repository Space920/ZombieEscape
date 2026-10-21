"use client";

import { useEffect, useRef } from "react";

/** Mouse-reactive toxic-green atmospheric background. */
export default function CursorGlow() {
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 50, y: 30 });

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches;

    if (reducedMotion || isTouch) {
      root.style.setProperty("--mouse-x", "50%");
      root.style.setProperty("--mouse-y", "35%");
      root.style.setProperty("--mouse-active", "0");
      return;
    }

    root.style.setProperty("--mouse-active", "1");

    const apply = () => {
      root.style.setProperty("--mouse-x", `${targetRef.current.x}%`);
      root.style.setProperty("--mouse-y", `${targetRef.current.y}%`);
      rafRef.current = null;
    };

    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(apply);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 ze-noise opacity-30" />
      <div className="absolute inset-0 ze-grid opacity-[0.04]" />
      <div className="absolute inset-0 ze-fog" />
      <div className="absolute inset-0 ze-ambient" />
      <div className="absolute inset-0 ze-cursor-glow" />
      <div className="absolute inset-0 ze-cursor-glow-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,6,4,0.45)_100%)]" />
    </div>
  );
}
