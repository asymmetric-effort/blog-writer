// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React from 'react';

/**
 * Modal wraps content in a dialog element displayed above the main window.
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
    <dialog open>
      {children}
    </dialog>
  );
}
