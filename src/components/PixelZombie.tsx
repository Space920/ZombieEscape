const COLORS: Record<string, string> = {
  s: "#7cc74a",
  d: "#4e9a2e",
  k: "#2f6b1c",
  e: "#f4f4f0",
  b: "#161616",
  t: "#3f5c32",
  c: "#2a3d22",
  p: "#2c2c38",
  n: "#1c1c24",
  r: "#9b2c2c",
  h: "#5a3a22",
};

/** 12×16 front-facing walker */
const WALK = [
  "..kkkkkk..",
  ".kssssssk.",
  ".ksbeebsk.",
  ".kdssssdk.",
  "..dssssd..",
  ".tttttttt.",
  "stttttttds",
  "sk.tttt.ks",
  "..pppppp..",
  "..ppnnpp..",
  "..pp..pp..",
  "..nn..nn..",
];

/** Arms out */
const ARMS = [
  "...kkkk...",
  "..kssssk..",
  "..sbeebs..",
  "..dssssd..",
  "...ssss...",
  "ssttttttss",
  "s.tttttt.s",
  "r.tttttt.k",
  "...pppp...",
  "...pnnpp..",
  "...pp.pp..",
  "...nn.nn..",
];

/** Shorter groaning one */
const SMALL = [
  "...kkkk...",
  "..kssssk..",
  "..sebbes..",
  "..dssssd..",
  ".tttttttt.",
  "ssttttttks",
  "..tppppt..",
  "..pp..pp..",
  "..nn..nn..",
];

const POSES = { walk: WALK, arms: ARMS, small: SMALL } as const;

export type ZombiePose = keyof typeof POSES;

interface PixelZombieProps {
  pose?: ZombiePose;
  pixel?: number;
  flip?: boolean;
  className?: string;
}

export default function PixelZombie({
  pose = "walk",
  pixel = 3,
  flip = false,
  className = "",
}: PixelZombieProps) {
  const rows = POSES[pose];
  const width = rows[0].length;
  const height = rows.length;
  const cells: { x: number; y: number; fill: string }[] = [];

  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = COLORS[ch];
      if (fill) cells.push({ x, y, fill });
    });
  });

  return (
    <span
      className={`halloween-zombie inline-flex ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width * pixel}
        height={height * pixel}
        aria-hidden="true"
        style={{ imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.x}
            y={cell.y}
            width="1"
            height="1"
            fill={cell.fill}
          />
        ))}
      </svg>
    </span>
  );
}
