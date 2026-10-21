import { REGION_FLAG_CODES, REGION_LABELS } from "@/data/communities";

interface RegionFlagProps {
  code: string;
  className?: string;
  size?: "sm" | "md";
}

export default function RegionFlag({
  code,
  className = "",
  size = "sm",
}: RegionFlagProps) {
  const flagCode = REGION_FLAG_CODES[code] ?? code.toLowerCase();
  const label = REGION_LABELS[code] ?? code;
  const dimensions = size === "md" ? "h-4 w-6" : "h-3.5 w-5";

  return (
    <img
      src={`https://flagcdn.com/24x18/${flagCode}.png`}
      srcSet={`https://flagcdn.com/48x36/${flagCode}.png 2x`}
      width={24}
      height={18}
      alt={label}
      title={label}
      loading="lazy"
      decoding="async"
      aria-label={label}
      className={`inline-block shrink-0 rounded-[2px] object-cover ${dimensions} ${className}`}
    />
  );
}
