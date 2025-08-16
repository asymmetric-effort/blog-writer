// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

package version

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// Version represents a semantic version.
type Version struct {
	Major   int
	Minor   int
	Release int
}

// EnsureVersionFile creates a VERSION file with v0.0.0 if it does not exist.
func EnsureVersionFile(path string) error {
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		return os.WriteFile(path, []byte("v0.0.0\n"), 0644)
	}
	return nil
}

// ReadVersion reads the semantic version from path.
func ReadVersion(path string) (Version, error) {
	var v Version
	if err := EnsureVersionFile(path); err != nil {
		return v, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return v, err
	}
	s := strings.TrimSpace(string(data))
	if !strings.HasPrefix(s, "v") {
		return v, fmt.Errorf("version must start with 'v'")
	}
	parts := strings.Split(s[1:], ".")
	if len(parts) != 3 {
		return v, fmt.Errorf("version must have three numeric parts")
	}
	_, err = fmt.Sscanf(s, "v%d.%d.%d", &v.Major, &v.Minor, &v.Release)
	if err != nil {
		return v, err
	}
	return v, nil
}

// WriteVersion writes v to path in vM.m.r format.
func WriteVersion(path string, v Version) error {
	return os.WriteFile(path, []byte(fmt.Sprintf("v%d.%d.%d\n", v.Major, v.Minor, v.Release)), 0644)
}

// BumpVersion returns a new version bumped at level.
func BumpVersion(level string, v Version) (Version, error) {
	switch level {
	case "major":
		v.Major++
		v.Minor = 0
		v.Release = 0
	case "minor":
		v.Minor++
		v.Release = 0
	case "release":
		v.Release++
	default:
		return v, fmt.Errorf("level must be 'major', 'minor', or 'release'")
	}
	return v, nil
}

// Run reads, bumps, and writes the version at path according to level.
func Run(level, path string) (Version, error) {
	if err := EnsureVersionFile(path); err != nil {
		return Version{}, err
	}
	current, err := ReadVersion(path)
	if err != nil {
		return Version{}, err
	}
	next, err := BumpVersion(level, current)
	if err != nil {
		return Version{}, err
	}
	if err := WriteVersion(path, next); err != nil {
		return Version{}, err
	}
	return next, nil
}

// VersionFile returns the absolute path to the VERSION file in dir.
func VersionFile(dir string) string {
	return filepath.Join(dir, "VERSION")
}
