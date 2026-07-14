'use client';

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[1000] animate-fade-overlay overflow-y-auto h-screen"
      onClick={onClose}
    >
      {/* Centering wrapper — allows scrolling on small screens */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="bg-bg-card border border-border rounded-2xl w-full max-w-[500px] shadow-2xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-bg-primary sticky top-0 z-10 rounded-t-2xl">
            <h2 className="text-lg font-semibold text-text-primary m-0">{title}</h2>
            <button
              className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-lg flex items-center justify-center transition-all hover:bg-bg-hover hover:text-text-primary"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 modal-form">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Exported class helpers for forms inside Modal */
export const formStyles = {
  formGroup: "mb-5",
  formActions: "flex justify-end gap-4 mt-8",
  cancelBtn: "px-5 py-3 bg-transparent text-text-secondary border border-border rounded-lg font-medium cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary",
  submitBtn: "px-5 py-3 bg-accent-primary text-white border-none rounded-lg font-semibold cursor-pointer transition-all hover:opacity-90",
};
