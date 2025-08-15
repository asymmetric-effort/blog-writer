# blog-writer

Free‑standing Electron + React + TypeScript desktop app for authoring blog posts as JSON in Git.

## Quickstart

> Requires Node.js **20.x** and npm **10.x** (see `.nvmrc`).

```bash
# install deps
npm ci

# start in development (Electron + renderer dev server)
npm run dev

# typecheck / lint / test
npm run typecheck
npm run lint
npm test

# build production app (electron-builder)
npm run build
