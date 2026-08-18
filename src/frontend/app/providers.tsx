// src/frontend/app/providers.tsx
"use client";

import { QueryProvider, ThemeProvider } from "@/lib/providers";

interface ProvidersProps {
  readonly children: React.ReactNode;
}

/**
 * The client-side provider tree: TanStack Query outside, theme inside.
 *
 * Exists as its own `"use client"` module so the root layout can stay a server
 * component — importing the providers directly there would pull the whole
 * document shell into the client bundle.
 *
 * The order matters only in that both must wrap the app; neither reads the
 * other.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
