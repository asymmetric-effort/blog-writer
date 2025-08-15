// Copyright 2024 Blog Writer contributors
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/** Bootstrap the React renderer. */
function bootstrap(): void {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }
  const root = createRoot(container);
  root.render(<App />);
}

bootstrap();
