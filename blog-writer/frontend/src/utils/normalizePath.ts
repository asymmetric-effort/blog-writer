// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

/**
 * Normalize a filesystem path using the host platform's separator.
 *
 * This implementation is browser friendly and avoids relying on Node.js
 * built-ins so it can be used within the frontend bundle and during unit
 * tests. It collapses duplicate separators, resolves ``.`` and ``..``
 * segments and converts mixed ``/`` and ``\\`` separators to the correct
 * form for the current operating system.
 *
 * @param p - Path to normalize.
 * @returns Path formatted for the current operating system.
 */
export function normalizePath(p: string): string {
  const isWindows =
    typeof navigator !== 'undefined' &&
    /windows/i.test(navigator.userAgent);
  const sep = isWindows ? '\\' : '/';
  const segments = p.replace(/[\\/]+/g, '/').split('/');
  const stack: string[] = [];

  for (const segment of segments) {
    if (!segment || segment === '.') continue;
    if (segment === '..') stack.pop();
    else stack.push(segment);
  }

  return stack.join(sep);
}

