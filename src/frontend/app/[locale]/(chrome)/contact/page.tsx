// src/frontend/app/[locale]/(chrome)/contact/page.tsx
import { Send } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ContactAboutSection,
  ContactMethodCard,
} from "@/features/site/contact/components";
import { CONTACT_METHODS } from "@/features/site/contact/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return { title: tMeta("contact.title"), description: tMeta("contact.intro") };
}

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
        iconGradient="accent"
      />

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactMethods.map((method) => (
          <ContactMethodCard key={method.href} {...method} />
        ))}
      </div>

      {/* About section */}
      <ContactAboutSection
        title={t("contact.aboutProject")}
        description={t("contact.projectDescription")}
      />
    </PageLayout>
  );
}
