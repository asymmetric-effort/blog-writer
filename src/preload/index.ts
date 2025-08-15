/**
 * Copyright 2024 Blog Writer
 */

import { contextBridge } from 'electron';
import { validateArticle } from '../main/validation';
import type { BlogWriterAPI } from './api';

const api: BlogWriterAPI = {
  validate(article) {
    try {
      validateArticle(article);
      return { ok: true } as const;
    } catch (err) {
      return { ok: false, error: (err as Error).message } as const;
    }
  }
};

contextBridge.exposeInMainWorld('blogWriter', api);

declare global {
  interface Window {
    blogWriter: BlogWriterAPI;
  }
}
