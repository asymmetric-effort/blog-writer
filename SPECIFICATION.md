# SPECIFICATION.md — blog-writer (v1.1 Draft, Go + Wails)

| KEY        | VALUE                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Artifact   | Free‑standing **Go + Wails** desktop application with **React + TypeScript** frontend           |
| OS/Arch    | Windows, Linux, macOS — x64 (amd64) and arm64                                                   |
| Scope      | Offline WYSIWYG editor for authoring blog articles as JSON files in a Git repo                  |
| Save model | **Save = write + Git commit** (Autosave = write only, configurable)                             |
| Media      | Images converted to **sanitized SVG** and **embedded as Base64 data URIs**                      |
| Math       | LaTeX (inline & display) stored as TeX source in `math` nodes; previewed in‑app (renderer only) |

---

## 1. Product Overview

* **Users:** Engineers/writers who prefer file‑based content under source control.
* **Primary actions:** Create/edit/delete articles; validate JSON; commit/push via Git.
* **Source of truth:** The Git repository. Import/export not required in v1.

### 1.1 Launch Experience (Repo Wizard)

On startup the app presents a wizard with three choices:

1. **Open existing repo** (select local folder containing `.git`).
2. **Open recent repo** (pick from the last N local repos).
3. **Create local repo from remote**:

  * Inputs: **GitHub SSH URL** (e.g. `git@github.com:org/repo.git`) and **local path**.
  * Actions: `git init` → `git remote add origin <ssh-url>` → optional `git fetch` → create `blog/` and `.blog-writer/` → initial commit → optional `git push -u origin <branch>`.

Once a repository is opened or created, the application navigates to the editor view where users can author content using a React-based WYSIWYG editor.

---

## 2. Architecture (Go + Wails)

**Backend (Go / Wails)**

* Single Go app using Wails v2.
* Services (registered via `wails.Run` `Bind:`):

  * `RepoService` — open/create repo; recent repos; settings read/write.
  * `GitService` — thin wrapper over `git` CLI: status, stage, commit, pull(rebase), push, branch ops.
  * `ArticleService` — CRUD for articles; numbering/ID allocation; validation; autosave.
  * `ImageService` — image conversion to SVG; sanitization; Base64 data‑URI encoding.
  * `SchemaService` — JSON Schema validator (AJV via embedded Node, or Go validator); migration hooks.

**Frontend (React + TypeScript)**

* WYSIWYG editor powered by **React Quill**, metadata form, JSON preview, Git panel, diagnostics.
* LaTeX preview (e.g., KaTeX) — preview only; persisted payload is TeX string.

**Bindings**

* Go methods are exposed to TS via Wails binding (e.g., `window.go.services.ArticleService.Save(...)`).
* No Node.js process at runtime; the frontend is a bundled SPA served by Wails’ WebView.

**Security**

* Local assets only; Content‑Security‑Policy forbids remote code.
* SVG sanitizer strips `script`, `foreignObject`, external refs.
* Size/node‑count limits for embedded SVGs enforced in `ImageService`.

> **Windows runtime note:** Requires WebView2 runtime. The installer/first‑run flow should check and prompt if missing.

---

## 3. Repository Layout & Article IDs

```
repo-root/
  blog/
    1755288225.json
    1755288226.json
    subject/
      1755288227.json
      1755288228.json
  .blog-writer/
    settings.json
```

* **Article ID / filename:** Unix epoch seconds at creation time (as string). On collision, wait up to 2s, then increment `+1s` until free.
* **Scanning rule:** Load all `blog/**/<epoch>.json` files.

### 3.1 Repository Settings (`.blog-writer/settings.json`)

```json
{
  "schemaVersion": 1,
  "defaultAuthor": "",
  "defaultKeywords": [],
  "defaultBranch": "main",
  "remote": "",
  "preCommitValidate": true,
  "maxEmbeddedSvgBytes": 10485760,
  "maxSvgNodeCount": 100000,
  "imageVectorization": { "mode": "auto", "threshold": 0.6, "colors": 8 },
  "autosave": { "enabled": true, "intervalMs": 15000 }
}
```

