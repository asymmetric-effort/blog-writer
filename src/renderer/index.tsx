/**
 * Copyright 2024 Blog Writer
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { RepoWizard } from './pages/RepoWizard';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<RepoWizard />);
}
