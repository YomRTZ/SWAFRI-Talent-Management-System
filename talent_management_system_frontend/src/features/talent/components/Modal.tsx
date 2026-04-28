import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent render when closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-fg backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal box */}
      <div
        className="relative w-full max-w-3xl mx-auto bg-surface border border-white/10 rounded-2xl shadow-xl p-4 sm:p-8 z-10 animate-in fade-in zoom-in duration-200 min-h-[120px] max-h-[90vh] overflow-y-auto"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none text-2xl "
          style={{ zIndex: 20 }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {children}
      </div>
    </div>
  );
}