// Copyright (c) 2024 blog-writer authors
package services

import (
	"os"
	"path/filepath"
	"strconv"
	"testing"
)

// TestRecent ensures recent repos list maintains order and limit.
func TestRecent(t *testing.T) {
	cfg := t.TempDir()
	svc := NewRepoServiceWithDir(cfg)

	root := t.TempDir()
	for i := 0; i < 6; i++ {
		p := filepath.Join(root, "repo"+strconv.Itoa(i))
		// simulate git repo
		if err := os.MkdirAll(filepath.Join(p, ".git"), 0o755); err != nil {
			t.Fatalf("mkdir: %v", err)
		}
		if err := svc.Open(p); err != nil {
			t.Fatalf("open: %v", err)
		}
	}
	rec, err := svc.Recent()
	if err != nil {
		t.Fatalf("recent: %v", err)
	}
	if len(rec) != 5 {
		t.Fatalf("expected 5 recents, got %d", len(rec))
	}
	// reopen repo3
	target := filepath.Join(root, "repo3")
	if err := svc.Open(target); err != nil {
		t.Fatalf("open: %v", err)
	}
	rec, _ = svc.Recent()
	if rec[0] != target {
		t.Fatalf("expected %s at front, got %s", target, rec[0])
	}
}
