/**
 * Copyright 2024 Blog Writer
 */

import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { initRepo, status, commitAll } from '../src/main/git';

function tmpRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'repo-'));
  initRepo(dir);
  return dir;
}

describe('git layer', () => {
  it('commits files', () => {
    const repo = tmpRepo();
    writeFileSync(join(repo, 'test.txt'), 'hello');
    expect(status(repo)).toContain('??');
    commitAll(repo, 'chore: add test');
    expect(status(repo).trim()).toBe('');
  });
});
