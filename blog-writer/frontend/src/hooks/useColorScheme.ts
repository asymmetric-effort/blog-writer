// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from 'react';

/**
 * useColorScheme detects the operating system's color scheme preference.
 * @returns {'light' | 'dark'} The preferred color scheme.
 */
export default function useColorScheme(): 'light' | 'dark' {
  const getScheme = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [scheme, setScheme] = useState<'light' | 'dark'>(getScheme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => setScheme(media.matches ? 'dark' : 'light');
    media.addEventListener?.('change', listener);
    return () => media.removeEventListener?.('change', listener);
  }, []);

  return scheme;
}
