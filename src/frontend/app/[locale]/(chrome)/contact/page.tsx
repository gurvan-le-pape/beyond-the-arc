// src/frontend/app/[locale]/(chrome)/contact/page.tsx
import { Send } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactMethodCard } from "@/features/site/contact/components";
import { CONTACT_METHODS } from "@/features/site/contact/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { Grid } from "@/shared/components/primitives";
import type { LocalePageProps } from "@/shared/types";

/**
 * Metadata for the contact page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return { title: tMeta("contact.title"), description: tMeta("contact.intro") };
}

/**
 * The contact page: the ways to get in touch.
 *
 * `params` is a Promise in Next 15 and is awaited here, so the feature
 * components below receive plain values.
 */
export default async function ContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const contactMethods = CONTACT_METHODS.map((method) => ({
    ...method,
    label: t(method.labelKey),
  }));

  return (
    <PageLayout contentClassName="max-w-4xl">
      <PageHero
        title={t("contact.title")}
        lead={t("contact.intro")}
        icon={Send}
      />

      <Grid columns={{ base: 1, md: 3 }} gap={6}>
        {contactMethods.map((method) => (
          <ContactMethodCard key={method.href} {...method} />
        ))}
      </Grid>
    </PageLayout>
  );
}
