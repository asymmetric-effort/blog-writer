/**
 * Copyright 2024 Blog Writer
 */

import type { ArticleFile } from '../types/article';

export interface BlogWriterAPI {
  validate(article: ArticleFile): { ok: true } | { ok: false; error: string };
}
