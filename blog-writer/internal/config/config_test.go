// Copyright (c) 2025 blog-writer authors
package config

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

func TestDefaultPath(t *testing.T) {
	path, err := DefaultPath()
	if err != nil {
		t.Fatalf("DefaultPath: %v", err)
	}
	home, err := os.UserHomeDir()
	if err != nil {
		t.Fatalf("UserHomeDir: %v", err)
	}
	expected := filepath.Join(home, ".blog-writer.yml")
	if runtime.GOOS == "windows" {
		expected = filepath.Join(home, "blog-writer.yml")
	}
	if path != expected {
		t.Fatalf("expected %s, got %s", expected, path)
	}
}

func TestLoadSave(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "config.yml")
	cfg := Config{RecentlyOpened: []string{"/a", "/b"}}
	if err := Save(path, cfg); err != nil {
		t.Fatalf("Save: %v", err)
	}
	got, err := Load(path)
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if len(got.RecentlyOpened) != 2 || got.RecentlyOpened[0] != "/a" {
		t.Fatalf("unexpected data: %+v", got)
	}
	// Loading non-existent file returns default
	path2 := filepath.Join(dir, "missing.yml")
	cfg2, err := Load(path2)
	if err != nil {
		t.Fatalf("Load missing: %v", err)
	}
	if len(cfg2.RecentlyOpened) != 0 {
		t.Fatalf("expected empty config, got %+v", cfg2)
	}
}
