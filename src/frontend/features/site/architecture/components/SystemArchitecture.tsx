// src/frontend/features/site/architecture/components/SystemArchitecture.tsx
import {
  CalendarClock,
  Database,
  Eye,
  FileCode2,
  Globe,
  Monitor,
  Server,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, Grid } from "@/shared/components/primitives";

import { ArchitectureArrow } from "./ArchitectureArrow";
import { ArchitectureDiagramNode } from "./ArchitectureDiagramNode";
import { DiagramLane } from "./DiagramLane";
import { FeatureBadge } from "./FeatureBadge";

/**
 * How the system fits together: the path of a page request and of the match
 * data, then three facts about how it runs.
 *
 * The node subtitles are product names, not copy, so they are written here
 * rather than in the catalogue.
 */
export function SystemArchitecture() {
  const t = useTranslations("landing.architecture");

  return (
    <Card padding="lg" heading={t("systemArchitecture")}>
      <div className="space-y-8">
        <DiagramLane label={t("diagram.requestLane")}>
          <ArchitectureDiagramNode
            icon={Monitor}
            title={t("diagram.browser")}
            subtitle="beyondthearc.app"
            tone="neutral"
          />
          <ArchitectureArrow />
          <ArchitectureDiagramNode
            icon={Shield}
            title={t("diagram.proxy")}
            subtitle="Cloudflare + Nginx"
            tone="category"
          />
          <ArchitectureArrow />
          <ArchitectureDiagramNode
            icon={Globe}
            title={t("diagram.webServer")}
            subtitle="Next.js"
            tone="primary"
          />
          <ArchitectureArrow />
          <ArchitectureDiagramNode
            icon={Server}
            title={t("diagram.api")}
            subtitle="NestJS + Prisma"
            tone="secondary"
          />
          <ArchitectureArrow />
          <ArchitectureDiagramNode
            icon={Database}
            title={t("diagram.database")}
            subtitle="PostgreSQL"
            tone="secondary"
          />
        </DiagramLane>

        <DiagramLane label={t("diagram.dataLane")}>
          <ArchitectureDiagramNode
            icon={CalendarClock}
            title={t("diagram.scheduler")}
            subtitle="Python"
            tone="secondary"
          />
          <ArchitectureArrow />
          <ArchitectureDiagramNode
            icon={Database}
            title={t("diagram.database")}
            subtitle="PostgreSQL"
            tone="secondary"
          />
        </DiagramLane>
      </div>

      <div className="mt-12">
        <Grid columns={{ base: 1, md: 3 }} gap={6}>
          <FeatureBadge
            icon={FileCode2}
            title={t("features.contract.title")}
            description={t("features.contract.description")}
          />
          <FeatureBadge
            icon={Eye}
            title={t("features.readOnly.title")}
            description={t("features.readOnly.description")}
          />
          <FeatureBadge
            icon={Server}
            title={t("features.oneServer.title")}
            description={t("features.oneServer.description")}
          />
        </Grid>
      </div>
    </Card>
  );
}
