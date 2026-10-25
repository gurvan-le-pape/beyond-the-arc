// src/frontend/features/competitions/championships/components/detail/ChampionshipHeader.tsx
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import type {
  Championship,
  ChampionshipNavLink,
} from "@/features/competitions/championships/types";
import { buildChampionshipHeading } from "@/features/competitions/championships/utils";
import { Card, LinkMenu, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";

interface ChampionshipHeaderProps {
  readonly championship: Championship;
  /** The sibling championships one facet away, from the `build*Navigation` utils. */
  readonly categoryLinks: ChampionshipNavLink[];
  readonly genderLinks: ChampionshipNavLink[];
  readonly divisionLinks: ChampionshipNavLink[];
  /** The championship this one's champion moves up into, when there is one. */
  readonly levelAboveHref?: string;
  /** The departments below a regional championship, each to its top division. */
  readonly levelBelowLinks?: ChampionshipNavLink[];
}

/**
 * The identity block on a championship detail page: the category, gender and
 * division as the page's heading, and under it the organiser, linked to its
 * page, the season and the way to the other level of the league: a link up
 * to the regional championship from a departmental one, a menu of
 * departments down from a regional one.
 *
 * Each facet of the heading is also the way to its siblings: one with
 * somewhere else to go opens a {@link LinkMenu} of them, one without stays
 * plain text, so a championship that is its organiser's only division shows
 * no division control at all.
 *
 * The organiser is the committee at departmental level and the league
 * otherwise, named after its department or region. It is left out when neither
 * is set — national championships have no organisation above them.
 */
export function ChampionshipHeader({
  championship,
  categoryLinks,
  genderLinks,
  divisionLinks,
  levelAboveHref,
  levelBelowLinks = [],
}: ChampionshipHeaderProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const tOrganizations = useTranslations("organizations");

  const genderLabel = tCommon(`gender.${championship.gender}`);
  const divisionLabel = tCompetitions("divisionWithValue", {
    value: championship.division,
  });

  const facets = [
    {
      label: championship.category,
      ariaLabel: tCompetitions("categoryAriaLabel"),
      links: categoryLinks,
    },
    {
      label: genderLabel,
      ariaLabel: tCompetitions("genderAriaLabel"),
      links: genderLinks,
    },
    {
      label: divisionLabel,
      ariaLabel: tCompetitions("divisionAriaLabel"),
      links: divisionLinks,
    },
  ];

  const isDepartmental = championship.level === CompetitionLevel.DEPARTMENTAL;
  const organizer = isDepartmental
    ? {
        kind: tOrganizations("header.committeeKind"),
        place: championship.departmentName,
        id: championship.committeeId,
        path: "/organizations/committees",
      }
    : {
        kind: tOrganizations("header.leagueKind"),
        place: championship.regionName,
        id: championship.leagueId,
        path: "/organizations/leagues",
      };

  return (
    <Card padding="none">
      <div className="p-4 sm:p-6">
        {/* Named outright: computed from its content, the name would take in
            each menu's own label too ("Seniors Category · Men Gender …"). */}
        <Text
          variant="h1"
          className="text-xl md:text-2xl"
          aria-label={buildChampionshipHeading(championship, {
            gender: genderLabel,
            division: divisionLabel,
          })}
        >
          {facets.map((facet, index) => (
            <Fragment key={facet.ariaLabel}>
              {index > 0 && " · "}
              {facet.links.length > 1 ? (
                <LinkMenu
                  label={facet.label}
                  ariaLabel={facet.ariaLabel}
                  items={facet.links}
                />
              ) : (
                facet.label
              )}
            </Fragment>
          ))}
        </Text>
        {/* A div, not the variant's p: a LinkMenu's panel is a div. */}
        <Text variant="body" as="div" className="mt-1 text-text-secondary">
          {organizer.place && organizer.id !== null && (
            <>
              {organizer.kind}
              {" · "}
              <TextLink
                href={`${organizer.path}/${organizer.id}`}
                variant="plain"
              >
                {organizer.place}
              </TextLink>
              {" · "}
            </>
          )}
          {championship.seasonYear}
          {levelAboveHref && (
            <>
              {" · "}
              <TextLink href={levelAboveHref}>
                <ArrowUp
                  aria-hidden
                  className="inline size-[1em] align-[-0.125em]"
                />
                {tCompetitions("regionalLevel")}
              </TextLink>
            </>
          )}
          {levelBelowLinks.length > 0 && (
            <>
              {" · "}
              <LinkMenu
                label={tCompetitions("departmentalLevel")}
                ariaLabel={tCompetitions("departmentsAriaLabel")}
                items={levelBelowLinks}
              />
            </>
          )}
        </Text>
      </div>
    </Card>
  );
}

export default ChampionshipHeader;
