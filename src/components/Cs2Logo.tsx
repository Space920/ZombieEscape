import Image from "next/image";

interface Cs2LogoProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE = {
  sm: 40,
  md: 48,
  lg: 56,
} as const;

export default function Cs2Logo({
  size = "md",
  showLabel = false,
  className = "",
}: Cs2LogoProps) {
  const px = SIZE[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0 overflow-hidden rounded-md border border-[var(--border-green)] shadow-[0_0_22px_rgba(57,255,20,0.16)]"
        style={{ width: px, height: px }}
      >
        <Image
          src="/assets/cs2-icon.png"
          alt="Counter-Strike 2"
          width={px}
          height={px}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
          Counter-Strike 2
        </span>
      )}
    </div>
  );
}
