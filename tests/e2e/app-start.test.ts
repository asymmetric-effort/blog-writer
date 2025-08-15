// Copyright 2024 Blog Writer contributors
import { spawn, spawnSync } from 'child_process';
import { join } from 'path';

/** Wait for a specific message in the child process output. */
function waitForMessage(proc: ReturnType<typeof spawn>, msg: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const onData = (data: Buffer) => {
      const text = data.toString();
      if (text.includes(msg)) {
        proc.stdout!.off('data', onData);
        resolve();
      }
    };
    proc.stdout!.on('data', onData);
    proc.on('error', reject);
  });
}

describe('Electron application', () => {
  const electronPath = require('electron') as string;
  const check = spawnSync(electronPath, ['--version']);
  const testFn = check.status === 0 ? it : it.skip;

  testFn('starts and loads the renderer', async () => {
    // Build project
    const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
    await new Promise((resolve, reject) => {
      build.on('exit', code => (code === 0 ? resolve(null) : reject(new Error(`build failed: ${code}`))));
    });

    const proc = spawn(electronPath, ['--headless', join('dist', 'main', 'main.js')], {
      env: { ...process.env, E2E: '1', E2E_QUIT: '1' },
    });

    await waitForMessage(proc, 'renderer-loaded');
  }, 60000);
});
