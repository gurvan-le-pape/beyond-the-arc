// src/frontend/app/[locale]/contact/page.tsx
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

import { PageHero, PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";

export default async function ContactPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  const contactMethods = [
    {
      icon: Mail,
      label: t("contact.email"),
      value: "gurvan.lepape@hotmail.fr",
      href: "mailto:gurvan.lepape@hotmail.fr",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Github,
      label: t("contact.github"),
      value: "github.com/gurvan-le-pape",
      href: "https://github.com/gurvan-le-pape",
      color: "from-gray-700 to-gray-900",
    },
    {
      icon: Linkedin,
      label: t("contact.linkedin"),
      value: "linkedin.com/in/gurvan-le-pape",
      href: "https://linkedin.com/in/gurvan-le-pape",
      color: "from-blue-600 to-blue-800",
    },
  ];

  const techStack = [
    {
      name: "Next.js",
      color: "bg-primary-subtle text-primary-600",
    },
    {
      name: "NestJS",
      color: "bg-success-subtle text-success-strong",
    },
    {
      name: "TypeScript",
      color: "bg-info-subtle text-info-strong",
    },
    {
      name: "PostgreSQL",
      color: "bg-secondary-100 text-secondary-700",
    },
  ];

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
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <a
              key={method.label}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={
                method.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="bg-surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 p-6 group focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {/* Contact icon — decorative gradient, intentional */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${method.color} text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <Text variant="h3" className="mb-2 text-base">
                {method.label}
              </Text>
              <Text variant="caption" className="break-all">
                {method.value}
              </Text>
            </a>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-surface-subtle rounded-card border border-divide shadow-card p-8">
        <Text variant="h2" className="mb-4 text-xl">
          {t("contact.aboutProject")}
        </Text>
        <Text variant="body" className="mb-4">
          {t("contact.projectDescription")}
        </Text>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className={`px-3 py-1 rounded-button text-sm font-medium border border-divide ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
