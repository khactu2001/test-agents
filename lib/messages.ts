import type { Db } from "./db";
import { isRoleId, type RoleId } from "./roles";

export const MAX_MESSAGE_LENGTH = 10_000;

export type Message = {
  id: number;
  author: RoleId;
  content: string;
  createdAt: number;
};

type MessageRow = {
  id: number;
  author: string;
  content: string;
  created_at: number;
};

function toMessage(row: MessageRow): Message {
  if (!isRoleId(row.author)) throw new Error(`Unknown message author: ${row.author}`);
  return { id: row.id, author: row.author, content: row.content, createdAt: row.created_at };
}

export function insertMessage(
  db: Db,
  input: { author: RoleId; content: string },
  now: number = Date.now(),
): Message {
  const content = input.content.trim();
  if (!content) throw new Error("Message content must not be empty");
  if (content.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message content must not exceed ${MAX_MESSAGE_LENGTH} characters`);
  }
  const result = db
    .prepare("INSERT INTO messages (author, content, created_at) VALUES (?, ?, ?)")
    .run(input.author, content, now);
  return { id: Number(result.lastInsertRowid), author: input.author, content, createdAt: now };
}

export function listMessages(db: Db): Message[] {
  const rows = db
    .prepare("SELECT id, author, content, created_at FROM messages ORDER BY created_at ASC, id ASC")
    .all() as MessageRow[];
  return rows.map(toMessage);
}
