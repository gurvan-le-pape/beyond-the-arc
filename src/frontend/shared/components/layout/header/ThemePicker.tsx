// src/frontend/shared/components/layout/header/ThemePicker.tsx
"use client";

import { Eye, type LucideIcon, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { SegmentedControl } from "@/shared/components/primitives";

/** The themes next-themes is configured with, `"system"` aside. */
type ThemeId = "light" | "dark" | "high-contrast";

/**
 * Literal keys, not built from `id`: a literal stays greppable for the
 * orphaned-key sweep, and `id` is `"high-contrast"`, which would need a
 * hyphenated key.
 */
const THEMES = [
  { id: "light", labelKey: "header.themes.light", Icon: Sun },
  { id: "dark", labelKey: "header.themes.dark", Icon: Moon },
  { id: "high-contrast", labelKey: "header.themes.highContrast", Icon: Eye },
] as const satisfies readonly {
  id: ThemeId;
  labelKey: string;
  Icon: LucideIcon;
}[];

const isThemeId = (value: string | undefined): value is ThemeId =>
  THEMES.some((theme) => theme.id === value);

/**
 * The option to show selected. The provider allows `"system"`, which this
 * picker does not offer, so a reader still on it sees the theme it resolved to.
 */
const pickedTheme = (
  theme: string | undefined,
  resolved: string | undefined,
): ThemeId => {
  if (isThemeId(theme)) return theme;
  return isThemeId(resolved) ? resolved : "light";
};

/**
 * The three themes side by side, the active one selected.
 *
 * **Render it only after hydration** — inside a popover or a sheet that opens
 * on demand, as the header does. `theme` is unknown on the server, so drawn in
 * the first render it would show the wrong option selected until the client
 * caught up.
 */
export function ThemePicker() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("navigation");

  return (
    <SegmentedControl
      label={t("header.theme")}
      value={pickedTheme(theme, resolvedTheme)}
      onChange={setTheme}
      options={THEMES.map(({ id, labelKey, Icon }) => ({
        value: id,
        label: (
          <span className="flex items-center gap-1.5">
            <Icon aria-hidden="true" className="w-4 h-4 shrink-0" />
            {t(labelKey)}
          </span>
        ),
      }))}
    />
  );
}
