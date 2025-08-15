/**
 * Copyright 2024 Blog Writer
 */

import React, { useState } from 'react';

export function RepoWizard(): JSX.Element {
  const [path, setPath] = useState('');
  const [remote, setRemote] = useState('');

  const openExisting = (): void => {
    console.log('open', path);
  };

  const createFromRemote = (): void => {
    console.log('create', remote, path);
  };

  return (
    <div>
      <h1>Repository Wizard</h1>
      <section>
        <h2>Open Existing</h2>
        <input value={path} onChange={(e) => setPath(e.target.value)} />
        <button onClick={openExisting}>Open</button>
      </section>
      <section>
        <h2>Create From Remote</h2>
        <input
          placeholder="SSH URL"
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
        />
        <input
          placeholder="Local Path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <button onClick={createFromRemote}>Create</button>
      </section>
    </div>
  );
}
