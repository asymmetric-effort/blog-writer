// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React, { useCallback, useRef } from 'react';
import { CanResolveFilePaths, ResolveFilePaths } from '../../wailsjs/runtime/runtime';

/**
 * DirectoryPicker renders a directory selector used by RepoWizard forms.
 *
 * It prefers the File System Access API when available and falls back to a
 * hidden `<input type="file" webkitdirectory>` element otherwise. The
 * resulting dialog allows users to create new directories and the selected
 * directory path is returned via the `onChange` callback.
 */
interface DirectoryPickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Callback invoked with the selected path. */
  onChange: (path: string) => void;
}

export default function DirectoryPicker({ onChange, ...rest }: DirectoryPickerProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Triggers directory selection using File System Access API or the fallback
   * file input when unsupported. Some environments (e.g., Wails) return a
   * string path instead of a directory handle; this function normalizes the
   * result and falls back to the hidden input if a path cannot be determined.
   */
  const handleClick = useCallback(async () => {
    try {
      // @ts-ignore - showDirectoryPicker is not yet in TypeScript lib.dom
      if (window.showDirectoryPicker) {
        // @ts-ignore
        const handle = await window.showDirectoryPicker();
        if (typeof handle === 'string') {
          onChange(handle);
          return;
        }
        const path = (handle as any).path || (handle as any).name;
        if (path) {
          onChange(path);
          return;
        }
      }
    } catch {
      // Ignore and fall back to the hidden input below.
    }
    inputRef.current?.click();
  }, [onChange]);

  /**
   * Extracts the directory path from the chosen file when using the fallback
   * input element. Handles both POSIX and Windows path separators.
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        if (CanResolveFilePaths()) {
          ResolveFilePaths(Array.from(files));
        }
      } catch {
        // runtime not available; continue without resolving
      }
      const file = files[0] as File & { path?: string };
      const fullPath = file.path || '';
      if (fullPath) {
        const separator = fullPath.includes('/') ? '/' : '\\';
        const dir = fullPath.substring(0, fullPath.lastIndexOf(separator));
        onChange(dir);
      }
    }
  }, [onChange]);

  return (
    <>
      <button type="button" onClick={handleClick} {...rest}>
        Browse…
      </button>
      <input
        ref={inputRef}
        type="file"
        // @ts-ignore -- non-standard attributes widely supported
        webkitdirectory=""
        // @ts-ignore
        directory=""
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
    </>
  );
}
