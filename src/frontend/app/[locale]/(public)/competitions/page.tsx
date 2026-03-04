// src/frontend/app/[locale]/(public)/competitions/page.tsx
import { useTranslations } from "next-intl";
import React from "react";
import { FaGlobeEurope, FaMapMarkedAlt, FaMapSigns } from "react-icons/fa";

import { Link } from "@/navigation";
import { Footer, Header } from "@/shared/components/layouts";
import { CompetitionLevel } from "@/shared/constants";

// Card for each competition level
const CompetitionLevelCard: React.FC<{ level: any }> = ({ level }) => {
  const { label, description, icon, href, id } = level;

  // Map id to color classes using new competition tokens
  let colorClasses = "";
  if (id === CompetitionLevel.NATIONAL) {
    colorClasses =
      "from-national-light/20 to-national-light/10 border-national-DEFAULT hover:border-national-dark dark:from-national-dark/20 dark:to-national-dark/10 dark:border-national-light dark:hover:border-national-dark";
  } else if (id === CompetitionLevel.REGIONAL) {
    colorClasses =
      "from-regional-light/20 to-regional-light/10 border-regional-DEFAULT hover:border-regional-dark dark:from-regional-dark/20 dark:to-regional-dark/10 dark:border-regional-light dark:hover:border-regional-dark";
  } else if (id === CompetitionLevel.DEPARTMENTAL) {
    colorClasses =
      "from-departmental-light/20 to-departmental-light/10 border-departmental-DEFAULT hover:border-departmental-dark dark:from-departmental-dark/20 dark:to-departmental-dark/10 dark:border-departmental-light dark:hover:border-departmental-dark";
  }

  return (
    <Link
      href={href}
      className={`cursor-pointer bg-gradient-to-br border-2 rounded-card flex flex-col items-center justify-center p-8 transition-all duration-200 hover:scale-105 shadow-card hover:shadow-card-hover dark:shadow-card-dark group ${colorClasses} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950`}
      aria-label={label}
      role="link"
    >
      {/* Visually hidden label for accessibility */}
      <span className="sr-only">{label}</span>

      {/* Icon for the level */}
      {React.cloneElement(icon, { "aria-hidden": true, focusable: false })}

      <div className="text-subtitle font-semibold mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200 dark:text-gray-100">
        {label}
      </div>

      <div className="text-gray-600 dark:text-gray-300 text-body text-center">
        {description}
      </div>
    </Link>
  );
};

export default function CompetitionsPage() {
  const t = useTranslations("competitions");

  // List of competition levels to display
  const levels: any[] = [
    {
      id: CompetitionLevel.NATIONAL,
      label: t(`${CompetitionLevel.NATIONAL}.label`),
      description: t(`${CompetitionLevel.NATIONAL}.description`),
      icon: (
        <FaGlobeEurope className="text-5xl text-national-dark dark:text-national-light mb-4" />
      ),
      href: `/competitions/${CompetitionLevel.NATIONAL}`,
    },
    {
      id: CompetitionLevel.REGIONAL,
      label: t(`${CompetitionLevel.REGIONAL}.label`),
      description: t(`${CompetitionLevel.REGIONAL}.description`),
      icon: (
        <FaMapMarkedAlt className="text-5xl text-regional-dark dark:text-regional-light mb-4" />
      ),
      href: `/competitions/${CompetitionLevel.REGIONAL}`,
    },
    {
      id: CompetitionLevel.DEPARTMENTAL,
      label: t(`${CompetitionLevel.DEPARTMENTAL}.label`),
      description: t(`${CompetitionLevel.DEPARTMENTAL}.description`),
      icon: (
        <FaMapSigns className="text-5xl text-departmental-dark dark:text-departmental-light mb-4" />
      ),
      href: `/competitions/${CompetitionLevel.DEPARTMENTAL}`,
    },
  ];

  // Main page layout
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-title md:text-display font-bold mb-12 text-gray-900 dark:text-gray-100 text-center">
            {t("selectLevel")}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {levels.map((level) => (
              <CompetitionLevelCard key={level.id} level={level} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
