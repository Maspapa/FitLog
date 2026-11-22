import type { DailyLog } from "./schemas";

/** 记录本次训练开始的时刻；只保存这一时间点，不记录结束时间。 */
export function recordTrainingStart(log: DailyLog, now = new Date()): DailyLog {
  const stamp = now.toISOString();
  return { ...log, startedAt: stamp, updatedAt: stamp };
}

/** 把记录的开始时刻显示成本机 24 小时制的 07:12。 */
export function formatStartTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}