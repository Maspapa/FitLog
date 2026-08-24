import type { DailyLog } from "./schemas";

export function dateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function recentLogs(logs: DailyLog[], days: number, today = new Date()): DailyLog[] {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end); start.setDate(start.getDate() - days + 1);
  return logs.filter((log) => { const date = parseDate(log.date); return date >= start && date <= end; }).sort((a, b) => a.date.localeCompare(b.date));
}

export function average(values: Array<number | null | undefined>): number | null {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

export function weightAverage(logs: DailyLog[], days = 7, today = new Date()): number | null {
  return average(recentLogs(logs, days, today).map((log) => log.weight));
}

export function latestMeasurement(logs: DailyLog[], field: "weight" | "waist"): number | null {
  const matched = [...logs].sort((a, b) => b.date.localeCompare(a.date)).find((log) => log[field] !== null);
  return matched?.[field] ?? null;
}

export function workoutsThisWeek(logs: DailyLog[], today = new Date()): number {
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const day = current.getDay() || 7;
  const monday = new Date(current); monday.setDate(current.getDate() - day + 1);
  return logs.filter((log) => parseDate(log.date) >= monday && parseDate(log.date) <= current).reduce((sum, log) => sum + log.workouts.length, 0);
}

export function calculateStreak(logs: DailyLog[], today = new Date()): number {
  const dates = new Set(logs.map((log) => log.date));
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!dates.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(dateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

export function emptyLog(date: string): DailyLog {
  return {
    date, weight: null, waist: null, workouts: [],
    meals: { breakfast: "", lunch: "", dinner: "", snacks: "" },
    sleepHours: null, fatigue: null, mood: null, soreness: null,
    waterGlasses: null, steps: null, alcohol: false, notes: "", updatedAt: new Date().toISOString(),
  };
}

