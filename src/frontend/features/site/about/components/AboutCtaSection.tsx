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
    // Call to Action — decorative gradient, intentionally stays as raw Tailwind
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-card shadow-card p-8 text-center text-white [--focus-ring-color:white]">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-sm mb-6 max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/product"
          className="px-6 py-3 bg-white text-primary-strong rounded-button font-semibold hover:bg-gray-100 transition-all duration-200 shadow-sm focus-ring"
        >
          {productLabel}
        </Link>
        <Link
          href="/architecture"
          className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-button font-semibold hover:bg-white/30 transition-all duration-200 focus-ring"
        >
          {architectureLabel}
        </Link>
      </div>
    </div>
  );
}