---

## 4. Canonical JSON Data Model (Concise `tag` Schema)

Each node uses a **`tag`** discriminator and a **`content`** field (string or `Node[]`). Additional attributes are tag‑specific.

### 4.1 File Envelope

```json
{
  "version": "<semver>",
  "metadata": {
    "title": "string",
    "author": "string",
    "description": "string",
    "publicationDate": "RFC3339 string",
    "updatedDate": "RFC3339 string",
    "keywords": ["string"]
  },
  "document": ["Node"]
}
```

### 4.2 Supported Tags (v1)

* **Headings:** `h1` | `h2` | `h3` | `h4` | `h5` → `{ tag:"h1".."h5", content: Node[] }`
* **Paragraph:** `p` → `{ tag:"p", content: Node[] }`
* **Inline text:** `span` → `{ tag:"span", content: string }`
* **Inline emphasis/presentation:** `b`, `i`, `u`, `strong`, `em`, `code`, `sub`, `sup`, `s`, `mark`, `small` → `{ tag:<name>, content: Node[]|string }`
* **Line break:** `br` → `{ tag:"br" }`
* **Math (LaTeX):** Inline `{ tag:"math", mode:"inline", content: string }`; Display `{ tag:"math", mode:"display", content: string, numbered?: boolean, label?: string }`
* **Image (embedded SVG):** `{ tag:"img", url:"data:image/svg+xml;base64,<...>", alt?: string }`
* **Quote:** `blockquote` → `{ tag:"blockquote", content: Node[] }`
* **Lists:** `ol`/`ul` containers (optional `start`), `li` items.
* **Code block:** `pre` → `{ tag:"pre", lang?: string, content: string }`
* **Rule:** `hr` → `{ tag:"hr" }`
* **Tables (optional):** `table` → `tr` → `th`/`td` with `content: Node[]`.
* **HTML5 semantic containers:** `header`, `footer`, `main`, `section`, `article`, `aside`, `nav`, `figure`, `figcaption`, `time` (with optional `datetime`).

### 4.3 Canonical Example

```json
{
  "version": "1.0.0",
  "metadata": {
    "title": "Sample with Math & Semantics",
    "author": "Sam Caldwell",
    "description": "Inline b/i/u, br, img, HTML5 semantics, and LaTeX.",
    "publicationDate": "2025-08-15T00:00:00Z",
    "updatedDate": "2025-08-15T00:00:00Z",
    "keywords": ["intro", "math", "latex", "semantics"]
  },
  "document": [
    {"tag":"header","content":[{"tag":"h1","content":[{"tag":"span","content":"LaTeX Demo"}]}]},
    {"tag":"section","content":[
      {"tag":"p","content":[
        {"tag":"span","content":"Einstein's equation "},
        {"tag":"math","mode":"inline","content":"E=mc^2"},
        {"tag":"span","content":" relates mass and energy."},
        {"tag":"br"}
      ]},
      {"tag":"math","mode":"display","content":"\\int_{-\\infty}^{\\infty} e^{-x^2} \\; dx = \\sqrt{\\pi}","numbered":true,"label":"eq:gaussian"}
    ]},
    {"tag":"figure","content":[
      {"tag":"img","url":"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PC9zdmc+","alt":"diagram"},
      {"tag":"figcaption","content":[{"tag":"span","content":"Gaussian integral diagram"}]}
    ]},
    {"tag":"article","content":[
      {"tag":"p","content":[
        {"tag":"span","content":"Inline code example: "},
        {"tag":"code","content":[{"tag":"span","content":"x = y * z;"}]}
      ]},
      {"tag":"pre","lang":"cpp","content":"// example\nint main(){return 0;}"}
    ]},
    {"tag":"footer","content":[{"tag":"time","datetime":"2025-08-15T00:00:00Z","content":"Updated"}]}
  ]
}
```

---

