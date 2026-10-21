interface MiniSparklineProps {
  values: number[];
  className?: string;
}

function chartColor(delta: number) {
  if (delta > 0) return "var(--accent-green)";
  if (delta < 0) return "#f87171";
  return "var(--text-secondary)";
}

export default function MiniSparkline({
  values,
  className = "",
}: MiniSparklineProps) {
  if (values.length < 2) return null;

  const start = values[0];
  const end = values[values.length - 1];
  const net = end - start;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  const width = 280;
  const height = 64;
  const padX = 22;
  const padY = 14;
  const innerH = height - padY * 2;

  const points = values.map((value, index) => {
    const x =
      padX + (index / (values.length - 1)) * (width - padX * 2);
    const y =
      range === 0
        ? padY + innerH / 2
        : padY + (1 - (value - min) / range) * innerH;
    return { x, y, value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x} ${height - 4} L${points[0].x} ${height - 4} Z`;
  const color = chartColor(net);
  const netLabel = net > 0 ? `+${net}` : `${net}`;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-16 w-full"
        role="img"
        aria-label={`Players ${start} to ${end} (${netLabel})`}
      >
        <path d={areaPath} fill={color} opacity="0.12" />

        {points.slice(1).map((point, index) => {
          const prev = points[index];
          const step = point.value - prev.value;
          return (
            <line
              key={index}
              x1={prev.x}
              y1={prev.y}
              x2={point.x}
              y2={point.y}
              stroke={chartColor(step)}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.25"
          opacity="0.35"
        />

        <circle cx={points[0].x} cy={points[0].y} r="2.5" fill={color} />
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="2.5"
          fill={color}
        />

        <text
          x={points[0].x}
          y={Math.max(10, points[0].y - 6)}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {start}
        </text>
        <text
          x={points[points.length - 1].x}
          y={Math.max(10, points[points.length - 1].y - 6)}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {end}
        </text>
      </svg>

      <p
        className="mt-0.5 text-right text-[11px] font-semibold tabular-nums"
        style={{ color }}
      >
        {net === 0 ? "±0" : netLabel}
      </p>
    </div>
  );
}
