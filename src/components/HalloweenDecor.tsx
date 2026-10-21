"use client";

import { useEffect, useState } from "react";
import {
  HALLOWEEN_ENDS_AT_MS,
  clearHalloweenTheme,
  isHalloweenActive,
} from "@/lib/halloween";
import PixelZombie, { type ZombiePose } from "@/components/PixelZombie";
import PixelPumpkin from "@/components/PixelPumpkin";
import HalloweenScene from "@/components/HalloweenScene";

const POSE_CYCLE: ZombiePose[] = ["walk", "arms", "small"];

type ScatterItem =
  | {
      id: string;
      kind: "zombie";
      pose: ZombiePose;
      side: "left" | "right";
      top: number;
      inset: number;
      flip?: boolean;
    }
  | {
      id: string;
      kind: "pumpkin";
      lit: boolean;
      small?: boolean;
      side: "left" | "right";
      top: number;
      inset: number;
      pixel: number;
    };

/** Spaced down the page, alternating sides so nothing clusters. */
const SCATTER: ScatterItem[] = [
  { id: "z1", kind: "zombie", pose: "arms", side: "left", top: 260, inset: 20 },
  { id: "p1", kind: "pumpkin", lit: true, side: "right", top: 720, inset: 24, pixel: 3 },
  { id: "z2", kind: "zombie", pose: "walk", side: "right", top: 1280, inset: 18, flip: true },
  { id: "p2", kind: "pumpkin", lit: false, side: "left", top: 1840, inset: 22, pixel: 2.5 },
  { id: "z3", kind: "zombie", pose: "small", side: "left", top: 2460, inset: 26 },
  { id: "p3", kind: "pumpkin", lit: true, side: "right", top: 3080, inset: 20, pixel: 3 },
  { id: "z4", kind: "zombie", pose: "walk", side: "right", top: 3720, inset: 22, flip: true },
  { id: "p4", kind: "pumpkin", lit: false, small: true, side: "left", top: 4300, inset: 28, pixel: 2.5 },
];

function InteractiveZombie({
  pose,
  flip,
}: {
  pose: ZombiePose;
  flip?: boolean;
}) {
  const [current, setCurrent] = useState(pose);
  const [hop, setHop] = useState(0);

  return (
    <button
      type="button"
      aria-label="Zombie"
      className="pointer-events-auto cursor-pointer border-0 bg-transparent p-0 outline-none transition-transform hover:-translate-y-1 focus-visible:ring-1 focus-visible:ring-[var(--accent-green)]"
      onClick={(event) => {
        event.stopPropagation();
        setHop((value) => value + 1);
        setCurrent((value) => {
          const index = POSE_CYCLE.indexOf(value);
          return POSE_CYCLE[(index + 1) % POSE_CYCLE.length];
        });
      }}
    >
      <span key={hop} className={hop ? "zombie-hop inline-flex" : "inline-flex"}>
        <PixelZombie pose={current} pixel={2} flip={flip} />
      </span>
    </button>
  );
}

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

function measurePageHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
}

export default function HalloweenDecor() {
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    if (!isHalloweenActive()) {
      clearHalloweenTheme();
      return;
    }

    const remaining = HALLOWEEN_ENDS_AT_MS - Date.now();
    const timer = window.setTimeout(() => {
      clearHalloweenTheme();
    }, remaining);

    const updateHeight = () => setPageHeight(measurePageHeight());
    updateHeight();
    const late = [400, 1400].map((ms) => window.setTimeout(updateHeight, ms));
    const ro = new ResizeObserver(updateHeight);
    ro.observe(document.documentElement);
    ro.observe(document.body);
    window.addEventListener("resize", updateHeight);

    let scrollIdle = 0;
    const onScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      window.clearTimeout(scrollIdle);
      scrollIdle = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      late.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(scrollIdle);
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  const visibleScatter = SCATTER.filter(
    (item) => pageHeight === 0 || item.top < pageHeight - 80,
  );

  return (
    <>
      <div
        className="halloween-scene-layer halloween-only pointer-events-none fixed inset-0 z-[1] overflow-hidden text-[var(--accent-green)]"
        aria-hidden="true"
      >
        <HalloweenScene />
        <Web
          className="absolute -left-2 -top-2 h-20 w-20 opacity-10 sm:h-28 sm:w-28"
          layer={6}
        />
        <Web
          flip
          className="absolute -right-2 -top-2 h-16 w-16 opacity-[0.08] sm:h-24 sm:w-24"
          layer={4}
        />
      </div>

      <div
        className="halloween-page-layer halloween-only pointer-events-none absolute inset-x-0 top-0 z-[1] text-[var(--accent-green)]"
        style={{ height: pageHeight || "100%" }}
        aria-hidden="true"
      >
        {visibleScatter.map((item) => (
          <div
            key={item.id}
            className="absolute hidden opacity-75 lg:block"
            style={{
              top: item.top,
              [item.side]: item.inset,
            }}
          >
            {item.kind === "zombie" ? (
              <InteractiveZombie pose={item.pose} flip={item.flip} />
            ) : (
              <PixelPumpkin
                lit={item.lit}
                small={item.small}
                pixel={item.pixel}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
