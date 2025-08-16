// Copyright (c) 2024 blog-writer authors
// Tests for schema validation.

package schema

import "testing"

const validExample = `{
  "version":"1.0.0",
  "metadata":{
    "title":"Test",
    "author":"Author",
    "description":"Desc",
    "publicationDate":"2024-01-01T00:00:00Z",
    "updatedDate":"2024-01-01T00:00:00Z",
    "keywords":["test"]
  },
  "document":[{"tag":"p","content":[{"tag":"span","content":"hello"}]}]
}`

const invalidExample = `{
  "version":"1.0.0",
  "metadata":{
    "title":"Test",
    "author":"Author",
    "description":"Desc",
    "publicationDate":"2024-01-01T00:00:00Z",
    "updatedDate":"2024-01-01T00:00:00Z",
    "keywords":["test"]
  },
  "document":[{"tag":"invalid"}]
}`

// TestValidateValid ensures a well-formed document passes validation.
func TestValidateValid(t *testing.T) {
	if err := Validate([]byte(validExample)); err != nil {
		t.Fatalf("expected valid example to pass: %v", err)
	}
}

// TestValidateInvalid ensures an invalid document fails validation.
func TestValidateInvalid(t *testing.T) {
	if err := Validate([]byte(invalidExample)); err == nil {
		t.Fatalf("expected validation error")
	}
}
