// src/frontend/shared/components/layout/header/ThemeToggle.tsx
"use client";

import { EyeIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/utils/cn";

const THEMES = [
  { id: "light", label: "Light", Icon: SunIcon },
  { id: "dark", label: "Dark", Icon: MoonIcon },
  { id: "high-contrast", label: "High contrast", Icon: EyeIcon },
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
        className="p-2 rounded-button hover:bg-surface-subtle transition-colors"
        aria-label={t("header.toggleTheme")}
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const ActiveIcon = active.Icon;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "p-2 rounded-button transition-all duration-200",
          "hover:bg-surface-subtle",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "focus:ring-offset-2 focus:ring-offset-surface-raised",
          isOpen && "bg-surface-subtle",
        )}
        aria-label={t("header.toggleTheme")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ActiveIcon className="w-5 h-5 text-text-emphasis" />
      </button>

      {/* Dropdown */}
      <div
        role="menu"
        aria-label="Select theme"
        className={cn(
          "absolute right-0 mt-1 w-44 z-50",
          "bg-surface-raised border border-divide rounded-input shadow-card-hover",
          "transition-all duration-200 origin-top-right",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        {THEMES.map(({ id, label, Icon }) => {
          const isActive = theme === id;
          return (
            <button
              key={id}
              role="menuitem"
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                setTheme(id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150",
                "first:rounded-t-input last:rounded-b-input",
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-text-body hover:bg-surface-subtle hover:text-text-heading",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
