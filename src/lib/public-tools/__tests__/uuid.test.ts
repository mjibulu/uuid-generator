import {
  formatUuids,
  generateUuids,
  generateUuidV7,
  parseUuid,
} from "../uuid";

describe("public UUID utilities", () => {
  it("generates unique RFC UUIDv4 values", () => {
    const values = generateUuids(10);
    expect(new Set(values).size).toBe(10);
    for (const value of values) {
      expect(value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
      );
    }
  });

  it("generates and inspects UUIDv7 timestamps", () => {
    const timestamp = Date.parse("2026-07-28T12:34:56.789Z");
    const value = generateUuidV7(timestamp);
    expect(parseUuid(value)).toMatchObject({
      valid: true,
      canonical: value,
      version: 7,
      variant: "RFC",
      timestamp: new Date(timestamp),
    });
    expect(parseUuid("not-a-uuid").valid).toBe(false);
  });

  it("reformats the existing values without regenerating them", () => {
    const values = [
      "123e4567-e89b-42d3-a456-426614174000",
      "123e4567-e89b-42d3-a456-426614174001",
    ];
    expect(
      formatUuids(values, {
        uppercase: true,
        hyphens: false,
        braces: true,
        format: "json",
      }),
    ).toBe(
      '[\n  "{123E4567E89B42D3A456426614174000}",\n  "{123E4567E89B42D3A456426614174001}"\n]',
    );
  });

  it("bounds batch sizes and supports compact and braced UUID input", () => {
    expect(generateUuids(0)).toHaveLength(1);
    expect(generateUuids(10_000)).toHaveLength(100);

    const canonical = "123e4567-e89b-42d3-a456-426614174000";
    expect(parseUuid(canonical.replaceAll("-", ""))).toMatchObject({
      valid: true,
      canonical,
      version: 4,
      variant: "RFC",
    });
    expect(parseUuid(`{${canonical}}`)).toMatchObject({
      valid: true,
      canonical,
    });
    expect(parseUuid(`{${canonical}`)).toMatchObject({ valid: false });
  });

  it("emits comma and SQL layouts and rejects invalid v7 times", () => {
    const values = [
      "123e4567-e89b-42d3-a456-426614174000",
      "123e4567-e89b-42d3-a456-426614174001",
    ];
    expect(formatUuids(values, { format: "comma" })).toBe(values.join(", "));
    expect(formatUuids(values, { format: "sql" })).toBe(
      values.map((value) => `'${value}'`).join(",\n"),
    );
    expect(() => generateUuidV7(-1)).toThrow(/48 unsigned bits/u);
    expect(() => generateUuidV7(Number.MAX_SAFE_INTEGER)).toThrow(
      /48 unsigned bits/u,
    );
  });
});
