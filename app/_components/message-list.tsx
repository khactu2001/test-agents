import type { Message } from "../../lib/messages";
import { ROLES } from "../../lib/roles";
import { RoleAvatar } from "./role-avatar";
import { ScrollAnchor } from "./scroll-anchor";

const timeFormat = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return <p style={{ opacity: 0.6, padding: 16 }}>Chưa có tin nhắn nào.</p>;
  }

  return (
    <>
    <ol
      aria-label="Lịch sử chat"
      style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, padding: 16 }}
    >
      {messages.map((message) => {
        const role = ROLES[message.author];
        return (
          <li
            key={message.id}
            data-testid="message"
            data-author={message.author}
            style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
          >
            <RoleAvatar role={message.author} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <strong style={{ color: role.color }}>{role.label}</strong>
                <time
                  dateTime={new Date(message.createdAt).toISOString()}
                  style={{ fontSize: 12, opacity: 0.6 }}
                >
                  {timeFormat.format(message.createdAt)} UTC
                </time>
              </div>
              <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message.content}</p>
            </div>
          </li>
        );
      })}
    </ol>
    <ScrollAnchor trigger={messages.length} />
    </>
  );
}
