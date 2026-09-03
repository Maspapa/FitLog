import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { checkDatabase, getFitData, replaceFitData } from "@/lib/server-store";
import type { DailyLog, FitData } from "@/lib/schemas";

const TOKEN_A = "a".repeat(48);
const TOKEN_B = "b".repeat(48);
let testDirectory = "";

function log(date: string, updatedAt: string, notes: string): DailyLog {
  return {
    date, weight: null, waist: null, workouts: [],
    meals: { breakfast: "", lunch: "", dinner: "", snacks: "" },
    sleepHours: null, fatigue: null, mood: null, soreness: null,
    waterGlasses: null, steps: null, alcohol: false, notes, updatedAt,
  };
}

function data(logs: DailyLog[]): FitData {
  return { version: 1, profile: { goal: "fat_loss", createdAt: "2026-08-01T00:00:00.000Z" }, logs };
}

beforeEach(() => {
  testDirectory = mkdtempSync(path.join(tmpdir(), "fitlog-store-"));
  process.env.FITLOG_DB_PATH = path.join(testDirectory, "fitlog.db");
  globalThis.__fitlogDatabase = undefined;
  checkDatabase();
});

afterEach(() => {
  globalThis.__fitlogDatabase?.close();
  globalThis.__fitlogDatabase = undefined;
  delete process.env.FITLOG_DB_PATH;
  rmSync(testDirectory, { recursive: true, force: true });
});

describe("shared FitLog storage", () => {
  it("merges legacy device vaults and returns the same data to every device", () => {
    const db = new DatabaseSync(process.env.FITLOG_DB_PATH!);
    const insertVault = db.prepare("INSERT INTO vaults (id_hash, profile, created_at, updated_at) VALUES (?, ?, ?, ?)");
    const profile = JSON.stringify(data([]).profile);
    insertVault.run("legacy-phone", profile, "2026-08-01T00:00:00.000Z", "2026-09-02T12:00:00.000Z");
    insertVault.run("legacy-desktop", profile, "2026-08-01T00:00:00.000Z", "2026-09-01T12:00:00.000Z");
    const insertLog = db.prepare("INSERT INTO daily_logs (vault_hash, log_date, payload, updated_at) VALUES (?, ?, ?, ?)");
    const desktopLog = log("2026-09-01", "2026-09-01T10:00:00.000Z", "desktop");
    const phoneLog = log("2026-09-02", "2026-09-02T11:00:00.000Z", "phone");
    insertLog.run("legacy-desktop", desktopLog.date, JSON.stringify(desktopLog), desktopLog.updatedAt);
    insertLog.run("legacy-phone", phoneLog.date, JSON.stringify(phoneLog), phoneLog.updatedAt);
    db.close();

    expect(getFitData(TOKEN_A).logs.map((item) => item.date)).toEqual(["2026-09-01", "2026-09-02"]);
    expect(getFitData(TOKEN_B)).toEqual(getFitData(TOKEN_A));
  });

  it("keeps newer server records when a stale device saves", () => {
    const fresh = log("2026-09-02", "2026-09-02T11:00:00.000Z", "newer server record");
    replaceFitData(TOKEN_A, data([fresh]));

    const stale = log("2026-09-02", "2026-09-02T09:00:00.000Z", "stale device record");
    const anotherDay = log("2026-09-03", "2026-09-03T09:00:00.000Z", "new day");
    const saved = replaceFitData(TOKEN_B, data([stale, anotherDay]));

    expect(saved.logs).toHaveLength(2);
    expect(saved.logs.find((item) => item.date === "2026-09-02")?.notes).toBe("newer server record");
    expect(saved.logs.find((item) => item.date === "2026-09-03")?.notes).toBe("new day");
  });
});
