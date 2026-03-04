// src/frontend/lib/providers/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Theme provider for dark mode support
 * Wraps the entire app to enable theme switching
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true} // Respects user's OS preference
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
