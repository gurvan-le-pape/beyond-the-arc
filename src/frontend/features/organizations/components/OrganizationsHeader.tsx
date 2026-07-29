// src/frontend/features/organizations/components/OrganizationsHeader.tsx
import { getTranslations } from "next-intl/server";

import { Text } from "@/shared/components/typography";

export async function OrganizationsHeader() {
  const t = await getTranslations("organizations");

  return (
    <div className="text-center space-y-1">
      <Text variant="h1">{t("title")}</Text>
      <Text variant="caption">{t("subtitle")}</Text>
    </div>
  );
}
