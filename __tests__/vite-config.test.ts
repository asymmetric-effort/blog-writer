/**
 * Copyright 2024 Blog Writer
 *
 * @fileoverview Tests Vite configuration for correct server exposure.
 */

import { describe, expect, it } from 'vitest';

import config from '../vite.config';

describe('Vite configuration', () => {
  it('should expose server to all network interfaces', () => {
    // host true or '0.0.0.0'
    expect(config?.server?.host).toBe('0.0.0.0');
  });
});
