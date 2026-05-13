// src/frontend/app/providers.tsx
"use client";

import { QueryProvider, ThemeProvider } from "@/lib/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
