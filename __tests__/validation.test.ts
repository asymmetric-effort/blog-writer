/**
 * Copyright 2024 Blog Writer
 */

import { describe, it, expect } from 'vitest';
import { validateArticle } from '../src/main/validation';
import type { ArticleFile } from '../src/types/article';

describe('validateArticle', () => {
  it('accepts valid article', () => {
    const article: ArticleFile = {
      version: '1.0.0',
      metadata: { title: 'Test' },
      content: [{ tag: 'p', content: 'hello' }]
    };
    expect(() => validateArticle(article)).not.toThrow();
  });

  it('rejects invalid article', () => {
    const article = { foo: 'bar' } as unknown;
    expect(() => validateArticle(article)).toThrow();
  });
});
