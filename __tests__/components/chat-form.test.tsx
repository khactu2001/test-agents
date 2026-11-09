import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { ChatForm } from "../../app/_components/chat-form";

afterEach(cleanup);

test("Enter while composing with an IME does not submit", () => {
  const action = vi.fn(async () => ({ error: null, sentAt: 1 }));
  render(<ChatForm action={action} />);
  const input = screen.getByLabelText("Tin nhắn");
  fireEvent.change(input, { target: { value: "xin chà" } });

  fireEvent.keyDown(input, { key: "Enter", isComposing: true });
  fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
  expect(action).not.toHaveBeenCalled();
});

test("Enter submits once and clears the input on success", async () => {
  const action = vi.fn(async () => ({ error: null, sentAt: 1 }));
  render(<ChatForm action={action} />);
  const input = screen.getByLabelText("Tin nhắn") as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: "xin chào" } });

  fireEvent.keyDown(input, { key: "Enter" });
  fireEvent.keyDown(input, { key: "Enter" });

  await waitFor(() => expect(input.value).toBe(""));
  expect(action).toHaveBeenCalledTimes(1);
});

test("keeps the draft and shows the error when the action fails", async () => {
  const action = vi.fn(async () => ({ error: "Lỗi thử", sentAt: 0 }));
  render(<ChatForm action={action} />);
  const input = screen.getByLabelText("Tin nhắn") as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: "nháp" } });

  fireEvent.keyDown(input, { key: "Enter" });

  expect(await screen.findByText("Lỗi thử")).toBeTruthy();
  expect(input.value).toBe("nháp");
});
