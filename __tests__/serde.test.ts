/**
 * Copyright 2024 Blog Writer
 */

import { describe, it, expect } from 'vitest';
import { fromHtml, toHtml } from '../src/lib/serde';
import type { Node } from '../src/types/article';

describe('serde', () => {
  it('round trips simple paragraph', () => {
    const nodes: Node[] = [{ tag: 'p', content: 'hello' }];
    const html = toHtml(nodes);
    const back = fromHtml(html);
    expect(back).toEqual(nodes);
  });
});
