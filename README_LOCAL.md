# Global Tech Byte Website

This package contains the supplied compiled React website configured for local use and Cloudflare Workers Static Assets.

## Local run

```bash
npm run start
```

Open `http://localhost:3000/`. The local server serves `public/` and supports SPA fallback for direct React routes.

## Cloudflare deploy

Install dependencies, then deploy:

```bash
npm install
npm run deploy
```

Wrangler deploys **only `public/`**. `node_modules`, `.git`, `.wrangler`, and local files are not part of the asset directory.

Worker name: `globaltechbyte`

Cloudflare SPA routing is handled by `assets.not_found_handling = single-page-application`; no `_redirects` file is needed.

## Recommended Cloudflare Git build settings

- Build command: `npm install`
- Deploy command: `npm run deploy`
- Root directory: `/`

The uploaded archive did not contain the original editable React `src/` source. The existing compiled website UI/assets are preserved.
