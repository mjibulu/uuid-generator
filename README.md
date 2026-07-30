# UUID v4 & v7 Generator

Generate, format, copy, download, and inspect bounded batches of UUIDv4 or time-ordered UUIDv7 identifiers in the browser.

## Features

- Cryptographically random UUIDv4 and time-ordered UUIDv7 generation
- Batch presets and bounded custom counts
- Canonical, compact, braced, JSON, SQL, line, and comma formats
- Batch uniqueness reporting, copy, and download
- UUID validation with version, variant, and timestamp inspection

## Screenshot

![UUID v4 & v7 Generator interface](./public/tool-preview.webp)

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
