// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"tools/version"
)

// main is the entry point for the versioning CLI.
func main() {
	versionFile := flag.String("file", filepath.Join(".", "VERSION"), "path to VERSION file")
	flag.Parse()
	args := flag.Args()
	if len(args) == 0 {
		fmt.Println("Usage: versioning [major|minor|release]")
		return
	}
	level := args[0]
	v, err := version.Run(level, *versionFile)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Printf("v%d.%d.%d\n", v.Major, v.Minor, v.Release)
}
