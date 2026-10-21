"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { CommunityId } from "@/types/server";
import { COMMUNITIES, COMMUNITY_LOGO_EXTENSIONS } from "@/data/communities";

/** Same background logo footprint on every server card */
const BACKGROUND_LOGO_SIZE = "h-28 w-28 sm:h-32 sm:w-32";
const BACKGROUND_LOGO_OPACITY = 0.17;

interface CommunityCardBackgroundProps {
  communityId: CommunityId;
  online?: boolean;
}

export default function CommunityCardBackground({
  communityId,
  online = true,
}: CommunityCardBackgroundProps) {
  const community = COMMUNITIES[communityId];
  const extensions = community.logoExtension
    ? [community.logoExtension]
    : [...COMMUNITY_LOGO_EXTENSIONS];

  const [extIndex, setExtIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (extIndex < extensions.length - 1) {
      setExtIndex((i) => i + 1);
    } else {
      setFailed(true);
    }
  }, [extIndex, extensions.length]);

  const logoSrc = `/communities/${community.logoFile}${extensions[extIndex]}`;
  const opacity = online ? BACKGROUND_LOGO_OPACITY : BACKGROUND_LOGO_OPACITY * 0.45;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, var(--bg-surface) 0%, var(--bg-surface) 38%, color-mix(in srgb, var(--bg-surface) 78%, transparent) 62%, color-mix(in srgb, var(--bg-surface) 55%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 82% 50%, ${community.accent}14 0%, transparent 55%)`,
        }}
      />

      <div className="absolute top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 sm:left-[60%]">
        <div
          className={`relative ${BACKGROUND_LOGO_SIZE}`}
          style={{ opacity }}
        >
          {failed ? (
            <div
              className="flex h-full w-full items-center justify-center rounded-2xl text-4xl font-black text-white/25"
              style={{
                background: online
                  ? `linear-gradient(135deg, ${community.accent}33, ${community.accentDim}22)`
                  : "#1a241a",
              }}
            >
              {community.initials}
            </div>
          ) : (
            <Image
              key={logoSrc}
              src={logoSrc}
              alt=""
              fill
              sizes="128px"
              className="object-contain object-center"
              onError={handleError}
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
}
