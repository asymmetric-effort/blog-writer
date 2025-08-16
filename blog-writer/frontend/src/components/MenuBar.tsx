// Copyright (c) 2025 Sam Caldwell
/**
 * MenuBar component renders a toolbar with common editor actions.
 * Each action is represented by a button containing a unicode icon.
 */
import React from 'react';
import './MenuBar.css';

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
 * MenuBar renders a horizontal toolbar of icon buttons.
 */
export function MenuBar(): JSX.Element {
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
    </div>
  );
}

export default MenuBar;
