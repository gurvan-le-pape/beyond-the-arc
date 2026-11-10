// src/frontend/shared/components/layout/header/SettingsMenu.tsx
"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";

import { DROPDOWN_PANEL, IconButton } from "@/shared/components/primitives";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemePicker } from "./ThemePicker";

interface SettingRowProps {
  /** The visible caption; the control below names itself. */
  readonly label: string;
  readonly children: ReactNode;
}

/**
 * A caption over its control. The caption is visual only: each control
 * carries its own accessible name.
 */
function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span aria-hidden="true" className="text-sm text-text-secondary">
        {label}
      </span>
      {children}
    </div>
  );
}

/**
 * The desktop header's settings: language and theme in one popover, behind a
 * single button.
 *
 * A dialog, not a menu — it holds a link row and a radio group, each with its
 * own keyboard model, which a `role="menu"` could not contain. React Aria's
 * DialogTrigger moves focus in, keeps Tab inside, and returns focus to the
 * button on Escape or an outside click. The panel only renders once opened,
 * after hydration, which is what lets `ThemePicker` read the theme.
 */
export function SettingsMenu() {
  const t = useTranslations("navigation");

  return (
    <DialogTrigger>
      <IconButton size="lg" label={t("header.settings")}>
        <SlidersHorizontal />
      </IconButton>
      <Popover
        placement="bottom end"
        offset={12}
        containerPadding={16}
        className={`${DROPDOWN_PANEL} rounded-2xl`}
      >
        <Dialog
          aria-label={t("header.settings")}
          className="flex flex-col gap-4 p-4 focus-visible:outline-none"
        >
          <SettingRow label={t("header.language")}>
            <LocaleSwitcher />
          </SettingRow>
          <SettingRow label={t("header.theme")}>
            <ThemePicker />
          </SettingRow>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
