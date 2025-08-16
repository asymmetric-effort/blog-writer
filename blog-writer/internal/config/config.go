// Copyright (c) 2025 blog-writer authors
package config

import (
	"errors"
	"os"
	"path/filepath"
	"runtime"

	"gopkg.in/yaml.v3"
)

// Config represents application configuration stored on disk.
type Config struct {
	RecentlyOpened []string `yaml:"recently_opened"`
}

// DefaultPath returns the path to the configuration file depending on OS.
func DefaultPath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	if runtime.GOOS == "windows" {
		return filepath.Join(home, "blog-writer.yml"), nil
	}
	return filepath.Join(home, ".blog-writer.yml"), nil
}

// Load reads configuration from path. If the file does not exist, an empty config is returned.
func Load(path string) (Config, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return Config{}, nil
		}
		return Config{}, err
	}
	var cfg Config
	if err := yaml.Unmarshal(b, &cfg); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

// Save writes configuration to the given path.
func Save(path string, cfg Config) error {
	b, err := yaml.Marshal(&cfg)
	if err != nil {
		return err
	}
	return os.WriteFile(path, b, 0o644)
}
