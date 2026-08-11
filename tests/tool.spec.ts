import { expect, test } from "@playwright/test";
import { createExternalRequestGuard } from "../src/lib/network-guard";

test("UUID generation, formatting, and inspection stay local", async ({
  page,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Playwright baseURL is required.");
  const networkGuard = createExternalRequestGuard(baseURL);
  page.on("request", (request) => networkGuard.inspect(request.url()));

  await page.goto("/");
  await page.getByRole("radio", { name: /Version 7/u }).check();
  await page.getByRole("button", { name: "5", exact: true }).click();
  await page.getByRole("button", { name: "Generate" }).click();

  const output = page.getByRole("textbox", { name: "Version 7 UUIDs" });
  const original = (await output.inputValue()).split("\n");
  expect(original).toHaveLength(5);

  await page.getByRole("combobox", { name: "Layout" }).selectOption("json");
  expect(JSON.parse(await output.inputValue())).toEqual(original);
  await page.getByRole("button", { name: "Inspect first" }).click();
  await expect(page.getByRole("status")).toContainText("v7");

  networkGuard.assertNoExternalRequests();
});
