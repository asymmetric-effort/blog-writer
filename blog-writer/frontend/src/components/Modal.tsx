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
      style={dialogStyle}
    >
      <dialog open style={{ borderRadius: '5px', padding: 0 }}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            padding: '0.5rem',
            borderBottom: '1px solid black',
          }}
        >
          {title}
        </div>
        {children}
      </dialog>
    </div>
  );
}

/**
 * dialogStyle defines the modal's visual appearance.
 */
const dialogStyle: React.CSSProperties = {
  borderRadius: '5px',
  border: '2px outset',
  boxShadow: '10px 10px 10px rgba(0,0,0,0.2)'
};
