# UUID v4 & v7 Generator

Generate, format, copy, download, and inspect bounded batches of UUIDv4 or time-ordered UUIDv7 identifiers in the browser.

[Features](#features) · [Usage](#usage) · [Run locally](#run-locally) · [Contributing](./.github/CONTRIBUTING.md) · [Licence](./LICENSE)

## Features

- Cryptographically random UUIDv4 and time-ordered UUIDv7 generation
- Quick batch presets plus bounded custom quantities
- One-per-line, comma-separated, JSON-array, and SQL-quoted list layouts
- Canonical, uppercase, compact, and braced value formatting without regenerating the batch
- Batch count and uniqueness reporting with clear and regenerate controls
- Copy and tool-named text-file downloads for the formatted batch
- UUID validation with version, RFC variant, canonical form, and UUIDv7 timestamp inspection

## Screenshot

![UUID v4 & v7 Generator screenshot](./public/tool-preview.webp)

## Usage

1. Select UUIDv4 for random identifiers or UUIDv7 for time-ordered identifiers.
2. Choose a count preset or enter the required bounded batch size.
3. Select the list layout and optional uppercase, compact, or brace formatting, then generate.
4. Change formatting without replacing the generated values, then copy, download, clear, or regenerate the batch.
5. Paste any UUID into the inspector, or send the first generated value there, to review validity, version, variant, canonical form, and timestamp details.

## Browser support

Works with current versions of Chrome/Chromium, Firefox, and Safari.

- UUID generation requires the browser Web Crypto API.
- Download behaviour follows the browser's normal file-download settings.

## Run locally

You’ll need Git, Corepack, and Node.js 22.13.x or 24.x.

```bash
git clone https://github.com/mjibulu/uuid-generator.git
cd uuid-generator
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

Open the local URL shown in the terminal.

## Checks

```bash
pnpm run check
pnpm run verify
```

## Build

```bash
pnpm run build
```

The production files are created in `dist/` and can be hosted on GitHub Pages, Netlify, Cloudflare Pages, Vercel, or any static host.

## Privacy

The app runs in your browser and does not include analytics, ads, or telemetry.

This tool does not require persistent browser storage.

This tool uses: crypto.getRandomValues, Blob downloads. Availability may vary by browser.

## Contributing

Issues and pull requests are welcome. See the [contribution guide](./.github/CONTRIBUTING.md) before submitting changes.

## Credits

Created by Mujeeb for [eBURP](https://eburp.com/).

## Licence

Licensed under the [MIT Licence](./LICENSE). Third-party dependencies keep their respective licences.
