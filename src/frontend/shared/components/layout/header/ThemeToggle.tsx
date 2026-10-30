// src/frontend/shared/components/layout/header/ThemeToggle.tsx
"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Eye, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { IconButton } from "@/shared/components/primitives";
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
 * Theme picker: a menu of the three themes, on Radix DropdownMenu, whose
 * trigger icon is the active theme.
 *
 * Radix supplies the menu pattern: arrow keys and Home/End move through the
 * items, Enter or Space picks one, Escape closes and returns focus to the
 * trigger, and a click outside closes. Not modal, so the page keeps
 * scrolling and stays clickable while it is open, as a header menu should.
 *
 * Rendered in place rather than portalled, so it stays inside the header's
 * stacking context and paints above the page under it.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("navigation");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Placeholder — prevents hydration mismatch and layout shift
  if (!mounted) {
    return (
      <IconButton label={t("header.toggleTheme")} disabled>
        <span className="w-5 h-5" />
      </IconButton>
    );
  }

  // Not `(t) =>`: that would shadow the translation function the labels
  // below resolve their messages with.
  const active = THEMES.find((entry) => entry.id === theme) ?? THEMES[0];
  const ActiveIcon = active.Icon;

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <IconButton label={t("header.toggleTheme")}>
          <ActiveIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        aria-label={t("header.selectTheme")}
        align="end"
        sideOffset={4}
        collisionPadding={16}
        className={cn(
          "z-dropdown w-max min-w-44 max-w-[90vw] overflow-hidden surface-raised border border-divide rounded-input shadow-card-hover",
          "origin-[--radix-dropdown-menu-content-transform-origin] data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out",
        )}
      >
        <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
          {THEMES.map(({ id, labelKey, Icon }) => (
            <DropdownMenu.RadioItem
              key={id}
              value={id}
              // The highlight is the focus indicator, not an outline: Radix
              // focuses the item under the pointer, so `:focus-visible` would
              // ring every item a mouse passes over.
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm cursor-pointer focus-visible:outline-none transition-colors duration-150",
                theme === id
                  ? "bg-solid-primary text-on-solid-primary data-[highlighted]:ring-2 data-[highlighted]:ring-inset data-[highlighted]:ring-on-solid-primary"
                  : "text-text-body data-[highlighted]:bg-tint-primary data-[highlighted]:text-ink-primary",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(labelKey)}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
