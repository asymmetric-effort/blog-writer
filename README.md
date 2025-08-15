<!-- Copyright 2024 Blog Writer -->
# Blog Writer

Blog Writer is an offline desktop editor for authoring blog posts as structured JSON files stored in Git repositories. It is built with Electron, React, and TypeScript.

## Prerequisites

- Node.js 24.2.0
- npm 11.4.2

## Development

```bash
npm ci
npm run dev
```

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Building

```bash
npm run build:renderer
npm run build
```

The application reads and writes articles under a `blog/` folder inside a Git repository. Saving commits changes using the Git CLI.
