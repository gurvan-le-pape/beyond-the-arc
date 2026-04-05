// src/frontend/shared/components/primitives/BottomSheet.tsx
"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

import { cn } from "@/shared/utils/cn";

interface BottomSheetProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:hidden"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm",
          "animate-in fade-in duration-200",
        )}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "relative w-full bg-surface-raised dark:bg-surface-raised-dark",
          "rounded-t-2xl shadow-2xl",
          "max-h-[90vh] flex flex-col",
          "animate-in slide-in-from-bottom duration-300",
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-divide-light dark:bg-divide-dark" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-divide-light dark:border-divide-dark">
          <span className="text-base font-semibold text-text-heading dark:text-text-heading-dark">
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-button text-text-muted dark:text-text-muted-dark hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark transition-colors"
            aria-label="Close filters"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-divide-light dark:border-divide-dark">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomSheet;
