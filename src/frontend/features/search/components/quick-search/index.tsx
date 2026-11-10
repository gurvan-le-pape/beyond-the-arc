// src/frontend/features/search/components/quick-search/index.tsx
"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Button as AriaButton,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";

import { useRouter } from "@/navigation";

import { QuickSearchPanel } from "./QuickSearchPanel";

const subscribeNever = () => () => {};

/**
 * Whether the reader's keyboard says ⌘ rather than Ctrl. Unknown on the
 * server, so the hint renders only once the client has answered.
 */
function useShortcutLabel(): string | null {
  return useSyncExternalStore(
    subscribeNever,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => null,
  );
}

/**
 * Find a club, team or player by name from any page: a field in the header
 * (an icon below `xl`, where the header has no room for the field) and ⌘K /
 * Ctrl+K anywhere open a dialog that searches the three at once and jumps
 * straight to the picked page. Browsing with filters is Explore's job; the
 * dialog's last row hands the term over to it.
 *
 * React Aria's modal supplies the dialog: focus moves into the field, Tab
 * stays inside, Escape or a click outside closes it and returns focus to the
 * trigger. The shortcut is a document listener, since it must work wherever
 * focus is — inside a text field too, which is why it requires the modifier.
 * The panel mounts with the dialog, so every opening starts from an empty
 * field.
 */
export function QuickSearch() {
  const t = useTranslations("search.quick");
  const router = useRouter();
  const shortcut = useShortcutLabel();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      event.preventDefault();
      setIsOpen(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <AriaButton
        aria-label={t("open")}
        className="flex h-10 items-center gap-2.5 rounded-full px-2.5 text-sm text-text-secondary transition-colors hover:text-text-heading focus-ring xl:min-w-56 xl:border xl:border-divide xl:bg-surface-base xl:pl-3.5 xl:pr-2"
      >
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 xl:h-4 xl:w-4" />
        <span className="hidden flex-1 whitespace-nowrap text-left xl:inline">{t("open")}…</span>
        {shortcut && (
          <kbd
            aria-hidden="true"
            className="hidden rounded-md border border-divide px-1.5 py-0.5 font-sans text-xs text-text-secondary xl:inline"
          >
            {shortcut}
          </kbd>
        )}
      </AriaButton>
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-modal flex items-start justify-center bg-black/40 px-3 pt-[12vh] backdrop-blur-sm data-[entering]:animate-popover-in data-[exiting]:animate-popover-out"
      >
        <Modal className="w-full max-w-xl">
          <Dialog
            aria-label={t("title")}
            className="surface-raised overflow-hidden rounded-2xl border border-divide shadow-card-hover focus-visible:outline-none"
          >
            <QuickSearchPanel onNavigate={navigate} />
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
