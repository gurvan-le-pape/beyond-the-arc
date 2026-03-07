// src/frontend/shared/components/layouts/footer/Footer.tsx
"use client";

import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";

export const Footer: React.FC = () => {
  const t = useTranslations("navigation");
  const currentYear = new Date().getFullYear();

  // Showcase your best features instead of competition levels
  const footerLinks = {
    features: [
      {
        href: "/clubs/map",
        label: t("footer.clubsMap"),
        icon: MapPin,
      },
      {
        href: "/stats",
        label: t("footer.statistics"),
        icon: TrendingUp,
      },
      {
        href: "/teams",
        label: t("footer.teams"),
        icon: Users,
      },
    ],
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

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {/* Brand section */}
          <div className="space-y-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("footer.projectName")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {t("footer.tagline")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {t("footer.portfolioNote")}
              </p>
            </div>

            {/* Social links */}
            <div className="flex gap-2 pt-1">
              <a
                href="https://github.com/gurvan-le-pape"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-label={t("footer.github")}
                title={t("footer.github")}
              >
                <Github className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="https://linkedin.com/in/glepape"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-label={t("footer.linkedin")}
                title={t("footer.linkedin")}
              >
                <Linkedin className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="mailto:gurvan.lepape@hotmail.fr"
                className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-label={t("footer.email")}
                title={t("footer.email")}
              >
                <Mail className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Featured sections */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              {t("footer.featuredWork")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 inline-flex items-center gap-2 group text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Project links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              {t("footer.project")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.project.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar with copyright and disclaimer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            {/* Copyright and tech stack */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                {t("footer.copyright", {
                  year: currentYear,
                  name: "Gurvan LE PAPE",
                })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {t("footer.madeWith")}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
              <span>{t("footer.nonCommercial")}</span>
              <span className="hidden sm:inline">•</span>
              <span>{t("footer.dataDisclaimer")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
