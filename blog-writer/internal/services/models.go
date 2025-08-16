// Copyright (c) 2024 blog-writer authors
package services

// Settings represents repository settings stored in .blog-writer/settings.json.
type Settings struct {
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
}
