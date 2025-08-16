// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React from 'react';

/**
 * Modal wraps content in a dialog element displayed above the main window.
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
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
        <div style={{ padding: '0.5rem' }}>{children}</div>
      </dialog>
    </div>
  );
}
