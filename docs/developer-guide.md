<!-- Copyright 2024 Blog Writer -->
# Developer Guide

This guide outlines the internal architecture of Blog Writer and conventions for contributing code.

## Architecture Overview

Blog Writer uses [Wails](https://wails.io) to combine a Go backend with a React + TypeScript frontend.

### Backend (Go)

Services are bound to the frontend via `wails.Run`:

- `RepoService` – open or create repositories and manage recent repos and settings.
- `GitService` – thin wrapper around the Git CLI for status, staging, commits, pulls (rebase), pushes, and branch operations.
- `ArticleService` – CRUD operations, ID allocation, validation, and autosave logic.
- `ImageService` – image conversion to sanitized SVG and Base64 encoding.
- `SchemaService` – validates article JSON against the schema and handles migrations.

### Frontend (React + TypeScript)

The frontend is a single‑page application served by Wails’ WebView. It provides:

- A WYSIWYG editor, metadata form, JSON preview, Git panel, and diagnostics area.
- LaTeX preview using a renderer such as KaTeX. TeX source is stored in `math` nodes.
- Calls to Go services via generated Wails bindings (e.g., `window.go.services.ArticleService.Save`).

### Security

The application uses only local assets. The Content‑Security‑Policy blocks remote code, and the SVG sanitizer removes scripts, external references, and nodes over configured limits.

## Repository Structure

```
repo-root/
  blog/                # article JSON files
  .blog-writer/        # settings
  blog-writer/         # application source
    frontend/          # React + TypeScript UI
    app.go             # Wails application setup
    main.go            # entry point
```

Article files are named with their Unix epoch second. Settings are stored in `.blog-writer/settings.json`.

## Coding Conventions

- **Modularity:** Organize code into focused packages and components.
- **Test‑Driven Development:** Write unit tests before implementing features.
- **Documentation:** Provide doc strings for all exported functions and types.
- **Copyright:** Each source file begins with the appropriate copyright comment.

## Extending the Program

1. Create or update Go services in the backend for new functionality.
2. Expose methods through Wails bindings and use them in the React frontend.
3. Maintain schema compatibility when altering the article format; include migration hooks if needed.
4. Validate new features with automated tests and update documentation accordingly.
