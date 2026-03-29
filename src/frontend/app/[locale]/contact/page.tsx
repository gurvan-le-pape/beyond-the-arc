// src/frontend/app/[locale]/contact/page.tsx
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

import { PageLayout } from "@/shared/components/layouts/PageLayout";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
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
      value: "linkedin.com/in/glepape",
      href: "https://linkedin.com/in/glepape",
      color: "from-blue-600 to-blue-800",
    },
  ];

  const techStack = [
    {
      name: "Next.js",
      color:
        "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300",
    },
    {
      name: "NestJS",
      color:
        "bg-success-light/20 dark:bg-success-dark/20 text-success-dark dark:text-success-light",
    },
    {
      name: "TypeScript",
      color:
        "bg-info-light/20 dark:bg-info-dark/20 text-info-dark dark:text-info-light",
    },
    {
      name: "PostgreSQL",
      color:
        "bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300",
    },
  ];

  return (
    <PageLayout contentClassName="max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-button bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4 shadow-card">
          <Send className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-text-heading dark:text-text-heading-dark mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-lg text-text-body dark:text-text-body-dark max-w-2xl mx-auto">
          {t("contact.intro")}
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <a
              key={idx}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={
                method.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 p-6 group focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${method.color} text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-text-heading dark:text-text-heading-dark mb-2">
                {method.label}
              </h3>
              <p className="text-sm text-text-body dark:text-text-body-dark break-all">
                {method.value}
              </p>
            </a>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card dark:shadow-card-dark p-8">
        <h2 className="text-xl font-bold text-text-heading dark:text-text-heading-dark mb-4">
          {t("contact.aboutProject")}
        </h2>
        <p className="text-body text-text-body dark:text-text-body-dark mb-4">
          {t("contact.projectDescription")}
        </p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-button text-sm font-medium border ${tech.color} border-current/30`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
