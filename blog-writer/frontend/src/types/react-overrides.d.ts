// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

/**
 * Augment React's input attributes to support the non-standard `webkitdirectory`
 * attribute used for directory selection in file input elements.
 */
import 'react';

declare module 'react' {
  interface InputHTMLAttributes<T> {
    /**
     * When present on an `<input type="file">` element, enables directory
     * selection instead of a single file.
     */
    webkitdirectory?: string;
  }
}

export {};

