// src/frontend/features/organizations/components/TitleSection.tsx
"use client";

import { MapPin, SignpostBig, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { ViewLevel } from "@/shared/constants";

interface TitleSectionProps {
  readonly viewLevel: ViewLevel;
}

interface ViewConfig {
  icon: React.ReactNode;
  cardClassName: string;
  iconClassName: string;
  titleColor: string;
  title: string;
  description: string;
}

/**
 * The heading above an organisation listing, styled for its level.
 *
 * `viewLevel` selects from a **closed set of configurations** — icon, accent and
 * copy together — so a level renders consistently across the clubs, committees
 * and leagues pages. There is no way to override one part of a configuration;
 * a new look means a new entry.
 */
export function TitleSection({ viewLevel }: TitleSectionProps) {
  const tClubs = useTranslations("clubs");
  const tCommon = useTranslations("common");

  const getViewConfig = (): ViewConfig | null => {
    switch (viewLevel) {
      case ViewLevel.REGION:
        return {
          icon: (
            <MapPin
              className="w-8 h-8 flex-shrink-0 text-regional-strong"
              aria-hidden="true"
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
              aria-hidden="true"
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-departmental-subtle to-departmental-subtle/40 border-departmental shadow-card",
          iconClassName: "", // color handled in icon
          titleColor: "text-text-heading",
          title: tCommon("sectionTitles.departmentalCommittees"),
          description: tClubs("selectDepartment"),
        };
      case ViewLevel.CLUBS:
        return {
          icon: (
            <Users
              className="w-8 h-8 flex-shrink-0 text-clubs-strong"
              aria-hidden="true"
            />
          ),
          cardClassName:
            "bg-gradient-to-br from-clubs-subtle to-clubs-subtle/40 border-clubs shadow-card",
          iconClassName: "",
          titleColor: "text-text-heading",
          title: tCommon("sectionTitles.clubs"),
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
          <Text variant="pageTitle" className={config.titleColor}>
            {config.title}
          </Text>
        </div>
      </div>
      <Text variant="body">{config.description}</Text>
    </Card>
  );
}

export default TitleSection;
