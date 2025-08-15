// Copyright 2024 Blog Writer contributors
import { jest } from '@jest/globals';

// Mock electron's BrowserWindow
jest.mock('electron', () => {
  return {
    BrowserWindow: jest.fn().mockImplementation(() => ({
      loadFile: jest.fn(),
    })),
  };
});

import type { BrowserWindow } from 'electron';
import { createMainWindow } from './window';

describe('createMainWindow', () => {
  it('creates a BrowserWindow and loads index.html', () => {
    const win = createMainWindow();
    const electron = require('electron');
    expect(electron.BrowserWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        webPreferences: expect.objectContaining({ preload: expect.any(String) }),
      })
    );
    expect((win as unknown as { loadFile: jest.Mock }).loadFile).toHaveBeenCalled();
  });
});
