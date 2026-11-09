import { Suspense } from "react";
import { sendMessage } from "./actions";
import { ChatForm } from "./_components/chat-form";
import { Messages } from "./_components/messages";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 800,
        height: "100vh",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 20, padding: 16, borderBottom: "1px solid #8884" }}>Test Agents</h1>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Suspense fallback={<p style={{ padding: 16, opacity: 0.6 }}>Đang tải…</p>}>
          <Messages />
        </Suspense>
      </div>
      <ChatForm action={sendMessage} />
    </main>
  );
}
