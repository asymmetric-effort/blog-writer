// Copyright (c) 2025 blog-writer authors
package services

import (
    "os"
    "path/filepath"
    "testing"
)

// TestDirectoryServiceList ensures List returns only subdirectories.
func TestDirectoryServiceList(t *testing.T) {
    tmp := t.TempDir()
    _ = os.Mkdir(filepath.Join(tmp, "a"), 0o755)
    _ = os.Mkdir(filepath.Join(tmp, "b"), 0o755)
    _ = os.WriteFile(filepath.Join(tmp, "file.txt"), []byte("x"), 0o644)

    svc := NewDirectoryService()
    dirs, err := svc.List(tmp)
    if err != nil {
        t.Fatalf("List returned error: %v", err)
    }
    expected := map[string]bool{
        filepath.Join(tmp, "a"): true,
        filepath.Join(tmp, "b"): true,
    }
    if len(dirs) != 2 {
        t.Fatalf("expected 2 dirs, got %d", len(dirs))
    }
    for _, d := range dirs {
        if !expected[d] {
            t.Fatalf("unexpected dir %s", d)
        }
    }
}

// TestDirectoryServiceCreate validates directory creation and name checks.
func TestDirectoryServiceCreate(t *testing.T) {
    tmp := t.TempDir()
    svc := NewDirectoryService()
    if err := svc.Create(tmp, "newdir"); err != nil {
        t.Fatalf("Create failed: %v", err)
    }
    if _, err := os.Stat(filepath.Join(tmp, "newdir")); err != nil {
        t.Fatalf("expected directory to exist: %v", err)
    }
    invalid := []string{"..", "../etc", "a/..", "a/b", `a\\b`}
    for _, name := range invalid {
        if err := svc.Create(tmp, name); err == nil {
            t.Fatalf("expected error for %q", name)
        }
    }
}

