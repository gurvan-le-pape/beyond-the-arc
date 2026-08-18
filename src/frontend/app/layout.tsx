// src/frontend/app/layout.tsx
import "@/styles/globals.css";
import "@/styles/map.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  // Every route sets its own title and inherits this suffix; `default` covers
  // the ones Next renders itself, like the built-in 404 for an unmatched URL.
  title: {
    default: "Beyond The Arc",
    template: "%s · Beyond The Arc",
  },
  description:
    "A basketball federation management platform inspired by the FFBB, built to scale internationally.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * The document shell: `<html>`, `<body>`, fonts, and the provider tree.
 *
 * Renders once for the whole app and persists across navigation, so anything
 * mounted here keeps its state for the session — which is what makes it the
 * right place for the query client and the theme, and the wrong place for
 * anything route-specific.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
