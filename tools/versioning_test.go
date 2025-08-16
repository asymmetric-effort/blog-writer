// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

package versioning_test

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// runTool executes the Go versioning CLI targeting the VERSION file in dir.
func runTool(t *testing.T, dir string, args ...string) (string, int) {
	t.Helper()
	toolDir, err := filepath.Abs("cmd/versioning")
	if err != nil {
		t.Fatalf("cannot resolve tool path: %v", err)
	}
	versionFile := filepath.Join(dir, "VERSION")
	cmdArgs := append([]string{"run", toolDir, "-file", versionFile}, args...)
	cmd := exec.Command("go", cmdArgs...)
	cmd.Dir = filepath.Dir(toolDir)
	out, err := cmd.CombinedOutput()
	exitCode := 0
	if err != nil {
		if ee, ok := err.(*exec.ExitError); ok {
			exitCode = ee.ExitCode()
		} else {
			t.Fatalf("failed to run tool: %v", err)
		}
	}
	return string(out), exitCode
}

// TestHelpMessage ensures the tool displays usage information with no arguments.
func TestHelpMessage(t *testing.T) {
	tmp := t.TempDir()
	out, code := runTool(t, tmp)
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
	if !strings.Contains(strings.ToLower(out), "usage") {
		t.Fatalf("expected usage message, got %q", out)
	}
}

// TestMajorCreatesFile verifies invoking with 'major' creates VERSION with v1.0.0.
func TestMajorCreatesFile(t *testing.T) {
	tmp := t.TempDir()
	_, code := runTool(t, tmp, "major")
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
	data, err := os.ReadFile(filepath.Join(tmp, "VERSION"))
	if err != nil {
		t.Fatalf("failed to read VERSION: %v", err)
	}
	if strings.TrimSpace(string(data)) != "v1.0.0" {
		t.Fatalf("expected v1.0.0, got %q", string(data))
	}
}

// TestMinorBump verifies the minor version increments and release resets.
func TestMinorBump(t *testing.T) {
	tmp := t.TempDir()
	versionFile := filepath.Join(tmp, "VERSION")
	if err := os.WriteFile(versionFile, []byte("v1.2.3"), 0644); err != nil {
		t.Fatalf("setup failed: %v", err)
	}
	_, code := runTool(t, tmp, "minor")
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
	data, err := os.ReadFile(versionFile)
	if err != nil {
		t.Fatalf("failed to read VERSION: %v", err)
	}
	if strings.TrimSpace(string(data)) != "v1.3.0" {
		t.Fatalf("expected v1.3.0, got %q", string(data))
	}
}

// TestReleaseBump verifies the release version increments.
func TestReleaseBump(t *testing.T) {
	tmp := t.TempDir()
	versionFile := filepath.Join(tmp, "VERSION")
	if err := os.WriteFile(versionFile, []byte("v1.2.3"), 0644); err != nil {
		t.Fatalf("setup failed: %v", err)
	}
	_, code := runTool(t, tmp, "release")
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
	data, err := os.ReadFile(versionFile)
	if err != nil {
		t.Fatalf("failed to read VERSION: %v", err)
	}
	if strings.TrimSpace(string(data)) != "v1.2.4" {
		t.Fatalf("expected v1.2.4, got %q", string(data))
	}
}
