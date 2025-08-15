// Copyright 2024 Blog Writer contributors
import { app } from 'electron';
import { createMainWindow } from './window';

/** Initialize and run the Electron application. */
function init(): void {
  app.whenReady().then(() => {
    const win = createMainWindow();
    console.log('app-ready');
    win.webContents.once('did-finish-load', () => {
      console.log('renderer-loaded');
      if (process.env.E2E_QUIT === '1' || process.env.E2E_QUIT === 'true') {
        app.quit();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

init();
