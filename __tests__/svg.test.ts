/**
 * Copyright 2024 Blog Writer
 */

import { describe, it, expect } from 'vitest';
import { sanitizeSvg } from '../src/image/sanitize-svg';
import { encodeSvg } from '../src/image/encode';

describe('svg pipeline', () => {
  it('removes script tags', () => {
    const dirty = '<svg><script>alert(1)</script><circle /></svg>';
    const clean = sanitizeSvg(dirty);
    expect(clean).not.toContain('script');
  });

  it('encodes as data uri', () => {
    const svg = '<svg></svg>';
    const uri = encodeSvg(svg);
    expect(uri.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });
});
