import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { MessageList } from "../../app/_components/message-list";
import { ROLES } from "../../lib/roles";

afterEach(cleanup);

test("shows an empty state when there are no messages", () => {
  render(<MessageList messages={[]} />);
  expect(screen.getByText("Chưa có tin nhắn nào.")).toBeTruthy();
});

test("renders messages in the given order with author label and color per role", () => {
  render(
    <MessageList
      messages={[
        { id: 1, author: "user", content: "làm giúp tôi X", createdAt: Date.UTC(2026, 0, 1, 9, 5) },
        { id: 2, author: "lead", content: "@Developer làm X", createdAt: Date.UTC(2026, 0, 1, 9, 6) },
      ]}
    />,
  );

  const items = screen.getAllByTestId("message");
  expect(items.map((item) => item.getAttribute("data-author"))).toEqual(["user", "lead"]);
  expect(within(items[0]).getByText("làm giúp tôi X")).toBeTruthy();
  expect(within(items[0]).getByText("Bạn")).toBeTruthy();

  const leadLabel = within(items[1]).getByText("Lead");
  expect(leadLabel.style.color).toBe("rgb(124, 58, 237)");
  expect(within(items[1]).getByText("@Developer làm X")).toBeTruthy();
});

test("every role has a label, initial and color", () => {
  for (const role of Object.values(ROLES)) {
    expect(role.label).toBeTruthy();
    expect(role.initial).toHaveLength(1);
    expect(role.color).toMatch(/^#[0-9a-f]{6}$/);
  }
});
