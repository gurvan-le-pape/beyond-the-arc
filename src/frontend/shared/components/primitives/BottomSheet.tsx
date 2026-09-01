// src/frontend/shared/components/primitives/BottomSheet.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/utils";

interface BottomSheetProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
}

/**
 * A drag-to-dismiss sheet anchored to the bottom of the viewport, built on a
 * native `<dialog>` so focus trapping and the backdrop come from the platform.
 *
 * **`isOpen` drives the modal, not the mount.** The effect runs against
 * `[isOpen]` and calls `showModal()`/`close()` from it, so both usage patterns
 * work: keep the sheet mounted and toggle the prop (as `FiltersShell` does), or
 * mount it only while open. The original contract — `showModal()` once on
 * mount, close by unmounting — silently rendered nothing when a caller kept the
 * sheet mounted and flipped `isOpen`, because the mount-time effect ran before
 * the dialog existed in the DOM.
 *
 * **Mobile only, and the caller must enforce that.** The sheet carries
 * `md:hidden`, which hides it without preventing it: rendered open on a wide
 * viewport it would still take the top layer and lock body scroll behind a
 * `display: none` element. Gate it at the call site, as `FiltersShell` does.
 *
 * `onClose` fires on the close button, on backdrop dismissal via `onCancel`,
 * and once a drag passes roughly a third of the sheet's height.
 */
export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: BottomSheetProps) {
  const tCommon = useTranslations("common");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartY = useRef<number | null>(null);
  // The offset is read from a ref in `handleDragEnd` so that callback can be
  // stable — otherwise it is recreated on every drag frame and the
  // mousemove/mouseup listeners below rebind on every move.
  const dragOffsetRef = useRef(0);
  // Remember the caller's own overflow so restoring it later does not clobber
  // a value that was already set before this sheet opened.
  const previousBodyOverflow = useRef("");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      previousBodyOverflow.current = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = previousBodyOverflow.current;
    }
    return () => {
      document.body.style.overflow = previousBodyOverflow.current;
    };
  }, [isOpen]);

  const handleDragStart = (clientY: number) => {
    dragStartY.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = useCallback((clientY: number) => {
    if (dragStartY.current === null) return;
    const offset = Math.max(0, clientY - dragStartY.current);
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  }, []);

  const handleDragEnd = useCallback(() => {
    const sheetHeight = dialogRef.current?.offsetHeight ?? 300;
    if (dragOffsetRef.current > sheetHeight * 0.35) onClose();
    dragStartY.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  }, [onClose]);

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
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen) return null;

  return (
    <dialog
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
      <button
        type="button"
        aria-label={tCommon("dragToClose")}
        className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none w-full"
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onKeyDown={(e) => {
          // Enter and Space both close, matching native button activation;
          // Space's default (page scroll) must be suppressed.
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
      >
        <div className="w-10 h-1 rounded-full bg-divide" />
      </button>

      <div className="flex items-center justify-between px-5 py-3 border-b border-divide">
        <span className="text-base font-semibold text-text-heading">
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-button text-text-muted hover:bg-surface-subtle transition-colors"
          aria-label={tCommon("close")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

      {footer && (
        <div className="px-5 py-4 border-t border-divide">{footer}</div>
      )}
    </dialog>
  );
}

export default BottomSheet;
