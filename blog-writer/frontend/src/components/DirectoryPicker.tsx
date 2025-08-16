// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React, { useEffect, useState, useCallback } from 'react';
import { Create, List } from '../../wailsjs/go/services/DirectoryService';
import DirectoryTree, { DirNode } from './DirectoryTree';

/** Props for DirectoryPicker component. */
interface DirectoryPickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Called with the chosen directory path. */
  onChange: (path: string) => void;
}

/** Modal dialog allowing navigation and selection of directories. */
function DirectoryModal({ onSelect, onClose }: { onSelect: (p: string) => void; onClose: () => void; }) {
  const [path, setPath] = useState('');
  const [tree, setTree] = useState<DirNode[]>([]);
  const [newName, setNewName] = useState('');

  /** Handles closing the modal when the escape key is pressed. */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const parentDir = (p: string): string => {
    const parts = p.split(/[/\\]/);
    parts.pop();
    return parts.join(p.includes('\\') ? '\\' : '/');
  };

  const baseName = (p: string): string => {
    const parts = p.split(/[/\\]/);
    return parts[parts.length - 1];
  };

  /**
   * buildTree recursively constructs a directory tree rooted at p while preventing cycles.
   */
  const buildTree = async (p: string, visited: Set<string>): Promise<DirNode> => {
    if (visited.has(p)) return { path: p, name: baseName(p), children: [] };
    visited.add(p);
    let children: DirNode[] = [];
    try {
      const list = await List(p);
      children = await Promise.all(list.map((d) => buildTree(d, visited)));
    } catch {
      children = [];
    }
    return { path: p, name: baseName(p) || p, children };
  };

  /** loadTree initializes the directory tree from the user's home directory. */
  const loadTree = async () => {
    const list = await List('');
    const rootPath = list.length > 0 ? parentDir(list[0]) : '';
    const visited = new Set<string>();
    const nodes = await Promise.all(list.map((d) => buildTree(d, visited)));
    setPath(rootPath);
    setTree(nodes);
  };

  useEffect(() => {
    loadTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
      await loadTree();
    } catch {
      // ignore errors; validation handled server-side
    }
  };

  return (
    <div role="dialog" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: 'white', padding: '1rem', maxWidth: '400px', margin: '10% auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span data-testid="current-path">{path}</span>
        </div>
        <div data-testid="tree-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <DirectoryTree nodes={tree} selected={path} onSelect={setPath} />
        </div>
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
  const { style, ...buttonProps } = rest;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ ...pickerButtonStyle, ...(style as React.CSSProperties) }}
        {...buttonProps}
      >
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

/**
 * pickerButtonStyle defines the visual appearance of the DirectoryPicker button,
 * ensuring a 5px border radius and a bevelled outset border to match user
 * expectations.
 */
const pickerButtonStyle: React.CSSProperties = {
  borderRadius: '5px',
  borderStyle: 'outset',
  borderWidth: '2px'
};

