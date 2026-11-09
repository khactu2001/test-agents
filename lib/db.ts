import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { AGENT_ROLE_IDS } from "./roles";

export type Db = Database.Database;

export const DEFAULT_DB_PATH = "./data/chat.db";

const MIGRATIONS: string[] = [
  `
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL CHECK (author IN ('user', 'lead', 'developer', 'reviewer', 'qa')),
    content TEXT NOT NULL,
    task_id INTEGER REFERENCES tasks(id),
    created_at INTEGER NOT NULL
  );
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    assignee TEXT NOT NULL CHECK (assignee IN ('lead', 'developer', 'reviewer', 'qa')),
    status TEXT NOT NULL DEFAULT 'queued'
      CHECK (status IN ('queued', 'running', 'done', 'failed', 'cancelled')),
    source_message_id INTEGER REFERENCES messages(id),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE agent_state (
    role TEXT PRIMARY KEY CHECK (role IN ('lead', 'developer', 'reviewer', 'qa')),
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'working')),
    current_task_id INTEGER REFERENCES tasks(id),
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX idx_tasks_assignee_status ON tasks(assignee, status);
  `,
];

export function migrate(db: Db): void {
  const current = db.pragma("user_version", { simple: true }) as number;
  for (let version = current; version < MIGRATIONS.length; version++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[version]);
      db.pragma(`user_version = ${version + 1}`);
    })();
  }

  const seed = db.prepare(
    "INSERT OR IGNORE INTO agent_state (role, status, updated_at) VALUES (?, 'idle', ?)",
  );
  const now = Date.now();
  for (const role of AGENT_ROLE_IDS) seed.run(role, now);
}

export function openDb(filename: string): Db {
  if (filename !== ":memory:") {
    fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
  }
  const db = new Database(filename);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

const globalForDb = globalThis as unknown as { __chatDb?: Db };

export function getDb(): Db {
  globalForDb.__chatDb ??= openDb(process.env.CHAT_DB_PATH || DEFAULT_DB_PATH);
  return globalForDb.__chatDb;
}
