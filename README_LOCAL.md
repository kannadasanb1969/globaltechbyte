# Global Tech Byte Website - Local Run

The uploaded ZIP contained an already-built React website rather than the original React `src/` project. This package keeps the existing React UI intact and adds a zero-dependency local server so it runs with `npm run start`.

## Run

```bash
npm run start
```

Open:

```text
http://localhost:3000/
```

No `npm install` is required because the local server uses only Node.js built-in modules.

## Routes

React Router SPA fallback is enabled, so routes such as `/about`, `/services`, `/work`, `/careers`, `/internships`, and `/contact` work when opened directly.

## Important

The original editable React component source (`src/`) was not present in the uploaded ZIP. This does not recreate missing source code; it makes the supplied compiled React website runnable locally via npm.
