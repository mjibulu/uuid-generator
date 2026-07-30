import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("UUID v4 & v7 Generator", () => {
  it("generates a bounded batch and reformats the same identifiers", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Generate UUIDs" }));
    const output = screen.getByRole("textbox", { name: "Version 4 UUIDs" });
    const original = (output as HTMLTextAreaElement).value.split("\n");
    expect(original).toHaveLength(5);
    expect(original.every((value) => /^[0-9a-f-]{36}$/u.test(value))).toBe(true);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Output layout" }),
      "json",
    );
    const formatted = JSON.parse((output as HTMLTextAreaElement).value) as string[];
    expect(formatted).toEqual(original);
  });

  it("generates and inspects a UUIDv7 value", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("radio", { name: /Version 7/u }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "Generate UUIDs" }));
    await user.click(screen.getByRole("button", { name: "Inspect first UUID" }));

    expect(screen.getByText(/Valid UUID/u)).toHaveTextContent("version 7");
    expect(screen.getByText("Embedded time").nextElementSibling).not.toHaveTextContent(
      "Not present",
    );
  });
});
