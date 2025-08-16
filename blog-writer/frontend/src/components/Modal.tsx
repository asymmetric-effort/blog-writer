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
  /** Content to display within the modal. */
  children: React.ReactNode;
}

export default function Modal({ open, children }: ModalProps): JSX.Element | null {
  if (!open) return null;
  return (
    <dialog open style={dialogStyle}>
      {children}
    </dialog>
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
