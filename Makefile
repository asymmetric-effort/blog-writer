# Copyright (c) 2025 Sam Caldwell
# Makefile for blog-writer project

BACKEND_DIR := blog-writer
FRONTEND_DIR := $(BACKEND_DIR)/frontend

.PHONY: clean lint test build/dev build/prod

## clean: remove build artifacts
clean:
	cd $(BACKEND_DIR) && go clean
	rm -rf $(BACKEND_DIR)/build
	rm -rf $(FRONTEND_DIR)/dist

## lint: format and vet Go code; type-check frontend
lint:
	mkdir -p $(FRONTEND_DIR)/dist
	touch $(FRONTEND_DIR)/dist/.keep
	cd $(BACKEND_DIR) && go fmt ./... && go vet ./...
	npx --prefix $(FRONTEND_DIR) tsc --noEmit -p $(FRONTEND_DIR)

## test: run Go tests
test:
	cd $(BACKEND_DIR) && go test ./...

## build/dev: start Wails in development mode
build/dev:
	cd $(BACKEND_DIR) && wails dev

## build/prod: build production binaries
build/prod:
	cd $(BACKEND_DIR) && wails build

