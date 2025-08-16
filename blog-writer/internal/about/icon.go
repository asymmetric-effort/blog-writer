// Copyright (c) 2025 Asymmetric Effort, LLC. <scaldwell@asymmetric-effort.com>
package about

import _ "embed"

// iconBytes holds the PNG data for the About dialog icon.
// The source image lives in ../../docs/blog-writer.png; copy it here with:
//
//     cp ../../docs/blog-writer.png blog-writer.png
//
//go:embed blog-writer.png
var iconBytes []byte

// Icon returns the PNG image used for the About dialog.
func Icon() []byte {
	return iconBytes
}
