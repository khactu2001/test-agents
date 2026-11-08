import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../app/page";

test("home page renders the Test Agents heading", () => {
  render(<Home />);
  const heading = screen.getByRole("heading", { level: 1, name: "Test Agents" });
  expect(heading).toBeTruthy();
});
