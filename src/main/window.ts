// Copyright 2024 Blog Writer contributors
import { BrowserWindow } from 'electron';
import { join } from 'path';

/**
 * Create the main application window.
 * @returns The created BrowserWindow instance.
 */
export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });
  win.loadFile(join(__dirname, 'renderer', 'index.html'));
  return win;
}
