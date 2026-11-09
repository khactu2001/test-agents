import { expect, test } from "@playwright/test";

test("sent message appears immediately and survives a reload", async ({ page }) => {
  const text = `e2e message ${Date.now()}`;
  await page.goto("/");

  await page.getByLabel("Tin nhắn").fill(text);
  await page.getByRole("button", { name: "Gửi" }).click();

  const message = page.getByTestId("message").filter({ hasText: text });
  await expect(message).toBeVisible();
  await expect(page.getByLabel("Tin nhắn")).toHaveValue("");

  await page.reload();
  await expect(page.getByTestId("message").filter({ hasText: text })).toBeVisible();
});

test("messages stay in the order they were sent", async ({ page }) => {
  const stamp = Date.now();
  await page.goto("/");

  for (const label of ["one", "two"]) {
    await page.getByLabel("Tin nhắn").fill(`order ${stamp} ${label}`);
    await page.getByRole("button", { name: "Gửi" }).click();
    await expect(page.getByTestId("message").filter({ hasText: `order ${stamp} ${label}` })).toBeVisible();
  }

  await page.reload();
  const texts = await page.getByTestId("message").filter({ hasText: `order ${stamp}` }).allInnerTexts();
  expect(texts[0]).toContain("one");
  expect(texts[1]).toContain("two");
});

test("pressing Enter twice quickly sends the message only once", async ({ page }) => {
  const text = `double enter ${Date.now()}`;
  await page.goto("/");

  const input = page.getByLabel("Tin nhắn");
  await input.fill(text);
  await input.press("Enter");
  await input.press("Enter");
  await expect(page.getByTestId("message").filter({ hasText: text })).toBeVisible();
  await expect(input).toHaveValue("");

  await page.reload();
  await expect(page.getByTestId("message").filter({ hasText: text })).toHaveCount(1);
});

test("a rejected message shows an error and keeps what was typed", async ({ page }) => {
  await page.goto("/");

  const input = page.getByLabel("Tin nhắn");
  await input.fill("   ");
  await page.getByRole("button", { name: "Gửi" }).click();

  await expect(page.getByText("Tin nhắn không được để trống.")).toBeVisible();
  await expect(input).toHaveValue("   ");
});

test("the textarea limits input to the maximum message length", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Tin nhắn")).toHaveAttribute("maxlength", "10000");
});
