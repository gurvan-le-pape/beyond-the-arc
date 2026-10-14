// src/frontend/shared/hooks/useModalDialog.ts
import { type RefObject, useEffect, useRef } from "react";

/**
 * Drives a native `<dialog>` as a modal from a boolean: `showModal()` when
 * `isOpen` turns true, `close()` when it turns false. The page behind stops
 * scrolling while it is open, and gets back whatever overflow it had before.
 *
 * `onDismiss`, if given, runs when the reader closes the dialog themselves —
 * Escape, or a click on the backdrop around its content.
 *
 * @param isOpen - whether the dialog is shown
 * @param onDismiss - called when the reader dismisses the dialog
 * @returns the ref to put on the `<dialog>`
 */
export function useModalDialog(
  isOpen: boolean,
  onDismiss?: () => void,
): RefObject<HTMLDialogElement | null> {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousBodyOverflow = useRef("");

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !onDismiss) return;
    // A click whose target is the dialog itself landed on the backdrop: the
    // content is a child, so a click inside it targets that child.
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) onDismiss();
    };
    dialog.addEventListener("close", onDismiss);
    dialog.addEventListener("click", onBackdropClick);
    return () => {
      dialog.removeEventListener("close", onDismiss);
      dialog.removeEventListener("click", onBackdropClick);
    };
  }, [onDismiss]);

  return dialogRef;
}
