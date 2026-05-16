// src/frontend/features/organizations/components/TitleSection.tsx
"use client";

import { MapPin, SignpostBig, Users } from "lucide-react";
import { useTranslations } from "next-intl";

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
            <MapPin
              className="w-8 h-8 flex-shrink-0 text-regional-strong"
              aria-label={tCommon("sectionTitles.regionalLeagues")}
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-regional-subtle to-regional-subtle/40 border-regional shadow-card",
          iconClassName: "",
          titleColor: "text-text-heading",
          title: tCommon("sectionTitles.regionalLeagues"),
          description: tClubs("selectRegion"),
        };
      case ViewLevel.DEPARTMENT:
        return {
          icon: (
            <SignpostBig
              className="w-8 h-8 flex-shrink-0 text-departmental-strong"
              aria-label={tCommon("sectionTitles.departmentalCommittees")}
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-departmental-subtle to-departmental-subtle/40 border-departmental shadow-card",
          iconClassName: "", // color handled in icon
          titleColor: "text-text-heading",
          title: tCommon("sectionTitles.departmentalCommittees"),
          subtitle: selectedLeague?.name,
          description: tClubs("selectDepartment"),
        };
      case ViewLevel.CLUBS:
        return {
          icon: (
            <Users
              className="w-8 h-8 flex-shrink-0 text-clubs-strong"
              aria-label={tCommon("sectionTitles.clubs")}
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-clubs-subtle to-clubs-subtle/40 border-clubs shadow-card",
          iconClassName: "",
          titleColor: "text-text-heading",
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
      <Text variant="body">{config.description}</Text>
    </Card>
  );
}

export default TitleSection;
