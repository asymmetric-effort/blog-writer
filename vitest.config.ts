/**
 * Copyright 2024 Blog Writer
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['src/main/main.ts', 'src/preload/index.ts', 'src/renderer/**', 'src/lib/serde.ts']
    }
  }
});
