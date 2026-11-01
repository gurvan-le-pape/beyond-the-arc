// src/frontend/shared/components/layout/header/ThemeToggle.tsx
"use client";

import { Eye, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { DROPDOWN_PANEL, IconButton } from "@/shared/components/primitives";
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
 * The trigger's icon for each theme, shown by the theme class next-themes
 * puts on `<html>` before first paint — so the server's markup is the same
 * for every theme and the right icon shows before hydration.
 */
const TRIGGER_ICON_CLASSES = {
  light: "[.dark_&]:hidden [.high-contrast_&]:hidden",
  dark: "hidden [.dark_&]:block",
  "high-contrast": "hidden [.high-contrast_&]:block",
} as const;

/**
 * Theme picker: a menu of the three themes, on React Aria's MenuTrigger and
 * Menu, whose trigger icon is the active theme.
 *
 * React Aria supplies the menu pattern: the menu is named by its trigger, the
 * items are `menuitemradio`s, arrow keys and Home/End move through them, Enter
 * or Space picks one, and Escape or a click outside closes and returns focus to
 * the trigger. The menu only renders once opened, which is after hydration, so
 * it can read `theme`.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("navigation");

  return (
    <MenuTrigger>
      <IconButton label={t("header.toggleTheme")}>
        {THEMES.map(({ id, Icon }) => (
          <Icon key={id} className={TRIGGER_ICON_CLASSES[id]} />
        ))}
      </IconButton>

      <Popover
        placement="bottom end"
        offset={4}
        containerPadding={16}
        className={DROPDOWN_PANEL}
      >
        <Menu
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={theme ? [theme] : []}
          onSelectionChange={(keys) => {
            const [picked] = keys === "all" ? [] : keys;
            if (typeof picked === "string") setTheme(picked);
          }}
          className="focus-visible:outline-none"
        >
          {THEMES.map(({ id, labelKey, Icon }) => (
            <MenuItem
              key={id}
              id={id}
              // The highlight is the focus indicator, not an outline: the
              // item under the pointer takes focus, so `:focus-visible` would
              // ring every item a mouse passes over.
              className={({ isSelected }) =>
                cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm cursor-pointer focus-visible:outline-none transition-colors duration-150",
                  isSelected
                    ? "bg-solid-primary text-on-solid-primary data-[focus-visible]:ring-2 data-[focus-visible]:ring-inset data-[focus-visible]:ring-on-solid-primary"
                    : "text-text-body data-[focused]:bg-tint-primary data-[focused]:text-ink-primary",
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(labelKey)}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
