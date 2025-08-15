# SPECIFICATION.md — blog-writer (v1.0)

| KEY        | VALUE                                                                                       |
|------------|---------------------------------------------------------------------------------------------|
| Artifact   | Free‑standing Electron + React + TypeScript desktop application                             |
| OS/Arch    | Windows, Linux, macOS — x64 (amd64) and arm64                                               |
| Scope      | Offline WYSIWYG editor for authoring blog articles stored as JSON files in a Git repository |
| Save model | **Save = write + Git commit** (Autosave = write only)                                       |
| Media      | Images converted to **sanitized SVG** and **embedded as Base64 data URIs**                  |
| Math       | LaTeX (inline & display) stored as TeX source in dedicated `math` nodes; previewed in‑app   |

---

## 1. Product Overview

* **Users:** Engineers/writers who prefer file‑based content under source control.
* **Primary actions:** Create / edit / delete articles; commit/push via Git; validate content against schema.
* **Source of truth:** The Git repository. Import/export flows are **not required** in v1.

### 1.1 Launch Experience (Repo Wizard)

On startup the app presents a wizard with three choices:

1. **Open existing repo** (select local folder containing `.git`).
2. **Open recent repo** (pick from the last N local repos).
3. **Create local repo from remote**:

    * Inputs: **GitHub SSH URL** (e.g. `git@github.com:org/repo.git`) and **local path**.
    * Actions: `git init` → `git remote add origin <ssh-url>` → optional `git fetch` → create `blog/` and
      `.blog-writer/` → initial commit → optional `git push -u origin <branch>`.

---

## 2. Architecture

**Electron Main**

* App lifecycle, repo wizard, system dialogs.
* Git operations: status/stage/commit/amend/branch/pull(rebase)/push.
* Validation pipeline: JSON Schema validation, SVG sanitation and size checks.
* Secure typed IPC via preload `contextBridge`.

**Preload (Context Bridge)**

* Strict, typed API surface; `nodeIntegration:false`, `contextIsolation:true`.
* Validates parameters and returns typed error objects.

**Renderer (React + TS)**

* WYSIWYG editor (semantics‑first), metadata panel, JSON preview, Git panel, diagnostics.
* LaTeX **preview only**; JSON stores TeX source.

**Serialization Layer**

* Editor state ⇄ Canonical JSON with deterministic ordering and stable shapes.

**SVG Pipeline**

* PNG/JPEG/GIF/WebP/PDF/SVG → (vectorize if needed) → sanitize → minify → Base64 embed
  as `data:image/svg+xml;base64,...`.

**Security**

* CSP forbids remote code; sanitizer removes `script`, `foreignObject`, external `image` hrefs; size/node count limits.

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
      1755288229.json
  .blog-writer/
    settings.json
```

* **Article filename / ID:** The article ID is the **Unix epoch seconds** at creation time, stored as a string and
  used as the filename (e.g., `1755288229.json`). The allocator waits up to 2 seconds to
  avoid collisions; if still colliding, it increments by `+1` second until free.
* **Scanning rule:** Load all `blog/**/<epoch>.json` files (top‑level or nested).

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
  "imageVectorization": {
    "mode": "auto",
    "threshold": 0.6,
    "colors": 8
  }
}
```

> App‑level preferences (e.g., `autosave.enabled`, `autosave.intervalMs`, recent repos) are stored **outside** the
> content repo in the app’s profile directory.

---

## 4. Canonical JSON Data Model (Concise `tag` Schema)

