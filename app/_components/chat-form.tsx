"use client";

import { useActionState, useEffect, useRef } from "react";
import type { SendMessageState } from "../actions";

type Props = {
  action: (prev: SendMessageState, formData: FormData) => Promise<SendMessageState>;
};

export function ChatForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, { error: null, sentAt: 0 });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.sentAt) formRef.current?.reset();
  }, [state.sentAt]);

  return (
    <form
      ref={formRef}
      action={formAction}
      style={{ display: "flex", gap: 8, padding: 16, borderTop: "1px solid #8884" }}
    >
      <label htmlFor="content" style={{ position: "absolute", left: -9999 }}>
        Tin nhắn
      </label>
      <textarea
        id="content"
        name="content"
        rows={2}
        required
        placeholder="Nhập tin nhắn…"
        style={{ flex: 1, padding: 8, font: "inherit", resize: "vertical" }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <button type="submit" disabled={pending} style={{ padding: "0 16px" }}>
        Gửi
      </button>
      {state.error ? (
        <p role="alert" style={{ color: "#dc2626", alignSelf: "center" }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
