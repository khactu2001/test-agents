import { expect, test } from "@playwright/test";

test("home page shows the Test Agents heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Test Agents" })).toBeVisible();
});
