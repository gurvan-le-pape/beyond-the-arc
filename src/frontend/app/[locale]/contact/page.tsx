// src/frontend/app/[locale]/contact/page.tsx
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ContactAboutSection,
  ContactMethodCard,
} from "@/features/site/contact/components";
import { PageHero, PageLayout } from "@/shared/components/layout";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
} from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";

const stripScheme = (url: string): string => url.replace(/^https?:\/\//, "");

const CONTACT_METHODS_CONFIG = [
  {
    icon: Mail,
    labelKey: "contact.email",
    value: CONTACT_EMAIL,
    href: CONTACT_MAILTO,
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Github,
    labelKey: "contact.github",
    value: stripScheme(GITHUB_PROFILE_URL),
    href: GITHUB_PROFILE_URL,
    color: "from-gray-700 to-gray-900",
  },
  {
    icon: Linkedin,
    labelKey: "contact.linkedin",
    value: stripScheme(LINKEDIN_URL),
    href: LINKEDIN_URL,
    color: "from-blue-600 to-blue-800",
  },
] as const;

export default async function ContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const contactMethods = CONTACT_METHODS_CONFIG.map((method) => ({
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