## 5. JSON Schema (Concise; strict where needed)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["version", "metadata", "document"],
  "properties": {
    "version": { "type": "string" },
    "metadata": {
      "type": "object",
      "required": ["title", "author", "description", "publicationDate", "updatedDate", "keywords"],
      "properties": {
        "title": { "type": "string", "minLength": 1 },
        "author": { "type": "string", "minLength": 1 },
        "description": { "type": "string" },
        "publicationDate": { "type": "string", "format": "date-time" },
        "updatedDate": { "type": "string", "format": "date-time" },
        "keywords": { "type": "array", "items": { "type": "string" } }
      }
    },
    "document": { "type": "array", "items": { "$ref": "#/defs/node" } }
  },
  "defs": {
    "node": {
      "type": "object",
      "required": ["tag"],
      "properties": {
        "tag": { "type": "string", "enum": [
          "h1", "h2", "h3", "h4", "h5",
          "p", "span",
          "b", "i", "u", "strong", "em", "code", "sub", "sup", "s", "mark", "small",
          "br",
          "math",
          "img",
          "blockquote", "ol", "ul", "li",
          "pre", "hr",
          "table", "tr", "th", "td",
          "header", "footer", "main", "section", "article", "aside", "nav", "figure", "figcaption", "time"
        ] },
        "content": {},
        "mode": { "type": "string", "enum": ["inline", "display"] },
        "numbered": { "type": "boolean" },
        "label": { "type": "string" },
        "alt": { "type": "string" },
        "url": { "type": "string", "pattern": "^data:image/svg\\+xml;base64,[A-Za-z0-9+/=]+$" },
        "lang": { "type": "string" },
        "start": { "type": "integer", "minimum": 1 },
        "datetime": { "type": "string" }
      },
      "allOf": [
        { "if": { "properties": { "tag": { "const": "br" } } }, "then": { "not": { "required": ["content"] } } },
        { "if": { "properties": { "tag": { "const": "img" } } }, "then": { "required": ["url"] } },
        { "if": { "properties": { "tag": { "const": "math" } } }, "then": { "required": ["mode", "content"] } },
        { "if": { "properties": { "tag": { "enum": ["h1","h2","h3","h4","h5","p","blockquote","ol","ul","li","pre","table","tr","th","td","header","footer","main","section","article","aside","nav","figure","figcaption"] } } },
          "then": { "properties": { "content": { "type": ["array", "string", "null"] } } } }
      ]
    }
  }
}
```

---

## 6. Image Conversion & Sanitization

**Inputs:** PNG, JPEG, GIF, WebP, SVG, PDF (single page)

**Pipeline:**

1. Vectorize raster/PDF to SVG (Potrace‑like for line art; optional color quantization for limited palettes).
2. Sanitize SVG: remove `script`, external `image` hrefs, `foreignObject`; whitelist core attributes (`d`, `fill`, `stroke`, `stroke-width`, `transform`, `viewBox`, `width`, `height`, `id`, `class`, constrained `style`).
3. Minify.
4. Base64‑encode and embed as `url` in `img` node.
5. Enforce size/node limits; warn on photographic content fidelity.

---

## 7. Git Integration & Save Semantics

* **Autosave** = write only (no commit): defaults to enabled every **15s** and on window blur.
* **Save** button = write + commit. Default message:
  `chore(article): <id> <title> [create|update|delete]`.
* **Git panel:** status, staged files, commit/amend, branch switch, pull (rebase), push, side‑by‑side JSON diff.
* **Safety:** Pre‑commit validation (schema + SVG sanitation + Base64 pattern). Block commit/push on invalid state with diagnostics.
* **Conflicts:** If working tree changed, offer a 3‑way JSON merge with semantic assistance (per‑node diffs for arrays).

---

## 8. Backend API (Go) & Frontend Bindings

### 8.1 Go Services (signatures)

```go
// RepoService manages repository selection/creation and settings.
// Methods are bound to the frontend via Wails.
type RepoService struct{}

// StartupSelectOrCreateRepo opens the wizard and returns the resolved repo config.
func (s *RepoService) StartupSelectOrCreateRepo() (RepoConfig, error) { /* ... */ }

// CreateLocalRepoFromRemote initializes a local repo from an SSH remote at a path.
func (s *RepoService) CreateLocalRepoFromRemote(sshURL, localPath, defaultBranch string) (RepoConfig, error) { /* ... */ }

