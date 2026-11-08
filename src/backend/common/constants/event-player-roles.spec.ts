// src/backend/common/constants/event-player-roles.spec.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { EVENT_PLAYER_ROLES } from "./event-player-roles";
import { EVENT_TYPE_LIST } from "./event-types";

/** The scheduler's table, read from its source: `"type": ("main", None),`. */
function schedulerTable(): Record<string, [string | null, string | null]> {
  const source = readFileSync(
    join(__dirname, "../../db/python/event_rules.py"),
    "utf8",
  );
  const block = source.slice(source.indexOf("EVENT_PLAYER_ROLES = {"));
  const rows = block
    .slice(0, block.indexOf("\n}"))
    .matchAll(/^\s+"([^"]+)": \(("[^"]+"|None), ("[^"]+"|None)\),$/gm);
  const role = (value: string) =>
    value === "None" ? null : value.slice(1, -1);
  return Object.fromEntries(
    [...rows].map(([, type, main, other]) => [type, [role(main), role(other)]]),
  );
}

describe("EVENT_PLAYER_ROLES", () => {
  it("names the roles of all forty event types", () => {
    expect(EVENT_TYPE_LIST).toHaveLength(40);
    expect(Object.keys(EVENT_PLAYER_ROLES).sort()).toEqual(
      [...EVENT_TYPE_LIST].sort(),
    );
  });

  it("is the table the scheduler writes the columns from", () => {
    expect(schedulerTable()).toEqual(EVENT_PLAYER_ROLES);
  });

  it("gives a shot's main role to the player who took it", () => {
    expect(EVENT_PLAYER_ROLES.blocked_shot[0]).toBe("blocked");
    expect(EVENT_PLAYER_ROLES.made_layup[0]).toBe("shooter");
    expect(EVENT_PLAYER_ROLES["3_point_and_1"][0]).toBe("shooter");
  });
});
