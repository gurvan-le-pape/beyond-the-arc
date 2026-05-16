// src/frontend/shared/components/layout/PageLayout.tsx
import { cn } from "@/shared/utils";

import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  centered?: boolean;
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
 */
export const PageLayout = ({
  children,
  className,
  contentClassName,
  ariaLabel,
  centered,
}: PageLayoutProps) => (
  <div className="flex flex-col min-h-screen surface-base">
    <Header />
    <main
      aria-label={ariaLabel}
      className={cn(
        "flex-grow min-h-[70vh] px-4 py-12 sm:px-6 lg:px-8",
        centered ? "flex flex-col items-center justify-center" : "",
        className,
      )}
    >
      <div
        className={cn("max-w-7xl mx-auto w-full space-y-6", contentClassName)}
      >
        {children}
      </div>
    </main>
    <Footer />
  </div>
);
