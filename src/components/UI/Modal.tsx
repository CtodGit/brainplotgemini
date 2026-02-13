import React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CircleX } from '../Navigation/CircleX';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, headerActions }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-container">
            {title && <h2>{title}</h2>}
          </div>
          <div className="modal-header-actions">
            {headerActions}
            <CircleX onClick={onClose} className="modal-close-btn" />
          </div>
        </header>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
