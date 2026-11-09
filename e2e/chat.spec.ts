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
