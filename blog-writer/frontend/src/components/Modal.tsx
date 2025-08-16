// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React from 'react';

/**
 * Modal wraps content in a dialog element displayed above the main window with a
 * visual distinction including an outset border and a drop shadow offset by
 * 10 pixels to the right and bottom.
 */
interface ModalProps {
  /** True if the modal should be displayed. */
  open: boolean;
  /** Title text shown in the modal title bar. */
  title: string;
  /** Content to display within the modal. */
  children: React.ReactNode;
}

export default function Modal({ open, title, children }: ModalProps): JSX.Element | null {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      data-testid="modal-overlay"
      style={overlayStyle}
    >
      <dialog open style={dialogStyle}>
        <div style={headerStyle}>{title}</div>
        {children}
      </dialog>
    </div>
  );
}

/**
 * overlayStyle positions and styles the translucent backdrop.
 */
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)'
};

/**
 * dialogStyle defines the modal's visual appearance.
 */
const dialogStyle: React.CSSProperties = {
  borderRadius: '5px',
  padding: 0,
  border: '2px outset',
  boxShadow: '10px 10px 10px rgba(0,0,0,0.2)'
};

/**
 * headerStyle matches the app window styling without a separating border.
 */
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  padding: '0.5rem',
  backgroundColor: 'rgba(27, 38, 54, 1)',
  color: 'white'
};
