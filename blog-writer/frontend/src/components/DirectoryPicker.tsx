// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from 'react';
import { Create, List } from '../../wailsjs/go/services/DirectoryService';

/** Props for DirectoryPicker component. */
interface DirectoryPickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Called with the chosen directory path. */
  onChange: (path: string) => void;
}

/** Modal dialog allowing navigation and selection of directories. */
function DirectoryModal({ onSelect, onClose }: { onSelect: (p: string) => void; onClose: () => void; }) {
  const [path, setPath] = useState('');
  const [dirs, setDirs] = useState<string[]>([]);
  const [newName, setNewName] = useState('');

  const parentDir = (p: string): string => {
    const parts = p.split(/[/\\]/);
    parts.pop();
    return parts.join(p.includes('\\') ? '\\' : '/');
  };

  const baseName = (p: string): string => {
    const parts = p.split(/[/\\]/);
    return parts[parts.length - 1];
  };

  const load = async (p: string) => {
    const list = await List(p);
    setDirs(list);
    if (p === '' && list.length > 0) {
      setPath(parentDir(list[0]));
    } else if (p !== '') {
      setPath(p);
    }
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (d: string) => {
    load(d);
  };

  const goUp = () => {
    if (path) {
      const parent = parentDir(path);
      load(parent);
    }
  };

  const handleCreate = async () => {
    if (!newName) return;
    try {
      await Create(path, newName);
      setNewName('');
      await load(path);
    } catch {
      // ignore errors; validation handled server-side
    }
  };

  return (
    <div role="dialog" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: 'white', padding: '1rem', maxWidth: '400px', margin: '10% auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span data-testid="current-path">{path}</span>
          <button onClick={goUp}>Up</button>
        </div>
        <ul>
          {dirs.map((d) => (
            <li key={d}>
              <button onClick={() => navigate(d)} data-testid="dir-item">
                {baseName(d)}
              </button>
            </li>
          ))}
        </ul>
        <div>
          <input
            placeholder="New Directory"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleCreate} data-testid="create-btn">Create</button>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button onClick={() => { onSelect(path); }}>Select</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/** DirectoryPicker renders a button that opens DirectoryModal. */
export default function DirectoryPicker({ onChange, ...rest }: DirectoryPickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} {...rest}>
        Browse…
      </button>
      {open && (
        <DirectoryModal
          onSelect={(p) => {
            onChange(p);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

