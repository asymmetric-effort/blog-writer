// Copyright (c) 2025 blog-writer authors
package services

import (
	"errors"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// DirectoryService provides directory listing and creation utilities.
type DirectoryService struct{}

// NewDirectoryService constructs a DirectoryService.
func NewDirectoryService() *DirectoryService {
	return &DirectoryService{}
}

// List returns full paths of all directories within path. If path is empty, the user's home directory is used.
func (d *DirectoryService) List(path string) ([]string, error) {
	if path == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			return nil, err
		}
		path = home
	}
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}
	var dirs []string
	for _, e := range entries {
		if e.IsDir() {
			dirs = append(dirs, filepath.Join(path, e.Name()))
		}
	}
	sort.Strings(dirs)
	return dirs, nil
}

// Create makes a new directory named name inside path after validation.
func (d *DirectoryService) Create(path, name string) error {
	if name == "" {
		return errors.New("name required")
	}
	if strings.Contains(name, "..") {
		return errors.New("invalid directory name")
	}
	if strings.ContainsAny(name, "/\\") {
		return errors.New("invalid directory name")
	}
	cleaned := filepath.Clean(name)
	if cleaned != name || filepath.Base(cleaned) != name {
		return errors.New("invalid directory name")
	}
	target := filepath.Join(path, name)
	return os.Mkdir(target, 0o755)
}
