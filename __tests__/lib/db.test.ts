import { afterEach, describe, expect, test } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb, type Db } from "../../lib/db";
import { insertMessage, listMessages, MAX_MESSAGE_LENGTH } from "../../lib/messages";

const opened: Db[] = [];
function memoryDb() {
  const db = openDb(":memory:");
  opened.push(db);
  return db;
}
afterEach(() => {
  while (opened.length) opened.pop()!.close();
});

describe("schema migration", () => {
  test("creates messages, tasks and agent_state tables", () => {
    const db = memoryDb();
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
      .all()
      .map((row) => (row as { name: string }).name);
    expect(tables).toEqual(expect.arrayContaining(["messages", "tasks", "agent_state"]));
  });

  test("seeds an idle agent_state row for each of the 4 roles", () => {
    const rows = memoryDb().prepare("SELECT role, status FROM agent_state ORDER BY role").all();
    expect(rows).toEqual([
      { role: "developer", status: "idle" },
      { role: "lead", status: "idle" },
      { role: "qa", status: "idle" },
      { role: "reviewer", status: "idle" },
    ]);
  });

  test("creates the db file and its directory, and re-opening is idempotent", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-db-"));
    const file = path.join(dir, "nested", "chat.db");
    try {
      const first = openDb(file);
      insertMessage(first, { author: "user", content: "hello" });
      first.close();

      const second = openDb(file);
      opened.push(second);
      expect(listMessages(second).map((m) => m.content)).toEqual(["hello"]);
      expect(second.prepare("SELECT COUNT(*) AS n FROM agent_state").get()).toEqual({ n: 4 });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("messages", () => {
  test("insertMessage stores and returns the trimmed message", () => {
    const db = memoryDb();
    const message = insertMessage(db, { author: "user", content: "  xin chào  " }, 1000);
    expect(message).toEqual({ id: 1, author: "user", content: "xin chào", createdAt: 1000 });
    expect(listMessages(db)).toEqual([message]);
  });

  test("listMessages returns messages in chronological order", () => {
    const db = memoryDb();
    insertMessage(db, { author: "lead", content: "second" }, 2000);
    insertMessage(db, { author: "user", content: "first" }, 1000);
    insertMessage(db, { author: "qa", content: "third (same ts, later id)" }, 2000);
    expect(listMessages(db).map((m) => m.content)).toEqual([
      "first",
      "second",
      "third (same ts, later id)",
    ]);
  });

  test("rejects empty and oversized content", () => {
    const db = memoryDb();
    expect(() => insertMessage(db, { author: "user", content: "   " })).toThrow();
    expect(() =>
      insertMessage(db, { author: "user", content: "x".repeat(MAX_MESSAGE_LENGTH + 1) }),
    ).toThrow();
    expect(listMessages(db)).toEqual([]);
  });
});
