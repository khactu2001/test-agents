import { connection } from "next/server";
import { getDb } from "../../lib/db";
import { listMessages } from "../../lib/messages";
import { MessageList } from "./message-list";

export async function Messages() {
  await connection();
  return <MessageList messages={listMessages(getDb())} />;
}
