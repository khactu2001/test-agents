"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import type { SendMessageState } from "../actions";
import { MAX_MESSAGE_LENGTH } from "../../lib/messages";

type Props = {
  action: (prev: SendMessageState, formData: FormData) => Promise<SendMessageState>;
};

export function ChatForm({ action }: Props) {
  const [content, setContent] = useState("");
  const [state, formAction, pending] = useActionState(
    async (prev: SendMessageState, formData: FormData) => {
      const next = await action(prev, formData);
      if (!next.error) setContent("");
      return next;
    },
    { error: null, sentAt: 0 },
  );
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!pending) submittingRef.current = false;
  }, [pending]);

  return (
    <form
      onSubmit={(event) => {
        // Submit via transition instead of `action={...}`: React auto-resets
        // action forms, which would wipe the draft when the server rejects it.
        event.preventDefault();
        if (submittingRef.current) return;
        submittingRef.current = true;
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
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
        maxLength={MAX_MESSAGE_LENGTH}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Nhập tin nhắn…"
        style={{ flex: 1, padding: 8, font: "inherit", resize: "vertical" }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing || event.keyCode === 229) return;
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
