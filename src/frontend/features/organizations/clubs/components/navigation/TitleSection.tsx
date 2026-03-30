// src/frontend/features/organizations/clubs/components/navigation/TitleSection.tsx
"use client";

import { useTranslations } from "next-intl";
import { FaMapMarkedAlt, FaMapSigns, FaUsers } from "react-icons/fa";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { ViewLevel } from "@/shared/constants";

interface TitleSectionProps {
  readonly viewLevel: ViewLevel;
  readonly selectedLeague: any;
  readonly selectedCommittee: any;
}

interface ViewConfig {
  icon: React.ReactNode;
  cardClassName: string;
  iconClassName: string;
  titleColor: string;
  title: string;
  subtitle?: string;
  description: string;
}

export function TitleSection({
  viewLevel,
  selectedLeague,
  selectedCommittee,
}: TitleSectionProps) {
  const tClubs = useTranslations("clubs");
  const tCommon = useTranslations("common");

  const getViewConfig = (): ViewConfig | null => {
    switch (viewLevel) {
      case ViewLevel.REGION:
        return {
          icon: (
            <FaMapMarkedAlt
              className="w-8 h-8 flex-shrink-0 text-black dark:text-white"
              aria-label={tCommon("sectionTitles.regionalLeagues")}
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-regional-light/20 to-regional-light/10 border-regional-DEFAULT dark:from-regional-dark/20 dark:to-regional-dark/10 dark:border-regional-light shadow-card dark:shadow-card-dark",
          iconClassName: "", // color handled in icon
          titleColor: "text-black dark:text-white",
          title: tCommon("sectionTitles.regionalLeagues"),
          description: tClubs("selectRegion"),
        };
      case ViewLevel.DEPARTMENT:
        return {
          icon: (
            <FaMapSigns
              className="w-8 h-8 flex-shrink-0 text-black dark:text-white"
              aria-label={tCommon("sectionTitles.departmentalCommittees")}
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-departmental-light/20 to-departmental-light/10 border-departmental-DEFAULT dark:from-departmental-dark/20 dark:to-departmental-dark/10 dark:border-departmental-light shadow-card dark:shadow-card-dark",
          iconClassName: "", // color handled in icon
          titleColor: "text-black dark:text-white",
          title: tCommon("sectionTitles.departmentalCommittees"),
          subtitle: selectedLeague?.name,
          description: tClubs("selectDepartment"),
        };
      case ViewLevel.CLUBS:
        return {
          icon: (
            <FaUsers
              className="w-8 h-8 flex-shrink-0 text-black dark:text-white"
              aria-label={tCommon("sectionTitles.clubs")}
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-clubs-light/20 to-clubs-light/10 border-clubs-DEFAULT dark:from-clubs-dark/20 dark:to-clubs-dark/10 dark:border-clubs-light shadow-card dark:shadow-card-dark",
          iconClassName: "", // color handled in icon
          titleColor: "text-black dark:text-white",
          title: tCommon("sectionTitles.clubs"),
          subtitle: selectedCommittee?.name,
          description: tClubs("selectClub"),
        };
      default:
        return null;
    }
  };

  const config = getViewConfig();

  if (!config) {
    return null;
  }

  return (
    <Card variant="custom" padding="lg" className={config.cardClassName}>
      <div className="flex items-start gap-4 mb-4">
        <div className={config.iconClassName}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <Text variant="h2" className={config.titleColor}>
            {config.title}
          </Text>
          {config.subtitle && (
            <p className={`text-lg font-semibold ${config.titleColor} mt-2`}>
              {config.subtitle}
            </p>
          )}
        </div>
      </div>
      <p className="text-text-body dark:text-text-body-dark">
        {config.description}
      </p>
    </Card>
  );
}

export default TitleSection;
