"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "../lib/db";
import { insertMessage, MAX_MESSAGE_LENGTH } from "../lib/messages";

export type SendMessageState = { error: string | null; sentAt: number };

export async function sendMessage(
  _prev: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const content = formData.get("content");
  if (typeof content !== "string" || !content.trim()) {
    return { error: "Tin nhắn không được để trống.", sentAt: _prev.sentAt };
  }
  if (content.trim().length > MAX_MESSAGE_LENGTH) {
    return { error: `Tin nhắn tối đa ${MAX_MESSAGE_LENGTH} ký tự.`, sentAt: _prev.sentAt };
  }

  insertMessage(getDb(), { author: "user", content });
  revalidatePath("/");
  return { error: null, sentAt: Date.now() };
}
