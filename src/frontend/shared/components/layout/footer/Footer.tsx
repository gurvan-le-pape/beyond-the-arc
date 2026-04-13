// src/frontend/shared/components/layout/footer/Footer.tsx
"use client";

import { ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";

import { Text } from "../../typography";

export const Footer: React.FC = () => {
  const t = useTranslations("navigation");
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    features: [{ href: "/map", label: t("footer.clubsMap"), icon: MapPin }],
    project: [
      { href: "/about", label: t("footer.about") },
      { href: "/features", label: t("footer.features") },
      { href: "/architecture", label: t("footer.architecture") },
      { href: "/docs", label: t("footer.documentation") },
    ],
    resources: [
      {
        href: "https://github.com/gurvan-le-pape/beyond-the-arc",
        label: t("footer.sourceCode"),
        external: true,
      },
      { href: "/contact", label: t("footer.contact") },
      {
        href: "https://www.ffbb.com/",
        label: t("footer.officialSite"),
        external: true,
      },
    ],
  };

  // Shared classes for social/icon link buttons — not a Button variant because
  // these are <a> elements and the icon scaling group effect is specific here.
  const iconLinkClass =
    "p-2 rounded-button hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark " +
    "text-text-body dark:text-text-body-dark hover:text-primary-600 dark:hover:text-primary-400 " +
    "transition-all duration-200 group focus:outline-none focus:ring-2 " +
    "focus:ring-primary-500 dark:focus:ring-primary-400";

  const navLinkClass =
    "text-text-body dark:text-text-body-dark hover:text-primary-600 " +
    "dark:hover:text-primary-400 transition-colors duration-200";

  return (
    <footer className="bg-surface-base dark:bg-surface-base-dark border-t border-divide-light dark:border-divide-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {/* Brand */}
          <div className="space-y-2">
            <div>
              <Text variant="h3" className="mb-2">
                {t("footer.projectName")}
              </Text>
              <Text variant="body" as="p" className="leading-relaxed mb-3">
                {t("footer.tagline")}
              </Text>
              <Text variant="caption" as="p">
                {t("footer.portfolioNote")}
              </Text>
            </div>

            {/* Social links */}
            <div className="flex gap-2 pt-1">
              <a
                href="https://github.com/gurvan-le-pape"
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={t("footer.github")}
                title={t("footer.github")}
              >
                <Github className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="https://linkedin.com/in/gurvan-le-pape"
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={t("footer.linkedin")}
                title={t("footer.linkedin")}
              >
                <Linkedin className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="mailto:gurvan.lepape@hotmail.fr"
                className={iconLinkClass}
                aria-label={t("footer.email")}
                title={t("footer.email")}
              >
                <Mail className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Featured */}
          <div>
            <Text variant="overline" className="mb-4 block">
              {t("footer.featuredWork")}
            </Text>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm inline-flex items-center gap-2 group ${navLinkClass}`}
                    >
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Project */}
          <div>
            <Text variant="overline" className="mb-4 block">
              {t("footer.project")}
            </Text>
            <ul className="space-y-2">
              {footerLinks.project.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm inline-block ${navLinkClass}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <Text variant="overline" className="mb-4 block">
              {t("footer.resources")}
            </Text>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm inline-flex items-center gap-1 group ${navLinkClass}`}
                    >
                      {link.label}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-sm inline-block ${navLinkClass}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-divide-light dark:border-divide-dark">
          <div className="flex flex-col gap-2">
            {/* Copyright and tech stack */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
              <Text variant="body" as="p" className="text-center sm:text-left">
                {t("footer.copyright", {
                  year: currentYear,
                  name: "Gurvan LE PAPE",
                })}
              </Text>
              <Text variant="caption" as="p">
                {t("footer.madeWith")}
              </Text>
            </div>

            {/* Disclaimer */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-1">
              <Text variant="caption" as="span">
                {t("footer.nonCommercial")}
              </Text>
              <Text variant="caption" as="span" className="hidden sm:inline">
                •
              </Text>
              <Text variant="caption" as="span">
                {t("footer.dataDisclaimer")}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
