// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import path from 'path';

/**
 * Normalize a filesystem path using the host platform's separator.
 *
 * @param p - Path to normalize.
 * @returns Path formatted for the current operating system.
 */
export function normalizePath(p: string): string {
  return path.normalize(p);
}

