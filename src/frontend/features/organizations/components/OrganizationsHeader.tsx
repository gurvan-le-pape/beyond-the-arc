// src/frontend/features/organizations/components/OrganizationsHeader.tsx
import { getTranslations } from "next-intl/server";

import { Text } from "@/shared/components/typography";

/**
 * The heading block of the organisations landing page.
 *
 * An **async server component** with no props: it resolves its own copy and
 * has no data to receive.
 */
export async function OrganizationsHeader() {
  const t = await getTranslations("organizations");

  return (
    <div className="text-center space-y-1">
      <Text variant="h1">{t("title")}</Text>
      <Text variant="caption">{t("subtitle")}</Text>
    </div>
  );
}
