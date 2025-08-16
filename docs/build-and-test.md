<!-- Copyright 2024 Blog Writer -->
# Build and Test Guide

This document describes how to build, package, and test Blog Writer.

## Prerequisites

- Go 1.24
- Node.js 20
- Wails CLI (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`)
- A working Git installation

## Development Build

```bash
# install frontend dependencies
cd blog-writer/frontend
npm ci

# run the development environment
cd ..
wails dev
```

`wails dev` starts a Vite development server with hot reload. A second dev server runs on `http://localhost:34115` for browser testing.

## Production Build

```bash
# install frontend dependencies once
cd blog-writer/frontend
npm ci
cd ..

# build for the host platform
wails build
```

To build for a specific platform, set `GOOS` and `GOARCH` and enable CGO:

```bash
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 wails build -clean -platform linux/amd64
```

The GitHub Actions workflow builds binaries for Windows, Linux, and macOS on both `amd64` and `arm64` architectures and uploads artifacts for releases.

## Testing

Run Go tests from the project root:

```bash
cd blog-writer
go test ./...
```

The frontend does not yet define a test script. Placeholder tests should be added as features are implemented.
