<!-- Copyright 2024 Blog Writer -->
# User Guide

Blog Writer is an offline desktop editor for authoring blog articles as JSON files inside a Git repository.

## Getting Started

1. **Launch Blog Writer.** On first run a wizard appears with three choices:
   - **Open existing repo** – choose a folder containing a `.git` directory.
   - **Open recent repo** – select from your most recently opened repositories.
   - **Create local repo from remote** – provide a GitHub SSH URL and a local path. The app runs `git init`, adds the remote, optionally fetches, creates `blog/` and `.blog-writer/`, makes an initial commit, and can push to the remote.

2. **Repository layout**
   - Articles live under `blog/` and are named by the Unix epoch second of creation, e.g. `blog/1755288225.json`.
   - Settings are stored in `.blog-writer/settings.json`.

## Editing Articles

- The editor supports headings, paragraphs, inline formatting (`b`, `i`, `u`, `strong`, `em`, `code`, `sub`, `sup`, `s`, `mark`, `small`), line breaks, lists, quotes, horizontal rules, code blocks, tables, semantic containers, math, and embedded SVG images.
- Images are vectorized when needed, sanitized, and stored as Base64‑encoded data URIs.
- Math is entered as TeX and previewed in the app.

## Saving and Version Control

- **Autosave** writes changes to disk every 15 seconds and on blur without committing.
- **Save** writes the file and creates a Git commit with the message `chore(article): <id> <title> [create|update|delete]`.
- All Git operations are performed using the Git CLI; status, stage, commit, pull (rebase), push, and branch operations are available through the interface.

## Validating Content

Articles are validated against the project's JSON schema before committing. Invalid content blocks the commit and surfaces actionable diagnostics in the UI.

## Working Offline

Blog Writer is fully offline. All assets are local, and the Content‑Security‑Policy forbids remote code execution.
