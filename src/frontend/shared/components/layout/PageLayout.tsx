// src/frontend/shared/components/layout/PageLayout.tsx
import { cn } from "@/shared/utils";

import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

interface PageLayoutProps {
  children: React.ReactNode;
  contentClassName?: string;
  ariaLabel?: string;
  centered?: boolean;
  /**
   * When true, `main` has no padding — sections inside are responsible for
   * their own horizontal spacing, allowing borders/dividers to bleed to the
   * edges of the shared max-w-7xl column (e.g. the Home page's bento layout).
   * Content is still capped at max-w-7xl, same as the default layout.
   */
  edgeToEdge?: boolean;
}

/**
 * Standard page shell. Use this in every `app/` page file.
 * Never import this inside `features/` or `shared/` components.
 *
 * @example
 * // Default layout
 * <PageLayout>...</PageLayout>
 *
 * // Vertically centered (error pages, selection screens)
 * <PageLayout centered>...</PageLayout>
 *
 * // Custom max-width
 * <PageLayout contentClassName="max-w-4xl">...</PageLayout>
 *
 * // Full-bleed sections within the standard max-w-7xl column
 * <PageLayout edgeToEdge>...</PageLayout>
 */
export const PageLayout = ({
  children,
  contentClassName,
  ariaLabel,
  centered,
  edgeToEdge,
}: PageLayoutProps) => (
  <div className="flex flex-col min-h-screen surface-base">
    <Header />
    <main
      aria-label={ariaLabel}
      className={cn(
        "flex-grow",
        edgeToEdge ? "" : "min-h-[70vh] px-4 py-12 sm:px-6 lg:px-8",
        centered ? "flex flex-col items-center justify-center" : "",
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto w-full",
          edgeToEdge ? "" : "space-y-6",
          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
    <Footer />
  </div>
);
