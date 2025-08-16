// Copyright (c) 2025 blog-writer authors
package services

import (
	"encoding/json"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"sync"

	"blog-writer/internal/config"
)

// RepoService manages blog repositories and recent list.
type RepoService struct {
	mu      sync.Mutex
	cfgPath string
}

// NewRepoService creates a RepoService using the user's home directory for config.
func NewRepoService() (*RepoService, error) {
	p, err := config.DefaultPath()
	if err != nil {
		return nil, err
	}
	return &RepoService{cfgPath: p}, nil
}

// NewRepoServiceWithPath creates a RepoService with a custom config file path.
// Mainly used for tests.
func NewRepoServiceWithPath(path string) *RepoService {
	return &RepoService{cfgPath: path}
}

// Recent returns up to five most recently opened repositories.
func (r *RepoService) Recent() ([]string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	cfg, err := config.Load(r.cfgPath)
	if err != nil {
		return nil, err
	}
	if len(cfg.RecentlyOpened) > 5 {
		cfg.RecentlyOpened = cfg.RecentlyOpened[:5]
	}
	return cfg.RecentlyOpened, nil
}

// addRecent records a repo path, moving it to the front and limiting to five entries.
func (r *RepoService) addRecent(path string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	cfg, _ := config.Load(r.cfgPath)
	filtered := []string{path}
	for _, p := range cfg.RecentlyOpened {
		if p != path {
			filtered = append(filtered, p)
		}
	}
	if len(filtered) > 5 {
		filtered = filtered[:5]
	}
	cfg.RecentlyOpened = filtered
	return config.Save(r.cfgPath, cfg)
}

// Open opens an existing git repository and ensures required directories.
func (r *RepoService) Open(path string) error {
	if _, err := os.Stat(filepath.Join(path, ".git")); err != nil {
		return ErrNotGitRepo
	}
	// ensure directories
	if err := os.MkdirAll(filepath.Join(path, "blog"), 0o755); err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Join(path, ".blog-writer"), 0o755); err != nil {
		return err
	}
	// ensure settings file
	settings := filepath.Join(path, ".blog-writer", "settings.json")
	if _, err := os.Stat(settings); errors.Is(err, os.ErrNotExist) {
		if err := os.WriteFile(settings, defaultSettings(), 0o644); err != nil {
			return err
		}
	}
	return r.addRecent(path)
}

// Create creates a new git repository at path with optional remote.
func (r *RepoService) Create(remote, path string) error {
	if err := os.MkdirAll(path, 0o755); err != nil {
		return err
	}
	cmd := exec.Command("git", "init", path)
	if err := cmd.Run(); err != nil {
		return err
	}
	if remote != "" {
		cmd = exec.Command("git", "remote", "add", "origin", remote)
		cmd.Dir = path
		if err := cmd.Run(); err != nil {
			return err
		}
	}
	if err := os.MkdirAll(filepath.Join(path, "blog"), 0o755); err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Join(path, ".blog-writer"), 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(path, ".blog-writer", "settings.json"), defaultSettings(), 0o644); err != nil {
		return err
	}
	// initial commit
	cmd = exec.Command("git", "add", ".")
	cmd.Dir = path
	if err := cmd.Run(); err != nil {
		return err
	}
	cmd = exec.Command("git", "commit", "-m", "chore: initial commit")
	cmd.Dir = path
	if err := cmd.Run(); err != nil {
		return err
	}
	return r.addRecent(path)
}

// defaultSettings returns the default repository settings JSON.
func defaultSettings() []byte {
	// minimal settings matching specification
	data := struct {
		SchemaVersion       int      `json:"schemaVersion"`
		DefaultAuthor       string   `json:"defaultAuthor"`
		DefaultKeywords     []string `json:"defaultKeywords"`
		DefaultBranch       string   `json:"defaultBranch"`
		Remote              string   `json:"remote"`
		PreCommitValidate   bool     `json:"preCommitValidate"`
		MaxEmbeddedSvgBytes int      `json:"maxEmbeddedSvgBytes"`
		MaxSvgNodeCount     int      `json:"maxSvgNodeCount"`
		ImageVectorization  struct {
			Mode      string  `json:"mode"`
			Threshold float64 `json:"threshold"`
			Colors    int     `json:"colors"`
		} `json:"imageVectorization"`
		Autosave struct {
			Enabled    bool `json:"enabled"`
			IntervalMs int  `json:"intervalMs"`
		} `json:"autosave"`
	}{
		SchemaVersion:       1,
		DefaultBranch:       "main",
		PreCommitValidate:   true,
		MaxEmbeddedSvgBytes: 10485760,
		MaxSvgNodeCount:     100000,
	}
	data.ImageVectorization.Mode = "auto"
	data.ImageVectorization.Threshold = 0.6
	data.ImageVectorization.Colors = 8
	data.Autosave.Enabled = true
	data.Autosave.IntervalMs = 15000
	b, _ := json.MarshalIndent(data, "", "  ")
	return b

}
