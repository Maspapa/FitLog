import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { FitDataSchema, type FitData } from "./schemas";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,128}$/;
const SHARED_VAULT_HASH = "shared-v1";

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

function ensureSharedVault(db: DatabaseSync): void {
  const existing = db.prepare("SELECT 1 FROM vaults WHERE id_hash = ?").get(SHARED_VAULT_HASH);
  if (existing) return;

  db.exec("BEGIN IMMEDIATE");
  try {
    const current = db.prepare("SELECT 1 FROM vaults WHERE id_hash = ?").get(SHARED_VAULT_HASH);
    if (!current) {
      const latest = db.prepare(`
        SELECT profile, created_at
        FROM vaults
        WHERE EXISTS (SELECT 1 FROM daily_logs WHERE vault_hash = vaults.id_hash)
        ORDER BY updated_at DESC
        LIMIT 1
      `).get() as { profile: string; created_at: string } | undefined;
      const now = new Date().toISOString();
      const profile = latest ? JSON.parse(latest.profile) : { goal: "fat_loss", createdAt: now };
      db.prepare("INSERT INTO vaults (id_hash, profile, created_at, updated_at) VALUES (?, ?, ?, ?)")
        .run(SHARED_VAULT_HASH, JSON.stringify(profile), latest?.created_at ?? now, now);

      const legacyLogs = db.prepare(`
        SELECT log_date, payload, updated_at
        FROM daily_logs
        WHERE vault_hash <> ?
        ORDER BY updated_at
      `).all(SHARED_VAULT_HASH) as Array<{ log_date: string; payload: string; updated_at: string }>;
      const merge = db.prepare(`
        INSERT INTO daily_logs (vault_hash, log_date, payload, updated_at) VALUES (?, ?, ?, ?)
        ON CONFLICT(vault_hash, log_date) DO UPDATE SET
          payload = excluded.payload,
          updated_at = excluded.updated_at
        WHERE excluded.updated_at >= daily_logs.updated_at
      `);
      for (const log of legacyLogs) merge.run(SHARED_VAULT_HASH, log.log_date, log.payload, log.updated_at);
    }
    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}

export function getFitData(token: string): FitData {
  void token;
  const db = database();
  ensureSharedVault(db);
  const row = db.prepare("SELECT profile FROM vaults WHERE id_hash = ?").get(SHARED_VAULT_HASH) as { profile: string };
  const logs = db.prepare("SELECT payload FROM daily_logs WHERE vault_hash = ? ORDER BY log_date").all(SHARED_VAULT_HASH) as Array<{ payload: string }>;
  return FitDataSchema.parse({ version: 1, profile: JSON.parse(row.profile), logs: logs.map((item) => JSON.parse(item.payload)) });
}

export function replaceFitData(token: string, input: FitData): FitData {
  const data = FitDataSchema.parse(input); const db = database(); const now = new Date().toISOString();
  ensureSharedVault(db);
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`INSERT INTO vaults (id_hash, profile, created_at, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(id_hash) DO UPDATE SET profile=excluded.profile, updated_at=excluded.updated_at`)
      .run(SHARED_VAULT_HASH, JSON.stringify(data.profile), data.profile.createdAt, now);
    const merge = db.prepare(`
      INSERT INTO daily_logs (vault_hash, log_date, payload, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(vault_hash, log_date) DO UPDATE SET
        payload = excluded.payload,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= daily_logs.updated_at
    `);
    for (const log of data.logs) merge.run(SHARED_VAULT_HASH, log.date, JSON.stringify(log), log.updatedAt);
    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); throw error; }
  return getFitData(token);
}

export function checkDatabase(): boolean { database().prepare("SELECT 1 AS ok").get(); return true; }
