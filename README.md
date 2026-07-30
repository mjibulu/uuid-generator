# UUID v4 & v7 Generator

Generate, format, copy, download, and inspect bounded batches of UUIDv4 or time-ordered UUIDv7 identifiers in the browser.

## Features

- Cryptographically random UUIDv4 and time-ordered UUIDv7 generation
- Quick batch presets plus bounded custom quantities
- One-per-line, comma-separated, JSON-array, and SQL-quoted list layouts
- Canonical, uppercase, compact, and braced value formatting without regenerating the batch
- Batch count and uniqueness reporting with clear and regenerate controls
- Copy and tool-named text-file downloads for the formatted batch
- UUID validation with version, RFC variant, canonical form, and UUIDv7 timestamp inspection

## Screenshot

![UUID v4 & v7 Generator interface](./public/tool-preview.webp)

## How to use

1. Select UUIDv4 for random identifiers or UUIDv7 for time-ordered identifiers.
2. Choose a count preset or enter the required bounded batch size.
3. Select the list layout and optional uppercase, compact, or brace formatting, then generate.
4. Change formatting without replacing the generated values, then copy, download, clear, or regenerate the batch.
5. Paste any UUID into the inspector, or send the first generated value there, to review validity, version, variant, canonical form, and timestamp details.

## Browser support and limitations

The current stable releases of Chromium, Firefox, and Safari are supported.

- UUID generation requires the browser Web Crypto API.
- Download behaviour follows the browser's normal file-download settings.

## Run locally

Requirements:

- Node.js 24.x
- Corepack

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

## Verify

Fast checks:

```bash
pnpm run check
```

Complete browser verification:

```bash
pnpm run verify
```

## Build and host

```bash
pnpm run build
```

Upload the contents of `dist/` to a static host. The application supports both
root and subdirectory hosting and needs no environment variables.

The same output can be deployed with GitHub Pages, Netlify, Cloudflare Pages,
Vercel static hosting, or an ordinary file upload.

## Data and network behaviour

The application ships without analytics or telemetry. Tool processing occurs
in the browser, and the primary browser tests fail unexpected external
requests. See [PRIVACY.md](./PRIVACY.md) for the storage and browser API
inventory.

## Contributing

Issues and pull requests are welcome. Read
[CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a change.

## Credits

Created by M. Jibulu for [eBURP](https://eburp.com/).

## Licence

Original code is available under the [MIT Licence](./LICENSE). Dependencies and
assets retain their own licences; see
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
