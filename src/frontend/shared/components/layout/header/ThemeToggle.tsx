// src/frontend/shared/components/layout/header/ThemeToggle.tsx
"use client";

import { Eye, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/utils";

/**
 * `labelKey`, not `label`: these three are visible menu text, so they belong
 * in the catalogue like every other user-facing string. They were hardcoded
 * English and rendered as-is to French users, while the two `aria-label`s
 * below went through next-intl correctly.
 *
 * The keys are written out rather than built from `id` (`header.themes.${id}`
 * would be shorter). A literal key stays greppable, which is what lets the
 * orphaned-key sweep see it — and `id` is `"high-contrast"`, which would need
 * a hyphenated key just to keep the two in step.
 */
const THEMES = [
  { id: "light", labelKey: "header.themes.light", Icon: Sun },
  { id: "dark", labelKey: "header.themes.dark", Icon: Moon },
  { id: "high-contrast", labelKey: "header.themes.highContrast", Icon: Eye },
] as const;

/**
 * Theme picker — dropdown with all 3 themes.
 * Trigger icon reflects the active theme.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("navigation");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Placeholder — prevents hydration mismatch and layout shift
  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-button hover:bg-surface-subtle transition-colors"
        aria-label={t("header.toggleTheme")}
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  // Not `(t) =>`: that would shadow the translation function the labels
  // below resolve their messages with.
  const active = THEMES.find((entry) => entry.id === theme) ?? THEMES[0];
  const ActiveIcon = active.Icon;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "p-2 rounded-button transition-all duration-200",
          "hover:bg-surface-subtle",
          "focus-ring",
          isOpen && "bg-surface-subtle",
        )}
        aria-label={t("header.toggleTheme")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <ActiveIcon className="w-5 h-5 text-text-emphasis" />
      </button>

      <div
        role="menu"
        aria-label={t("header.selectTheme")}
        // Without this the three theme buttons stay tabbable and the menu
        // stays in the accessibility tree while closed — on every page, since
        // this lives in the header.
        inert={!isOpen}
        className={cn(
          "absolute right-0 mt-1 w-44 z-dropdown",
          "bg-surface-raised border border-divide rounded-input shadow-card-hover",
          "transition-all duration-200 origin-top-right",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        {THEMES.map(({ id, labelKey, Icon }) => {
          const isActive = theme === id;
          return (
            <button
              type="button"
              key={id}
              role="menuitemradio"
              aria-checked={isActive}
              onClick={() => {
                setTheme(id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150",
                "first:rounded-t-input last:rounded-b-input",
                isActive
                  ? "bg-solid-primary text-on-solid-primary"
                  : "text-text-body hover:bg-surface-subtle hover:text-text-heading",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
