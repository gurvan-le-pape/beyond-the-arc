// src/frontend/features/competitions/championships/components/list/championships-overview/levelConfig.ts
import { FRANCE_REGIONS } from "@/features/geography/constants";
import { DEPARTMENT_SHAPES } from "@/features/organizations/utils";

/** What differs between the regional and departmental tabs. */
export const LEVEL_CONFIG = {
  regional: {
    /** The query parameter holding the chosen organiser. */
    param: "league",
    shapes: FRANCE_REGIONS,
    mapCaption: "mapCaptionRegional",
    pick: "pickLeague",
    fetchError: "errors.fetchLeagues",
    back: "filters.allLeagues",
  },
  departmental: {
    param: "committee",
    shapes: DEPARTMENT_SHAPES,
    mapCaption: "mapCaptionDepartmental",
    pick: "pickCommittee",
    fetchError: "errors.fetchCommittees",
    back: "filters.allCommittees",
  },
} as const;
