// Copyright (c) 2025 blog-writer authors
package services

import (
    "io/fs"
    "path/filepath"
)

// TreeService exposes repository file tree operations.
type TreeService struct{}

// NewTreeService constructs a TreeService.
func NewTreeService() *TreeService {
    return &TreeService{}
}

// List returns a slice of file paths relative to root.
// Directories are excluded.
func (t *TreeService) List(root string) ([]string, error) {
    var files []string
    err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
        if err != nil {
            return err
        }
        if d.IsDir() {
            return nil
        }
        rel, err := filepath.Rel(root, path)
        if err != nil {
            return err
        }
        files = append(files, rel)
        return nil
    })
    return files, err
}
