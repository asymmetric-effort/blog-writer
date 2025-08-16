// Copyright (c) 2024 blog-writer authors
package services

import "errors"

// Common service errors.
var (
	// ErrNotGitRepo indicates the provided path is not a git repository.
	ErrNotGitRepo = errors.New("not a git repository")
)
