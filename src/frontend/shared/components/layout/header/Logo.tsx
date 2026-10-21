// src/frontend/shared/components/layout/header/Logo.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Link } from "@/navigation";

/**
 * The wordmark, linking home, in the variant that suits the active theme.
 *
 * **Renders the light logo until mounted**, whatever the theme. The theme is
 * only knowable on the client, so drawing the dark variant during SSR would
 * mismatch on hydration; the cost is a brief flash of the light logo on a dark
 * first paint, taken deliberately over a hydration error.
 */
export function Logo() {
  const t = useTranslations("navigation");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src =
    mounted && resolvedTheme === "dark"
      ? "/BeyondTheArcLogo-dark.png"
      : "/BeyondTheArcLogo.png";

  return (
    <Link
      href="/"
      className="flex items-center group rounded-button focus-ring"
    >
      <div className="relative h-16 w-auto overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105">
        <Image src={src} alt={t("logo.alt")} width={72} height={45} priority />
      </div>
    </Link>
  );
}
