const COLORS: Record<string, string> = {
  s: "#3f6b22",
  d: "#2a4416",
  o: "#d97a1c",
  a: "#f59a2a",
  k: "#8a4510",
  y: "#ffe27a",
  u: "#4a2a0e",
  n: "#2e1808",
  m: "#1c1008",
};

const LIT = [
  "......ss....",
  ".....sd.....",
  "...ooooooo..",
  ".oaoyoooyao.",
  "ooaoyoooyaoo",
  "oooooooooooo",
  "ooooyyyyoooo",
  ".ooooyyooo..",
  "..oooooooo..",
];

const UNLIT = [
  "......ss....",
  ".....sd.....",
  "...uuuuuuu..",
  ".ununuuunun.",
  "uununuuununu",
  "uuuuuuuuuuuu",
  "uuuunnnnuuuu",
  ".uuuunnuuu..",
  "..uuuuuuuu..",
];

const SMALL_LIT = [
  "....s...",
  "..ooooo.",
  ".oyoooyo",
  "oooooooo",
  ".oyyyyo.",
  "..oooo..",
];

const SMALL_UNLIT = [
  "....s...",
  "..uuuuu.",
  ".unuuunu",
  "uuuuuuuu",
  ".unnnnu.",
  "..uuuu..",
];

interface PixelPumpkinProps {
  lit?: boolean;
  small?: boolean;
  pixel?: number;
  className?: string;
}

export default function PixelPumpkin({
  lit = false,
  small = false,
  pixel = 3,
  className = "",
}: PixelPumpkinProps) {
  const rows = small ? (lit ? SMALL_LIT : SMALL_UNLIT) : lit ? LIT : UNLIT;
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
      className={`inline-flex ${lit ? "pumpkin-lit" : "pumpkin-unlit"} ${className}`}
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