Each node uses a **`tag`** discriminator and a **`content`** field (string or `Node[]`). Additional attributes are
tag‑specific.

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
    "keywords": [
      "string"
    ]
  },
  "document": [
    "Node"
  ]
}
```

### 4.2 Supported Tags (v1)

* **Headings:** `h1` | `h2` | `h3` | `h4` | `h5` → `{ tag:"h1".."h5", content: Node[] }`
* **Paragraph:** `p` → `{ tag:"p", content: Node[] }`
* **Inline text:** `span` → `{ tag:"span", content: string }`
* **Inline emphasis/presentation:** `b`, `i`, `u`, `strong`, `em`, `code`, `sub`, `sup`, `s`, `mark`,
  `small` → `{ tag:<name>, content: Node[]|string }`
* **Line break:** `br` → `{ tag:"br" }`
* **Math (LaTeX):**

    * Inline → `{ tag:"math", mode:"inline", content: string }`
    * Display → `{ tag:"math", mode:"display", content: string, numbered?: boolean, label?: string }`
* **Image (embedded SVG):** `{ tag:"img", url:"data:image/svg+xml;base64,<...>", alt?: string }`
* **Quote:** `blockquote` → `{ tag:"blockquote", content: Node[] }`
* **Lists:** `ol` / `ul` containers (optional `start`), `li` items.
* **Code block:** `pre` → `{ tag:"pre", lang?: string, content: string }`
* **Rule:** `hr` → `{ tag:"hr" }`
* **Tables (optional in v1):** `table` → rows `tr` → cells `th` / `td` with `content: Node[]`.
* **HTML5 semantic containers:** `header`, `footer`, `main`, `section`, `article`, `aside`, `nav`, `figure`,
  `figcaption`, `time` (with optional `datetime`).

> Presentation is deferred to a separate renderer; this IR captures **structure & semantics** only.

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
    "keywords": [
      "intro",
      "math",
      "latex",
      "semantics"
    ]
  },
  "document": [
    {
      "tag": "header",
      "content": [
        {
          "tag": "h1",
          "content": [
            {
              "tag": "span",
              "content": "LaTeX Demo"
            }
          ]
        }
      ]
    },
    {
      "tag": "section",
      "content": [
        {
          "tag": "p",
          "content": [
            {
              "tag": "span",
              "content": "Einstein's equation "
            },
            {
              "tag": "math",
              "mode": "inline",
              "content": "E=mc^2"
            },
            {
              "tag": "span",
              "content": " relates mass and energy."
            },
            {
              "tag": "br"
            }
          ]
        },
        {
          "tag": "math",
          "mode": "display",
          "content": "\\int_{-\\infty}^{\\infty} e^{-x^2} \\; dx = \\sqrt{\\pi}",
          "numbered": true,
          "label": "eq:gaussian"
        }
      ]
    },
    {
      "tag": "figure",
      "content": [
        {
          "tag": "img",
          "url": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PC9zdmc+",
          "alt": "diagram"
        },
        {
          "tag": "figcaption",
          "content": [
            {
              "tag": "span",
              "content": "Gaussian integral diagram"
            }
          ]
        }
      ]
    },
    {
      "tag": "article",
      "content": [
        {
          "tag": "p",
          "content": [
            {
              "tag": "span",
              "content": "Inline code example: "
            },
            {
              "tag": "code",
              "content": [
                {
                  "tag": "span",
                  "content": "x = y * z;"
                }
              ]
            }
          ]
        },
        {
          "tag": "pre",
          "lang": "cpp",
          "content": "// example\nint main(){return 0;}"
        }
      ]
    },
    {
      "tag": "footer",
      "content": [
        {
          "tag": "time",
          "datetime": "2025-08-15T00:00:00Z",
          "content": "Updated"
        }
      ]
    }
  ]
}
```

---