// SelectExistingRepo prompts for a local repo path and returns its config.
func (s *RepoService) SelectExistingRepo() (RepoConfig, error) { /* ... */ }

// GetRepoConfig returns the active repo configuration.
func (s *RepoService) GetRepoConfig() (RepoConfig, error) { /* ... */ }

// SetRepoConfig persists repo configuration changes.
func (s *RepoService) SetRepoConfig(cfg RepoConfig) error { /* ... */ }

// ArticleService handles CRUD for articles.
type ArticleService struct{}

// ListArticles returns article indexes.
func (a *ArticleService) ListArticles() ([]ArticleIndex, error) { /* ... */ }

// ReadArticle loads an article by ID (epoch seconds).
func (a *ArticleService) ReadArticle(id string) (Article, error) { /* ... */ }

// SaveArticle validates and writes an article, then commits it if requested.
func (a *ArticleService) SaveArticle(article Article, commit bool) error { /* ... */ }

// DeleteArticle soft-deletes an article by ID and commits the change.
func (a *ArticleService) DeleteArticle(id string) error { /* ... */ }

// ImageService converts and sanitizes images to embedded SVG data URIs.
type ImageService struct{}

// ConvertImageToEmbeddedSVG reads a file and returns a data URI (data:image/svg+xml;base64,...).
func (i *ImageService) ConvertImageToEmbeddedSVG(path string) (string, error) { /* ... */ }

// SanitizeSVG cleans raw SVG markup and returns safe SVG markup.
func (i *ImageService) SanitizeSVG(svg string) (string, error) { /* ... */ }

// GitService wraps git commands.
type GitService struct{}

