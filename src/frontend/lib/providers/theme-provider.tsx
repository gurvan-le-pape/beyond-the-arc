// src/frontend/lib/providers/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  readonly children: ReactNode;
}

/**
 * Theme provider — registers all supported themes.
 *
 * Adding a new theme:
 *  1. Define a CSS class block in globals.css (e.g. .sepia { ... })
 *  2. Add the name to the themes array below
 *  That's it — no component changes needed.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      themes={["light", "dark", "high-contrast"]}
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