## 5. JSON Schema (Concise; strict where needed)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "version",
    "metadata",
    "document"
  ],
  "properties": {
    "version": {
      "type": "string"
    },
    "metadata": {
      "type": "object",
      "required": [
        "title",
        "author",
        "description",
        "publicationDate",
        "updatedDate",
        "keywords"
      ],
      "properties": {
        "title": {
          "type": "string",
          "minLength": 1
        },
        "author": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string"
        },
        "publicationDate": {
          "type": "string",
          "format": "date-time"
        },
        "updatedDate": {
          "type": "string",
          "format": "date-time"
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "document": {
      "type": "array",
      "items": {
        "$ref": "#/defs/node"
      }
    }
  },
  "defs": {
    "node": {
      "type": "object",
      "required": [
        "tag"
      ],
      "properties": {
        "tag": {
          "type": "string",
          "enum": [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "p",
            "span",
            "b",
            "i",
            "u",
            "strong",
            "em",
            "code",
            "sub",
            "sup",
            "s",
            "mark",
            "small",
            "br",
            "math",
            "img",
            "blockquote",
            "ol",
            "ul",
            "li",
            "pre",
            "hr",
            "table",
            "tr",
            "th",
            "td",
            "header",
            "footer",
            "main",
            "section",
            "article",
            "aside",
            "nav",
            "figure",
            "figcaption",
            "time"
          ]
        },
        "content": {},
        "mode": {
          "type": "string",
          "enum": [
            "inline",
            "display"
          ]
        },
        "numbered": {
          "type": "boolean"
        },
        "label": {
          "type": "string"
        },
        "alt": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "pattern": "^data:image/svg\\+xml;base64,[A-Za-z0-9+/=]+$"
        },
        "lang": {
          "type": "string"
        },
        "start": {
          "type": "integer",
          "minimum": 1
        },
        "datetime": {
          "type": "string"
        }
      },
      "allOf": [
        {
          "if": {
            "properties": {
              "tag": {
                "const": "br"
              }
            }
          },
          "then": {
            "not": {
              "required": [
                "content"
              ]
            }
          }
        },
        {
          "if": {
            "properties": {
              "tag": {
                "const": "img"
              }
            }
          },
          "then": {
            "required": [
              "url"
            ]
          }
        },
        {
          "if": {
            "properties": {
              "tag": {
                "const": "math"
              }
            }
          },
          "then": {
            "required": [
              "mode",
              "content"
            ]
          }
        },
        {
          "if": {
            "properties": {
              "tag": {
                "enum": [
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                  "h5",
                  "p",
                  "blockquote",
                  "ol",
                  "ul",
                  "li",
                  "pre",
                  "table",
                  "tr",
                  "th",
                  "td",
                  "header",
                  "footer",
                  "main",
                  "section",
                  "article",
                  "aside",
                  "nav",
                  "figure",
                  "figcaption"
                ]
              }
            }
          },
          "then": {
            "properties": {
              "content": {
                "type": [
                  "array",
                  "string",
                  "null"
                ]
              }
            }
          }
        }
      ]
    }
  }
}
```

---

## 6. Image Conversion & Sanitization

**Inputs:** PNG, JPEG, GIF, WebP, SVG, PDF (single page).
**Pipeline:**

1. Vectorize raster/PDF to SVG (Potrace‑like for line art; optional color quantization for limited palettes).
2. Sanitize SVG: remove `script`, external `image` hrefs, `foreignObject`; whitelist core attributes (`d`,
   `fill`, `stroke`, `stroke-width`, `transform`, `viewBox`, `width`, `height`, `id`, `class`, constrained `style`).
3. Minify.
4. Base64‑encode and embed as `url` in `img` node.
5. Enforce size/node limits; warn on photographic content fidelity.

---

## 7. Git Integration & Save Semantics

* **Autosave** = write only (no commit): defaults to enabled every **15s** and on window blur.
* **Save** button = write + commit. Default message:
  `chore(article): <id> <title> [create|update|delete]`.
* **Git panel:** status, staged files, commit/amend, branch switch, pull (rebase), push, side‑by‑side JSON diff.
* **Safety:** Pre‑commit validation (schema + SVG sanitation + Base64 pattern). Block commit/push on invalid state
  with diagnostics.
* **Conflicts:** If working tree changed, offer a 3‑way JSON merge with semantic assistance (per‑node diffs for arrays).

---

## 8. TypeScript API (Preload → Renderer)

```ts
/** Renderer-facing API exposed via contextBridge */
interface BlogWriterAPI {
    /** Open wizard; return selected/created repo config. */
    startupSelectOrCreateRepo(): Promise<RepoConfig>;

    /** Create local repo at path from SSH remote. */
    createLocalRepoFromRemote(input: {
        sshUrl: string;
        localPath: string;
        defaultBranch?: string
    }): Promise<RepoConfig>;

    /** Select an existing local Git repo. */
    selectExistingRepo(): Promise<RepoConfig>;

    /** Recent repos (app-level MRU list). */
    listRecentRepos(): Promise<RepoConfig[]>;

    /** Read/Write repo configuration. */
    getRepoConfig(): Promise<RepoConfig>;

    setRepoConfig(cfg: RepoConfig): Promise<void>;

    /** List article summaries. */
    listArticles(): Promise<ArticleIndex[]>;

    /** Read article by ID (epoch seconds as string). */
    readArticle(id: string): Promise<Article>;

    /** Save (write + Git commit) an article. */
    saveArticle(article: Article): Promise<void>;

    /** Soft delete by ID (move to .trash) and commit. */
    deleteArticle(id: string): Promise<void>;

    /** Convert input image to sanitized embedded SVG data URI. */
    convertImageToEmbeddedSvg(inputPath: string): Promise<string>;

    /** Sanitize raw SVG text and return cleaned SVG text. */
    sanitizeSvg(svgText: string): Promise<string>;

    /** Git operations. */
    gitStatus(): Promise<GitStatus>;

    gitCommit(message: string, amend?: boolean): Promise<void>;

    gitPullRebase(): Promise<void>;

