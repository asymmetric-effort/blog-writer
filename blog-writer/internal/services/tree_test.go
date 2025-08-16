// Copyright (c) 2025 blog-writer authors
package services

import (
	"os"
	"path/filepath"
	"testing"
)

// TestTreeServiceList verifies List returns all files relative to root.
func TestTreeServiceList(t *testing.T) {
	dir := t.TempDir()
	_ = os.WriteFile(filepath.Join(dir, "a.txt"), []byte("a"), 0o644)
	_ = os.Mkdir(filepath.Join(dir, "sub"), 0o755)
	_ = os.WriteFile(filepath.Join(dir, "sub", "b.txt"), []byte("b"), 0o644)

	svc := NewTreeService()
	files, err := svc.List(dir)
	if err != nil {
		t.Fatalf("List returned error: %v", err)
	}
	expected := map[string]bool{"a.txt": true, filepath.Join("sub", "b.txt"): true}
	if len(files) != 2 {
		t.Fatalf("expected 2 files, got %d", len(files))
	}
	for _, f := range files {
		if !expected[f] {
			t.Fatalf("unexpected file %s", f)
		}
	}
}
