export type UuidVersion = 4 | 7;
export type UuidOutputFormat = "lines" | "comma" | "json" | "sql";

function uuidBytesToString(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  return uuidBytesToString(bytes);
}

export function generateUuidV7(timestamp = Date.now()): string {
  if (
    !Number.isSafeInteger(timestamp) ||
    timestamp < 0 ||
    timestamp > 0xffffffffffff
  ) {
    throw new Error("UUIDv7 timestamp must fit in 48 unsigned bits.");
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let remaining = timestamp;
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = remaining % 256;
    remaining = Math.floor(remaining / 256);
  }
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x70;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  return uuidBytesToString(bytes);
}

export function generateUuids(
  count: number,
  version: UuidVersion = 4,
): string[] {
  const safeCount = Math.min(100, Math.max(1, Math.floor(count || 1)));
  return Array.from({ length: safeCount }, () =>
    version === 7 ? generateUuidV7() : generateUuid(),
  );
}

export function formatUuids(
  values: string[],
  options: {
    uppercase?: boolean;
    hyphens?: boolean;
    braces?: boolean;
    format?: UuidOutputFormat;
  } = {},
): string {
  const {
    uppercase = false,
    hyphens = true,
    braces = false,
    format = "lines",
  } = options;
  const formatted = values.map((uuid) => {
    let value = hyphens ? uuid : uuid.replaceAll("-", "");
    if (uppercase) value = value.toUpperCase();
    return braces ? `{${value}}` : value;
  });
  if (format === "json") return JSON.stringify(formatted, null, 2);
  if (format === "sql") {
    return formatted.map((value) => `'${value}'`).join(",\n");
  }
  if (format === "comma") return formatted.join(", ");
  return formatted.join("\n");
}

export interface ParsedUuid {
  valid: boolean;
  canonical: string;
  version: number | null;
  variant: "RFC" | "NCS" | "Microsoft" | "reserved" | null;
  timestamp: Date | null;
}

export function parseUuid(value: string): ParsedUuid {
  let normalized = value.trim();
  if (normalized.startsWith("{") && normalized.endsWith("}")) {
    normalized = normalized.slice(1, -1);
  }
  const compactPattern = /^[0-9a-f]{32}$/iu;
  const canonicalPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
  if (!compactPattern.test(normalized) && !canonicalPattern.test(normalized)) {
    return {
      valid: false,
      canonical: "",
      version: null,
      variant: null,
      timestamp: null,
    };
  }

  const compact = normalized.replaceAll("-", "").toLowerCase();
  const canonical = `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
  const version = Number.parseInt(compact[12] ?? "", 16);
  const variantNibble = Number.parseInt(compact[16] ?? "", 16);
  const variant =
    variantNibble < 8
      ? "NCS"
      : variantNibble < 12
        ? "RFC"
        : variantNibble < 14
          ? "Microsoft"
          : "reserved";
  const timestamp =
    version === 7 && variant === "RFC"
      ? new Date(Number.parseInt(compact.slice(0, 12), 16))
      : null;
  return { valid: true, canonical, version, variant, timestamp };
}