    gitPush(): Promise<void>;
}

interface RepoConfig {
    root: string;
    defaultBranch: string;
    remote?: string
}

interface ArticleIndex {
    id: string;
    title: string;
    publicationDate: string;
    updatedDate: string;
    keywords: string[]
}

interface Article {
    version: string;
    metadata: Metadata;
    document: Node[]
}
```

**Error Model:** All methods reject with `{ code: string; message: string; details?: unknown }`
(e.g., `SCHEMA_INVALID`, `SVG_UNSAFE`, `GIT_CONFLICT`).

---

## 9. UX Details

* **Editor:** toolbar for headings (h1–h5), bold/italic/underline, code, lists, quote, hr, link insert, line‑break,
  inline/display math, image insert (conversion wizard), table builder.
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
* **Selenium:*** create selenium tests to confirm user experience and feature functionality.

---

## 12. Build & Release (GitHub Actions CI)

**Goal:** Produce deployable binaries for Windows, Linux, macOS on x64 and arm64.

**Packager:** `electron-builder` (recommended). Targets:

* Windows: NSIS `.exe` (x64, arm64)
* macOS: `.dmg` (x64, arm64) and optional **universal**
* Linux: `.AppImage` (x64, arm64) + optional `.deb`/`.rpm`

**Workflow:** `.github/workflows/release.yml` (sketch)

```yaml
name: build-release
on:
  push:
    tags: [ 'v*' ]
  workflow_dispatch: { }

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        os: [ ubuntu-latest, macos-14, windows-latest ]
        arch: [ x64, arm64 ]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build:renderer
      - name: Build app
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          if [ "${{ runner.os }}" = "macOS" ]; then
            npx electron-builder --mac dmg -a ${{ matrix.arch }}
          elif [ "${{ runner.os }}" = "Windows" ]; then
            npx electron-builder --win nsis -a ${{ matrix.arch }}
          else
            npx electron-builder --linux AppImage -a ${{ matrix.arch }}
          fi
      - uses: actions/upload-artifact@v4
        with:
          name: blog-writer-${{ runner.os }}-${{ matrix.arch }}
          path: dist/**

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

**`package.json` build section (example)**

```json
{
  "name": "blog-writer",
  "version": "0.1.0",
  "main": "dist/main/index.js",
  "scripts": {
    "dev": "vite",
    "build:renderer": "vite build",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.example.blogwriter",
    "files": [
      "dist/**",
      "node_modules/**",
      "package.json"
    ],
    "mac": {
      "target": [
        "dmg"
      ],
      "category": "public.app-category.productivity"
    },
    "win": {
      "target": [
        "nsis"
      ]
    },
    "linux": {
      "target": [
        "AppImage"
      ],
      "category": "Utility"
    }
  }
}
```

**Notes:** mac notarization/signing requires secrets on macOS runners; Linux arm64 cross‑build works if no native
addons; else use native runners or QEMU.

---

## 13. Acceptance Criteria (v1)

1. On launch, wizard opens existing repo, recent repo, or creates local repo from SSH URL + path; `blog/`
   and `.blog-writer/` are created if absent.
2. WYSIWYG editor supports headings (h1–h5), paragraphs, inline emphasis (`b/i/u/strong/em/code/sub/sup/s/mark/small`),
   `br`, lists, quote, hr, code block, tables (optional), semantic containers
   (`header/footer/main/section/article/aside/nav/figure/figcaption/time`), **math** (inline & display),
   and **embedded SVG images**.
3. **Autosave** writes to disk every 15s and on blur without committing; **Save** writes and commits with the
   default template `chore(article): <id> <title> [create|update|delete]`.
4. Images are vectorized (if needed), sanitized, minified, and **Base64 embedded** as `img.url` data URIs.
5. Articles are named by **Unix epoch second** IDs; loader supports `blog/**/<id>.json` and preserves exact
   structure on reload (round‑trip fidelity).
6. JSON validates against schema; invalid content blocks commit with actionable diagnostics.
7. GitHub Actions produces binaries for Windows/Linux/macOS on x64 and arm64; artifacts attached to tagged releases.

---

## 14. Future Work (Post‑v1)

* Static renderer: JSON → HTML+CSS+JS (themes, TOC, anchors, numbering).
* Markdown import mapped through the same IR.
* Cross‑document references, bibliography, footnotes.
* Media de‑duplication via embedded SVG hashing.
* Plugin architecture (explicitly out of scope for v1).
