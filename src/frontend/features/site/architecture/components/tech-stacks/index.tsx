// src/frontend/features/site/architecture/components/tech-stacks/index.tsx
import { useTranslations } from "next-intl";

import { Grid } from "@/shared/components/primitives";

import { TECH_STACKS } from "../../constants/techStacks";
import { TechStackCard } from "./TechStackCard";

/**
 * The stack, one card per layer: frontend, backend and data, infrastructure.
 *
 * Resolves each layer's title and each technology's description from the
 * catalogue; the product names stay as written in `TECH_STACKS`.
 */
export function TechStacks() {
  const t = useTranslations("landing");

  return (
    <div className="mb-12">
      <Grid columns={{ base: 1, lg: 3 }} gap={8}>
        {TECH_STACKS.map((stack) => (
          <TechStackCard
            key={stack.titleKey}
            title={t(stack.titleKey)}
            icon={stack.icon}
            tone={stack.tone}
            items={stack.items.map((item) => ({
              name: item.name,
              icon: item.icon,
              description: t(item.descriptionKey),
            }))}
          />
        ))}
      </Grid>
    </div>
  );
}
