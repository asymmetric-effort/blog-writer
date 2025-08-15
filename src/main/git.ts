/**
 * Copyright 2024 Blog Writer
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function run(dir: string, args: string[]): string {
  return execFileSync('git', args, { cwd: dir, stdio: 'pipe' }).toString();
}

export function initRepo(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  run(dir, ['init']);
}

export function status(dir: string): string {
  return run(dir, ['status', '--porcelain']);
}

export function commitAll(dir: string, message: string): void {
  run(dir, ['add', '.']);
  run(dir, ['commit', '-m', message]);
}

export function createFromRemote(remote: string, localPath: string): void {
  initRepo(localPath);
  run(localPath, ['remote', 'add', 'origin', remote]);
  const blogDir = join(localPath, 'blog');
  const settingsDir = join(localPath, '.blog-writer');
  if (!existsSync(blogDir)) mkdirSync(blogDir);
  if (!existsSync(settingsDir)) mkdirSync(settingsDir);
  writeFileSync(join(settingsDir, 'settings.json'), '{}', 'utf8');
  commitAll(localPath, 'chore: initial commit');
}
