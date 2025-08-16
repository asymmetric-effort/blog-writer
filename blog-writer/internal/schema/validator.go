// Copyright (c) 2024 blog-writer authors
// Package schema provides JSON validation utilities.

package schema

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"sync"

	"github.com/santhosh-tekuri/jsonschema/v5"
)

var (
	compiled   *jsonschema.Schema
	compileErr error
	once       sync.Once
)

// getSchema compiles the JSON schema once.
func getSchema() (*jsonschema.Schema, error) {
	once.Do(func() {
		_, file, _, _ := runtime.Caller(0)
		path := filepath.Join(filepath.Dir(file), "..", "..", "src", "schema", "article.schema.json")
		data, err := os.ReadFile(path)
		if err != nil {
			compileErr = err
			return
		}
		compiler := jsonschema.NewCompiler()
		if err := compiler.AddResource(path, bytes.NewReader(data)); err != nil {
			compileErr = err
			return
		}
		compiled, compileErr = compiler.Compile(path)
	})
	return compiled, compileErr
}

// Validate checks the provided JSON document against the article schema.
func Validate(data []byte) error {
	schema, err := getSchema()
	if err != nil {
		return err
	}
	var v interface{}
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}
	return schema.Validate(v)
}
