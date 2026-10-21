"use client";

import { useEffect, useState } from "react";
import {
  HALLOWEEN_ENDS_AT_MS,
  clearHalloweenTheme,
  isHalloweenActive,
} from "@/lib/halloween";
import PixelZombie from "@/components/PixelZombie";
import HalloweenScene from "@/components/HalloweenScene";

function Web({
  className,
  flip,
  layer,
}: {
  className?: string;
  flip?: boolean;
  layer: number;
}) {
  return (
    <div
      className={`halloween-parallax ${className ?? ""}`}
      style={{ "--hallo-depth": String(layer) } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 180 180"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path d="M0 0 L180 0 M0 0 L0 180 M0 0 L160 40 M0 0 L120 90 M0 0 L70 140 M0 0 L40 160" />
        <path d="M24 0 Q28 28 0 24" />
        <path d="M52 0 Q64 64 0 52" />
        <path d="M88 0 Q108 108 0 88" />
        <path d="M128 0 Q150 140 0 128" />
      </svg>
    </div>
  );
}

function FacingZombies({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [lookRight, setLookRight] = useState(true);

  useEffect(() => {
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setLookRight(e.clientX > window.innerWidth / 2);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={`${className ?? ""} transition-transform duration-500 ease-out`}
      style={{ transform: lookRight ? "scaleX(1)" : "scaleX(-1)" }}
    >
      {children}
    </div>
  );
}

export default function HalloweenDecor() {
  useEffect(() => {
    if (!isHalloweenActive()) {
      clearHalloweenTheme();
      return;
    }

    const remaining = HALLOWEEN_ENDS_AT_MS - Date.now();
    const timer = window.setTimeout(() => {
      clearHalloweenTheme();
    }, remaining);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="halloween-only pointer-events-none fixed inset-0 z-[1] overflow-hidden text-[var(--accent-green)]"
      aria-hidden="true"
    >
      <HalloweenScene />

      <Web
        className="absolute -left-2 -top-2 h-28 w-28 opacity-20 sm:h-44 sm:w-44"
        layer={8}
      />
      <Web
        flip
        className="absolute -right-2 -top-2 h-24 w-24 opacity-10 sm:h-40 sm:w-40"
        layer={5}
      />

      <FacingZombies className="absolute left-2 top-[28%] hidden flex-col items-center gap-8 opacity-40 lg:left-4 lg:flex">
        <PixelZombie pose="arms" pixel={2} />
        <PixelZombie pose="walk" pixel={2} />
        <PixelZombie pose="small" pixel={2} />
      </FacingZombies>

      <FacingZombies className="absolute right-2 top-[34%] hidden flex-col items-center gap-8 opacity-35 lg:right-4 lg:flex">
        <PixelZombie pose="walk" pixel={2} />
        <PixelZombie pose="small" pixel={2} />
        <PixelZombie pose="arms" pixel={2} />
      </FacingZombies>
    </div>
  );
}
