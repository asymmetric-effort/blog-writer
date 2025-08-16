// Copyright (c) 2024 blog-writer authors
package services

import (
        "os"
        "path/filepath"
        "strconv"
        "testing"
        "time"
)

// TestRecent ensures recent repos list maintains order, limit, and timestamps.
func TestRecent(t *testing.T) {
        cfg := t.TempDir()
        svc := NewRepoServiceWithDir(cfg)

        root := t.TempDir()
        for i := 0; i < 6; i++ {
                p := filepath.Join(root, "repo"+strconv.Itoa(i))
                if err := os.MkdirAll(filepath.Join(p, ".git"), 0o755); err != nil {
                        t.Fatalf("mkdir: %v", err)
                }
                if err := svc.Open(p); err != nil {
                        t.Fatalf("open: %v", err)
                }
                time.Sleep(10 * time.Millisecond)
        }
        rec, err := svc.Recent()
        if err != nil {
                t.Fatalf("recent: %v", err)
        }
        if len(rec) != 5 {
                t.Fatalf("expected 5 recents, got %d", len(rec))
        }
        for _, r := range rec {
                if r.LastOpened.IsZero() {
                        t.Fatalf("expected LastOpened to be set for %s", r.Path)
                }
        }
        target := filepath.Join(root, "repo3")
        if err := svc.Open(target); err != nil {
                t.Fatalf("open: %v", err)
        }
        rec, _ = svc.Recent()
        if rec[0].Path != target {
                t.Fatalf("expected %s at front, got %s", target, rec[0].Path)
        }
        if !rec[0].LastOpened.After(rec[1].LastOpened) {
                t.Fatalf("expected %s to have latest timestamp", target)
        }
}
