// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />

import { describe, it, expect } from 'vitest';
import path from 'path';
import { normalizePath } from '../normalizePath';

/**
 * Tests for normalizePath utility.
 */
describe('normalizePath', () => {
  it('converts mixed separators to host format', () => {
    const input = 'a/b\\c';
    const expected = path.normalize(input);
    expect(normalizePath(input)).toBe(expected);
  });
});

