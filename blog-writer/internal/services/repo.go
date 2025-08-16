// Copyright (c) 2024 blog-writer authors
package services

import (
	"encoding/json"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"sync"
	"time"
)

// RepoService manages blog repositories and recent list.
type RepoService struct {
	mu         sync.Mutex
	recentPath string
}

// RecentRepo describes a repository path and its last-opened timestamp.
type RecentRepo struct {
	Path       string    `json:"path"`
	LastOpened time.Time `json:"lastOpened"`
}

// NewRepoService creates a RepoService using the user's home directory for config.
func NewRepoService() (*RepoService, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	configDir := filepath.Join(home, ".blog-writer")
	if err := os.MkdirAll(configDir, 0o755); err != nil {
		return nil, err
	}
	return &RepoService{recentPath: filepath.Join(configDir, "recent.json")}, nil
}

// NewRepoServiceWithDir creates a RepoService with a custom config directory.
// Mainly used for tests.
func NewRepoServiceWithDir(dir string) *RepoService {
	_ = os.MkdirAll(dir, 0o755)
	return &RepoService{recentPath: filepath.Join(dir, "recent.json")}
}

// Recent returns up to five most recently opened repositories.
func (r *RepoService) Recent() ([]RecentRepo, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	data, err := os.ReadFile(r.recentPath)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return []RecentRepo{}, nil
		}
		return nil, err
	}
	var rec struct {
		Repos []RecentRepo `json:"repos"`
	}
	if err := json.Unmarshal(data, &rec); err != nil {
		return nil, err
	}
	sort.Slice(rec.Repos, func(i, j int) bool {
		return rec.Repos[i].LastOpened.After(rec.Repos[j].LastOpened)
	})
	if len(rec.Repos) > 5 {
		rec.Repos = rec.Repos[:5]
	}
	return rec.Repos, nil
}

// addRecent records a repo path, moving it to the front and limiting to five entries.
func (r *RepoService) addRecent(path string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	data := struct {
		Repos []RecentRepo `json:"repos"`
	}{}
	if b, err := os.ReadFile(r.recentPath); err == nil {
		_ = json.Unmarshal(b, &data)
	}
	entry := RecentRepo{Path: path, LastOpened: time.Now()}
	filtered := []RecentRepo{entry}
	for _, p := range data.Repos {
		if p.Path != path {
			filtered = append(filtered, p)
		}
	}
	if len(filtered) > 5 {
		filtered = filtered[:5]
	}
	data.Repos = filtered
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(r.recentPath, b, 0o644)
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
