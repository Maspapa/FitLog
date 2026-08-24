import { FitDataSchema, type DailyLog, type FitData, type Goal } from "./schemas";

const TOKEN_KEY = "fitlog-device-token-v1";

export function createData(goal: Goal = "fat_loss"): FitData {
  return { version: 1, profile: { goal, createdAt: new Date().toISOString() }, logs: [] };
}

export function getOrCreateDeviceToken(): string {
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing && /^[A-Za-z0-9_-]{40,128}$/.test(existing)) return existing;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  localStorage.setItem(TOKEN_KEY, token); return token;
}

export async function loadData(token: string): Promise<FitData> {
  const response = await fetch("/api/data", { headers: { "X-FitLog-Token": token }, cache: "no-store" });
  const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "读取记录失败");
  return FitDataSchema.parse(payload.data);
}

export async function saveData(token: string, data: FitData): Promise<FitData> {
  const response = await fetch("/api/data", { method: "PUT", headers: { "Content-Type": "application/json", "X-FitLog-Token": token }, body: JSON.stringify(data) });
  const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "保存记录失败");
  return FitDataSchema.parse(payload.data);
}

export function upsertLog(data: FitData, log: DailyLog): FitData {
  return { ...data, logs: [...data.logs.filter((item) => item.date !== log.date), log].sort((a, b) => a.date.localeCompare(b.date)) };
}

export function exportData(data: FitData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `fitlog-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<FitData> {
  return FitDataSchema.parse(JSON.parse(await file.text()));
}
