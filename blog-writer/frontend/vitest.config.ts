// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom'
  }
});
