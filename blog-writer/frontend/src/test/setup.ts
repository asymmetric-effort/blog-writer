// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
import '@testing-library/jest-dom';
import { vi } from 'vitest';

(window as any).go = {
  services: {
    RepoService: {
      Recent: vi.fn(),
      Open: vi.fn(),
      Create: vi.fn()
    },
    TreeService: {
      List: vi.fn()
    }
  }
};
