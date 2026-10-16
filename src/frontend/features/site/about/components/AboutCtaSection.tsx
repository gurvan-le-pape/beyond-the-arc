// src/frontend/features/site/about/components/AboutCtaSection.tsx
import { Link } from "@/navigation";

interface AboutCtaSectionProps {
  readonly title: string;
  readonly description: string;
  readonly productLabel: string;
  readonly architectureLabel: string;
}

/**
 * The closing call-to-action on the about page, linking to the product and
 * architecture pages.
 *
 * Both destinations are fixed — only their labels are passed in, so the caller
 * supplies translations without being able to redirect the section elsewhere.
 */
export function AboutCtaSection({
  title,
  description,
  productLabel,
  architectureLabel,
}: AboutCtaSectionProps) {
  return (
    <div className="bg-solid-primary text-on-solid-primary [--focus-ring-color:rgb(var(--color-on-solid-primary))] rounded-card shadow-card p-8 text-center">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-sm mb-6 max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/product"
          className="px-6 py-3 bg-surface-base text-ink-primary rounded-button font-semibold hover:bg-surface-subtle transition-all duration-200 shadow-sm focus-ring"
        >
          {productLabel}
        </Link>
        <Link
          href="/architecture"
          // Outline only, no wash: any wash of the ink over the solid fill
          // lightens it under the label (10% gives 4.3:1). Hover thickens the
          // border and underlines instead of tinting the fill.
          className="px-6 py-3 border border-on-solid-primary/60 rounded-button font-semibold hover:border-on-solid-primary hover:underline transition-all duration-200 focus-ring"
        >
          {architectureLabel}
        </Link>
      </div>
    </div>
  );
}
