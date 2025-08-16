// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React, { useCallback, useRef } from 'react';

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
   * file input when unsupported.
   */
  const handleClick = useCallback(async () => {
    try {
      // @ts-ignore - showDirectoryPicker is not yet in TypeScript lib.dom
      if (window.showDirectoryPicker) {
        // @ts-ignore
        const handle = await window.showDirectoryPicker();
        const path = (handle as any).path || (handle as any).name || '';
        onChange(path);
        return;
      }
    } catch {
      // Ignore and fall back to the hidden input below.
    }
    inputRef.current?.click();
  }, [onChange]);

  /**
   * Extracts the directory path from the chosen file when using the fallback
   * input element.
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0] as File & { path?: string };
      const fullPath = file.path || '';
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
      onChange(dir);
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
