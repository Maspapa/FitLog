import "server-only";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { FitDataSchema, type FitData } from "./schemas";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,128}$/;

declare global {
  var __fitlogDatabase: DatabaseSync | undefined;
}

function database(): DatabaseSync {
  if (globalThis.__fitlogDatabase) return globalThis.__fitlogDatabase;
  const file = process.env.FITLOG_DB_PATH || path.join(process.cwd(), ".runtime", "fitlog.db");
  mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS vaults (
      id_hash TEXT PRIMARY KEY,
      profile TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS daily_logs (
      vault_hash TEXT NOT NULL,
      log_date TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (vault_hash, log_date),
      FOREIGN KEY (vault_hash) REFERENCES vaults(id_hash) ON DELETE CASCADE
    );
  `);
  globalThis.__fitlogDatabase = db;
  return db;
}

export function tokenFromRequest(request: Request): string | null {
  const token = request.headers.get("x-fitlog-token") || "";
  return TOKEN_PATTERN.test(token) ? token : null;
}

function tokenHash(token: string): string { return createHash("sha256").update(token).digest("hex"); }

export function getFitData(token: string): FitData {
  const db = database(); const hash = tokenHash(token);
  const row = db.prepare("SELECT profile FROM vaults WHERE id_hash = ?").get(hash) as { profile: string } | undefined;
  if (!row) {
    const now = new Date().toISOString();
    const profile = { goal: "fat_loss" as const, createdAt: now };
    db.prepare("INSERT INTO vaults (id_hash, profile, created_at, updated_at) VALUES (?, ?, ?, ?)").run(hash, JSON.stringify(profile), now, now);
    return { version: 1, profile, logs: [] };
  }
  const logs = db.prepare("SELECT payload FROM daily_logs WHERE vault_hash = ? ORDER BY log_date").all(hash) as Array<{ payload: string }>;
  return FitDataSchema.parse({ version: 1, profile: JSON.parse(row.profile), logs: logs.map((item) => JSON.parse(item.payload)) });
}

export function replaceFitData(token: string, input: FitData): FitData {
  const data = FitDataSchema.parse(input); const db = database(); const hash = tokenHash(token); const now = new Date().toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`INSERT INTO vaults (id_hash, profile, created_at, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(id_hash) DO UPDATE SET profile=excluded.profile, updated_at=excluded.updated_at`)
      .run(hash, JSON.stringify(data.profile), data.profile.createdAt, now);
    db.prepare("DELETE FROM daily_logs WHERE vault_hash = ?").run(hash);
    const insert = db.prepare("INSERT INTO daily_logs (vault_hash, log_date, payload, updated_at) VALUES (?, ?, ?, ?)");
    for (const log of data.logs) insert.run(hash, log.date, JSON.stringify(log), log.updatedAt);
    db.exec("COMMIT");
    return data;
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}

export function checkDatabase(): boolean { database().prepare("SELECT 1 AS ok").get(); return true; }
