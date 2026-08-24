import type { DailyLog } from "@/lib/schemas";

export function TrendChart({ logs }: { logs: DailyLog[] }) {
  const points = logs.filter((log) => log.weight !== null).slice(-30);
  if (points.length < 2) return <div className="chart-empty">记录至少两次体重后，这里会出现趋势线。</div>;
  const values = points.map((point) => point.weight as number);
  const min = Math.min(...values) - .5; const max = Math.max(...values) + .5; const span = Math.max(1, max - min);
  const coords = points.map((point, index) => ({ x: 6 + index * (88 / Math.max(1, points.length - 1)), y: 88 - ((point.weight as number - min) / span) * 70, ...point }));
  const path = coords.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  return (
    <div className="trend-chart">
      <svg viewBox="0 0 100 100" role="img" aria-label="最近体重趋势">
        <path className="chart-area" d={`${path} L${coords.at(-1)?.x},94 L6,94 Z`} />
        <path className="chart-line" d={path} />
        {coords.map((point) => <circle key={point.date} cx={point.x} cy={point.y} r="1.8"><title>{point.date}: {point.weight}kg</title></circle>)}
      </svg>
      <div className="chart-labels"><span>{points[0].date.slice(5)}</span><span>{points.at(-1)?.date.slice(5)}</span></div>
    </div>
  );
}

