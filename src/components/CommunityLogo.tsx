"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { CommunityId } from "@/types/server";
import { COMMUNITIES, COMMUNITY_LOGO_EXTENSIONS } from "@/data/communities";

interface CommunityLogoProps {
  communityId: CommunityId;
  online?: boolean;
  size?: "sm" | "row" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-10 w-10 sm:h-11 sm:w-11",
  row: "h-11 w-11 sm:h-12 sm:w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
} as const;

const IMAGE_SIZES = {
  sm: 44,
  row: 48,
  md: 56,
  lg: 64,
} as const;

export default function CommunityLogo({
  communityId,
  online = true,
  size = "sm",
  className = "",
}: CommunityLogoProps) {
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
  const showFallback = failed;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] ${SIZE_CLASSES[size]} ${className}`}
      style={{
        background: showFallback
          ? online
            ? `linear-gradient(135deg, ${community.accent}, ${community.accentDim})`
            : "#1a241a"
          : undefined,
      }}
      aria-hidden={showFallback ? undefined : true}
    >
      {showFallback ? (
        <span
          className="select-none text-xs font-black text-white sm:text-sm"
          aria-label={`${community.label} logo`}
        >
          {community.initials}
        </span>
      ) : (
        <Image
          key={logoSrc}
          src={logoSrc}
          alt={`${community.label} logo`}
          width={IMAGE_SIZES[size]}
          height={IMAGE_SIZES[size]}
          className="object-contain p-1.5"
          onError={handleError}
          unoptimized
        />
      )}
    </div>
  );
}