func (g *GitService) Status() (GitStatus, error)           { /* ... */ }
func (g *GitService) Commit(message string, amend bool) error { /* ... */ }
func (g *GitService) PullRebase() error                      { /* ... */ }
func (g *GitService) Push() error                            { /* ... */ }
```

### 8.2 Frontend (TS) Bindings (example)

```ts
// Example calls via Wails binding
await window.go.services.RepoService.StartupSelectOrCreateRepo();
const list = await window.go.services.ArticleService.ListArticles();
const dataUri = await window.go.services.ImageService.ConvertImageToEmbeddedSVG(filePath);
```

**Error model:** Go methods return `error`; surfaced in TS as rejected Promises with `{ code?: string, message: string, details?: any }` after mapping.

---

## 9. UX Details

* **Editor:** toolbar for headings (h1–h5), bold/italic/underline, code, lists, quote, hr, link insert, line‑break, inline/display math, image insert (conversion wizard), table builder.
* **Metadata panel:** required fields enforced with inline validation.
* **Diagnostics:** JSON validation and sanitizer report with clickable paths.
* **JSON preview:** read‑only; mirrors persisted structure.
* **Dark mode:** honors OS dark mode.
* **Accessibility:** keyboard control; ARIA roles; math nodes provide `aria-label` with TeX content.
* **i18n:** strings externalized; en‑US default; dates stored ISO‑8601 UTC.

---

## 10. Performance Targets

* 100 KB article load/save < 50 ms on mid‑tier hardware.
* SVG sanitize + Base64 for 1 MB SVG < 300 ms.
* Vectorize 1 MP raster < 2 s (default settings).
* Math preview: inline < 10 ms; display < 25 ms (typical cases).

---

## 11. Testing Strategy

* **Unit tests:** schema validation; editor⇄JSON round‑trip; math nodes; embedded image checks.
* **Golden tests:** snapshot JSON for representative articles.
* **Property tests:** randomized node trees; invariants (idempotent serialize/deserialize).
* **Security tests:** adversarial SVG payloads; size/node limits.
* **Git tests:** temp repos; wizard flows; conflict handling; save/commit semantics.

---

## 12. Build & Release (GitHub Actions CI, Wails)

**Goal:** Produce deployable binaries for Windows, Linux, macOS on x64 and arm64.

**Tooling:** Go 1.24+, Node 24.x, Wails v2.

**Packaging:** `wails build` produces native bundles per platform.

### 12.1 Workflow: `.github/workflows/release.yml` (sketch)

```yaml
name: build-release
on:
  push:
    tags: [ 'v*' ]
  workflow_dispatch: {}

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: ubuntu-latest
            goos: linux
            goarch: amd64
          - os: ubuntu-latest
            goos: linux
            goarch: arm64
          - os: macos-14
            goos: darwin
            goarch: arm64
          - os: macos-14
            goos: darwin
            goarch: amd64
          - os: windows-latest
            goos: windows
            goarch: amd64
          - os: windows-latest
            goos: windows
            goarch: arm64  # may require proper toolchain / runner
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/setup-go@v5
        with:
          go-version: '1.24'
      - name: Install Wails CLI
        run: go install github.com/wailsapp/wails/v2/cmd/wails@latest
      - name: Install frontend deps
        run: npm ci
      - name: Build (Wails)
        env:
          CGO_ENABLED: 1
          GOOS: ${{ matrix.goos }}
          GOARCH: ${{ matrix.goarch }}
        run: |
          wails build -clean -platform ${{ matrix.goos }}/${{ matrix.goarch }}
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: blog-writer-${{ matrix.goos }}-${{ matrix.goarch }}
          path: build/bin/**

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: ./artifacts
      - uses: softprops/action-gh-release@v2
        with:
          files: artifacts/**
```

> **Notes:**
>
> * Windows ARM64 builds may require an ARM64 runner or appropriate cross‑toolchain; test in your environment.
> * macOS universal can be produced by building `darwin/amd64` and `darwin/arm64` then combining with `lipo`.
> * Linux ARM64 can be cross‑compiled; ensure necessary GTK/WebKit dependencies are accounted for at runtime.

### 12.2 Project Files

* `go.mod` — Go module (Go 1.24).
* `wails.json` — Wails project config (name, author, frontend dir, platform icons, etc.).
* `package.json` — Frontend build scripts.

**`go.mod` (example):**

```go
module github.com/yourorg/blog-writer

go 1.24

require (
	github.com/wailsapp/wails/v2 v2.9.0 // indirect or pinned
)
```

**`wails.json` (minimal):**

```json
{
  "name": "blog-writer",
  "assetdir": "frontend/dist",
  "wailsjsdir": "frontend/wailsjs",
  "frontend": {
    "install": "npm ci",
    "build": "npm run build"
  }
}
```

**`package.json` (frontend excerpt):**

```json
{
  "name": "blog-writer-frontend",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.0.0",
    "eslint": "^9.0.0"
  }
}
```

---

## 13. Acceptance Criteria (v1.1)

1. On launch, wizard opens existing/recent repo or creates a local repo from SSH URL + path; `blog/` and `.blog-writer/` created if absent, then navigates to the WYSIWYG editor.
2. WYSIWYG editor supports headings (h1–h5), paragraph, inline emphasis (`b/i/u/strong/em/code/sub/sup/s/mark/small`), `br`, lists, quote, hr, code block, tables (optional), semantic containers (`header/footer/main/section/article/aside/nav/figure/figcaption/time`), **math** (inline & display), and **embedded SVG images**.
3. **Autosave** writes to disk every 15s and on blur (no commit). **Save** writes and commits using template `chore(article): <id> <title> [create|update|delete]`.
4. Images are vectorized (if needed), sanitized, minified, and **Base64 embedded** as `img.url` data URIs.
5. Articles are named by **Unix epoch second** IDs; loader supports `blog/**/<id>.json` and preserves exact structure on reload.
6. JSON validates against schema; invalid content blocks commit with actionable diagnostics.
7. GitHub Actions produces binaries for Windows/Linux/macOS on **x64** and **arm64**; artifacts attached to tagged releases.

---

## 14. Future Work (Post‑v1)

* Static renderer: JSON → HTML+CSS+JS (themes, TOC, anchors, numbering).
* Markdown import mapped through the same IR.
* Cross‑document references, bibliography, footnotes.
* Media de‑duplication via embedded SVG hashing.
* Plugin architecture (explicitly out of scope for v1).
