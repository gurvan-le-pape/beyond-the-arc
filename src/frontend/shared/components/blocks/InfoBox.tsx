// src/frontend/shared/components/blocks/InfoBox.tsx
import { useTranslations } from "next-intl";
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

import { TextLink } from "../primitives/TextLink";
import { Text } from "../typography";

interface InfoBoxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  label: string;
  value: string | number | null | undefined;
  href?: string;
  /** A line of secondary text under the value. */
  hint?: string;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * A labelled value in a bordered panel, such as an organisation's address.
 *
 * It has a border and no fill: content on the page is not filled, only the
 * page header card is (see `Card`).
 *
 * A `null` or `undefined` value renders as the translated "not available"
 * label rather than collapsing, so a grid keeps its shape when a stat is
 * missing. Supplying `href` turns the value into a link that **always opens in
 * a new tab**.
 *
 * The missing-value string is the component's own vocabulary, so it is
 * resolved here via `useTranslations` — next-intl v4 provides that hook in the
 * react-server build too, so this stays a server-safe component.
 */
export const InfoBox = ({
  label,
  value,
  href,
  hint,
  icon,
  className,
  ref,
  ...props
}: InfoBoxProps) => {
  const t = useTranslations("common");

  return (
    <div
      ref={ref}
      className={cn("p-4 rounded-card", "border border-divide", className)}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-text-secondary">{icon}</span>}
        <Text variant="overline">{label}</Text>
      </div>

      {href ? (
        <Text variant="h4" as="p">
          <TextLink href={href} external>
            {value ?? t("notAvailable")}
          </TextLink>
        </Text>
      ) : (
        <Text variant="h4" as="p">
          {value ?? t("notAvailable")}
        </Text>
      )}

      {hint && (
        <Text variant="caption" as="p" className="mt-1">
          {hint}
        </Text>
      )}
    </div>
  );
};
