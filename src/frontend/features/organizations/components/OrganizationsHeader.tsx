// src/frontend/features/organizations/components/OrganizationsHeader.tsx
import type { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

interface OrganizationsHeaderProps {
  readonly t: ReturnType<typeof useTranslations>;
}

export function OrganizationsHeader({ t }: OrganizationsHeaderProps) {
  return (
    <div className="text-center space-y-1">
      <Text variant="h1">{t("title")}</Text>
      <Text variant="caption">{t("subtitle")}</Text>
    </div>
  );
}
