// src/frontend/shared/components/primitives/BottomSheet.tsx
"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDragStart = (clientY: number) => {
    dragStartY.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = (clientY: number) => {
    if (dragStartY.current === null) return;
    setDragOffset(Math.max(0, clientY - dragStartY.current));
  };

  const handleDragEnd = () => {
    const sheetHeight = dialogRef.current?.offsetHeight ?? 300;
    if (dragOffset > sheetHeight * 0.35) onClose();
    dragStartY.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();
    globalThis.addEventListener("mousemove", onMouseMove);
    globalThis.addEventListener("mouseup", onMouseUp);
    return () => {
      globalThis.removeEventListener("mousemove", onMouseMove);
      globalThis.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <dialog
      key="bottom-sheet"
      ref={dialogRef}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 md:hidden",
        "surface-raised",
        "rounded-t-2xl shadow-2xl",
        "max-h-[90vh] w-full max-w-full flex flex-col",
        "p-0 m-0",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        !isDragging && "transition-transform duration-300",
      )}
      style={{ transform: `translateY(${dragOffset}px)` }}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="Drag to close"
        className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none w-full"
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
      >
        <div className="w-10 h-1 rounded-full bg-divide" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-divide">
        <span className="text-base font-semibold text-text-heading">
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-button text-text-muted hover:bg-surface-inset transition-colors"
          aria-label="Close filters"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-5 py-4 border-t border-divide">{footer}</div>
      )}
    </dialog>
  );
}

export default BottomSheet;
