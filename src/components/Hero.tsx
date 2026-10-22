"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Cs2Logo from "@/components/Cs2Logo";
import HalloweenToggle from "@/components/HalloweenToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PeakHoursToggle from "@/components/PeakHoursToggle";
import PixelZombie from "@/components/PixelZombie";
import { useTranslations } from "@/i18n/LocaleProvider";

const LETTERS = ["Z", "o", "m", "b", "i", "e"] as const;
const START_DELAY_MS = 5_000;
const EMERGE_MS = 420;
const TRAVEL_MS = 3_000;

type Point = { x: number; y: number };

export default function Hero() {
  const t = useTranslations();
  const stageRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [play, setPlay] = useState(false);
  const [gone, setGone] = useState(false);
  const [firing, setFiring] = useState(false);
  const [struck, setStruck] = useState(false);
  const [bloodied, setBloodied] = useState<Set<number>>(() => new Set());
  const [zombie, setZombie] = useState({ x: 0, y: 0, scale: 0.2, visible: false });

  useLayoutEffect(() => {
    letterRefs.current = letterRefs.current.slice(0, LETTERS.length);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setPlay(true), START_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!play) return;

    const measure = (): Point[] | null => {
      const stage = stageRef.current?.getBoundingClientRect();
      if (!stage) return null;
      const points = letterRefs.current.map((node) => {
        if (!node) return null;
        const box = node.getBoundingClientRect();
        return {
          x: box.left + box.width / 2 - stage.left,
          y: box.top - stage.top + 2,
        };
      });
      if (points.some((point) => point == null)) return null;
      return points as Point[];
    };

    let frame = 0;
    let startedAt = 0;
    const hits = new Set<number>();

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt;
      const path = measure();
      if (!path) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      if (elapsed < EMERGE_MS) {
        const grow = elapsed / EMERGE_MS;
        setFiring(true);
        setZombie({
          x: path[5].x,
          y: path[5].y,
          scale: 0.15 + grow * 0.85,
          visible: true,
        });
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const travel = Math.min(1, (elapsed - EMERGE_MS) / TRAVEL_MS);
      const eased = 1 - (1 - travel) ** 1.35;
      const along = Math.min(4.999, eased * 5);
      const fromIndex = 5 - Math.floor(along);
      const toIndex = fromIndex - 1;
      const local = along - Math.floor(along);
      const from = path[fromIndex];
      const to = path[toIndex];
      const x = from.x + (to.x - from.x) * local;
      const y = from.y + (to.y - from.y) * local;
      const letter = 5 - Math.round(eased * 5);

      if (!hits.has(letter)) {
        hits.add(letter);
        setBloodied((current) => new Set(current).add(letter));
        setStruck(true);
        window.setTimeout(() => setStruck(false), 140);
      }

      setZombie({ x, y, scale: 1, visible: travel < 1 });
      setFiring(travel < 1);

      if (elapsed < EMERGE_MS + TRAVEL_MS + 280) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      setFiring(false);
      setZombie((current) => ({ ...current, visible: false }));
      setGone(true);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [play]);

  return (
    <header className="relative z-10 overflow-visible">
      <div className="relative mx-auto max-w-5xl overflow-visible px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <PeakHoursToggle />
          <HalloweenToggle />
          <LanguageSwitcher />
        </div>
        <div
          ref={stageRef}
          className={`hero-stage flex items-center gap-4 overflow-visible sm:gap-5 ${play ? "hero-intro" : ""} ${firing ? "is-firing" : ""}`}
        >
          <div className="cs2-logo-stage">
            <div className="cs2-logo-recoil">
              <Cs2Logo size="lg" />
            </div>
            <span className="cs2-muzzle" aria-hidden="true" />
            <span className="cs2-tracer" aria-hidden="true" />
            <span className="cs2-tracer cs2-tracer-b" aria-hidden="true" />
            <span className="cs2-tracer cs2-tracer-c" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 overflow-visible">
            <h1 className="ze-title-split overflow-visible text-[1.85rem] leading-[0.95] sm:text-4xl lg:text-[2.85rem]">
              <span className="sr-only">CS2 Zombie Escape Servers</span>
              <span
                aria-hidden="true"
                className="text-glow text-[var(--accent-green)]"
              >
                <span className="zombie-word">
                  {LETTERS.map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      ref={(node) => {
                        letterRefs.current[index] = node;
                      }}
                      className={`zombie-letter ${index === 5 ? "zombie-e" : ""} ${play && index === 5 && !gone ? "is-hatching" : ""} ${bloodied.has(index) ? "is-hit" : ""}`}
                    >
                      {letter}
                      {bloodied.has(index) && (
                        <span className={`letter-blood letter-blood--${index}`} aria-hidden="true">
                          {letter}
                        </span>
                      )}
                    </span>
                  ))}
                </span>{" "}
                Escape
              </span>
              <span aria-hidden="true" className="text-white">
                {" "}
                Servers
              </span>
            </h1>
          </div>
          {play && !gone && (
            <span
              className={`intro-zombie ${zombie.visible ? "is-out" : ""} ${struck ? "is-struck" : ""}`}
              style={{
                left: zombie.x,
                top: zombie.y,
                transform: `translate(-50%, -100%) scale(${zombie.scale})`,
              }}
              aria-hidden="true"
            >
              <span className="intro-zombie-body">
                <PixelZombie pose="small" pixel={4} flip idle={false} />
              </span>
              {struck && <span className="intro-hit-flash" />}
            </span>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-[15px]">
          {t("hero.subtitle")}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {t("hero.description")}
        </p>
        <p className="mt-3 text-xs text-[var(--text-secondary)]/90">
          {t("hero.tagline")}
        </p>
        <p className="mt-3">
          <Link
            href="/zombie-escape"
            className="inline-flex items-center rounded-full border border-[var(--border-green)] bg-[var(--accent-green-muted)] px-3 py-1 text-xs font-semibold text-[var(--accent-green)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-green)_18%,transparent)]"
          >
            {t("hero.guideLink")}
          </Link>
        </p>
      </div>
    </header>
  );
}
