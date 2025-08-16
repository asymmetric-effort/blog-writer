// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/**
 * MenuBar component renders a toolbar with common editor actions and a help menu.
 * Each action is represented by a button containing a unicode icon.
 */
import React, { useState } from 'react';
import './MenuBar.css';
import Modal from './Modal';
import About from './About';
import Documentation from './Documentation';
import BugReport from './BugReport';

/** Interface describing a toolbar action. */
interface Action {
  /** Accessible label for the action button. */
  label: string;
  /** Icon character representing the action. */
  icon: string;
}

/** Collection of toolbar actions in display order. */
export const actions: Action[] = [
  { label: 'Create Article', icon: '📝' },
  { label: 'Save Article', icon: '💾' },
  { label: 'Cut', icon: '✂️' },
  { label: 'Copy', icon: '📋' },
  { label: 'Paste', icon: '📥' },
  { label: 'Bold', icon: '𝐁' },
  { label: 'Italic', icon: '𝑰' },
  { label: 'Underline', icon: 'U̲' },
  { label: 'Font', icon: '🔤' },
  { label: 'Font Size', icon: '🔠' },
  { label: 'Font Color', icon: '🖌️' },
  { label: 'Background Color', icon: '🎨' },
  { label: 'Insert Link', icon: '🔗' },
  { label: 'Insert Image', icon: '🖼️' }
];

/**
 * MenuBar renders a horizontal toolbar of icon buttons and the help menu.
 */
export function MenuBar(): JSX.Element {
  const [helpOpen, setHelpOpen] = useState(false);
  const [dialog, setDialog] = useState<'about' | 'docs' | 'bug' | null>(null);

  const openAbout = () => { setDialog('about'); setHelpOpen(false); };
  const openDocs = () => { setDialog('docs'); setHelpOpen(false); };
  const openBug = () => { setDialog('bug'); setHelpOpen(false); };

  return (
    <div className="menu-bar">
      {actions.map(action => (
        <button
          key={action.label}
          type="button"
          className="menu-button"
          aria-label={action.label}
          title={action.label}
        >
          <span>{action.icon}</span>
        </button>
      ))}
      <div className="help-menu">
        <button
          type="button"
          className="menu-button"
          aria-haspopup="true"
          aria-expanded={helpOpen}
          onClick={() => setHelpOpen(o => !o)}
        >
          Help
        </button>
        {helpOpen && (
          <ul className="dropdown" role="menu">
            <li><button type="button" role="menuitem" onClick={openAbout}>About...</button></li>
            <li><button type="button" role="menuitem" onClick={openDocs}>Read the docs</button></li>
            <li><button type="button" role="menuitem" onClick={openBug}>Report a bug</button></li>
          </ul>
        )}
      </div>
      <Modal open={dialog === 'about'} title="About Blog Writer">
        <About onClose={() => setDialog(null)} />
      </Modal>
      <Modal open={dialog === 'docs'} title="Blog Writer docs">
        <Documentation onClose={() => setDialog(null)} />
      </Modal>
      <Modal open={dialog === 'bug'} title="Bug Reporting">
        <BugReport onClose={() => setDialog(null)} />
      </Modal>
    </div>
  );
}

export default MenuBar;

