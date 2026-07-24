// src/frontend/shared/types/PageProps.ts

/**
 * Props for a page under `app/[locale]`. Every such page receives `locale`;
 * pass the route's own dynamic segments as the type argument.
 *
 * @example
 * // app/[locale]/about/page.tsx
 * function AboutPage({ params }: LocalePageProps) {}
 *
 * @example
 * // app/[locale]/(public)/organizations/clubs/[clubId]/page.tsx
 * function ClubPage({ params }: LocalePageProps<{ clubId: string }>) {}
 */
export interface LocalePageProps<TParams = object> {
  readonly params: Promise<{ locale: string } & TParams>;
}

/**
 * Query-string props, for the pages that read them. Intersect with
 * `LocalePageProps` rather than nesting:
 *
 * @example
 * LocalePageProps<{ championshipId: string }> & SearchParamsProps<{ pool?: string }>
 */
export interface SearchParamsProps<TSearch> {
  readonly searchParams: Promise<TSearch>;
}
