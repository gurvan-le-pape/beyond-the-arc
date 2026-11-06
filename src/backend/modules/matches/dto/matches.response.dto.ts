// src/backend/modules/matches/dto/matches.response.dto.ts
import {
  Category,
  CompetitionLevel,
  EventType,
  Gender,
  MatchStatus,
  Role,
} from "@common/constants";
import { PlayerSummaryDto, ReboundsDto } from "@common/dto";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Championship reference embedded in a match's pool.
 */
export class MatchChampionshipRefDto {
  @ApiProperty({ description: "Championship ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Age category", example: "U18", enum: Category })
  category!: Category;

  @ApiProperty({ description: "Gender", example: Gender.MALE, enum: Gender })
  gender!: Gender;

  @ApiProperty({
    description: "Competition level",
    example: CompetitionLevel.REGIONAL,
    enum: CompetitionLevel,
  })
  level!: CompetitionLevel;

  @ApiProperty({ description: "Division number", example: 1, type: Number })
  division!: number;
}

/**
 * Pool reference embedded in a match.
 */
export class MatchPoolRefDto {
  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Pool name", example: "Poule A", type: String })
  name!: string;

  @ApiProperty({ description: "Pool letter", example: "A", type: String })
  letter!: string;

  @ApiProperty({
    description: "Championship the pool belongs to",
    type: MatchChampionshipRefDto,
  })
  championship!: MatchChampionshipRefDto;
}

/**
 * Club reference embedded in a match team.
 */
export class MatchClubRefDto {
  @ApiProperty({ description: "Club ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  name!: string;

  @ApiProperty({ description: "Committee ID", example: 1, type: Number })
  committeeId!: number;

  @ApiProperty({ description: "League ID", example: 1, type: Number })
  leagueId!: number;
}

/**
 * Team reference embedded in a match.
 */
export class MatchTeamRefDto {
  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Team number", example: 1, type: Number })
  number!: number;

  @ApiProperty({ description: "Club information", type: MatchClubRefDto })
  club!: MatchClubRefDto;
}

/**
 * Response DTO for a match entity (list view).
 */
export class MatchResponseDto {
  @ApiProperty({
    description: "Unique match identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Tip-off instant, as an ISO 8601 UTC timestamp",
    example: "2024-02-05T19:00:00Z",
    type: String,
  })
  startsAt!: Date;

  @ApiProperty({
    description: "Matchday number",
    example: 1,
    type: Number,
  })
  matchday!: number;

  @ApiProperty({
    description: "Pool information",
    type: MatchPoolRefDto,
  })
  pool!: MatchPoolRefDto;

  @ApiProperty({
    description: "Home team information",
    type: MatchTeamRefDto,
  })
  homeTeam!: MatchTeamRefDto;

  @ApiProperty({
    description: "Away team information",
    type: MatchTeamRefDto,
  })
  awayTeam!: MatchTeamRefDto;

  @ApiProperty({
    description: "Where the match is in its lifecycle",
    example: MatchStatus.COMPLETED,
    enum: MatchStatus,
  })
  status!: MatchStatus;

  @ApiProperty({
    description: "Home team score",
    example: 85,
    type: Number,
    nullable: true,
  })
  homeTeamScore!: number | null;

  @ApiProperty({
    description: "Away team score",
    example: 72,
    type: Number,
    nullable: true,
  })
  awayTeamScore!: number | null;

  @ApiProperty({
    description: "Whether the match was forfeited",
    example: false,
    type: Boolean,
  })
  forfeit!: boolean;

  @ApiProperty({
    description: "Whether the match went to overtime",
    example: false,
    type: Boolean,
  })
  overtime!: boolean;
}

/**
 * Player statistics for a match.
 */
export class PlayerStatsDto {
  @ApiProperty({ description: "Points scored", example: 15, type: Number })
  points!: number;

  @ApiProperty({ description: "Personal fouls", example: 2, type: Number })
  fouls!: number;

  @ApiProperty({ description: "Three-pointers made", example: 2, type: Number })
  threePointsMade!: number;

  @ApiProperty({
    description: "Three-pointers attempted",
    example: 5,
    type: Number,
  })
  threePointsAttempted!: number;

  @ApiProperty({
    description: "Two-point shots (interior) made",
    example: 3,
    type: Number,
  })
  twoPointsIntMade!: number;

  @ApiProperty({
    description: "Two-point shots (interior) attempted",
    example: 6,
    type: Number,
  })
  twoPointsIntAttempted!: number;

  @ApiProperty({
    description: "Two-point shots (exterior) made",
    example: 1,
    type: Number,
  })
  twoPointsExtMade!: number;

  @ApiProperty({
    description: "Two-point shots (exterior) attempted",
    example: 3,
    type: Number,
  })
  twoPointsExtAttempted!: number;

  @ApiProperty({ description: "Free throws made", example: 4, type: Number })
  freeThrowsMade!: number;

  @ApiProperty({
    description: "Free throws attempted",
    example: 5,
    type: Number,
  })
  freeThrowsAttempted!: number;

  @ApiProperty({ description: "Assists", example: 7, type: Number })
  assists!: number;

  @ApiProperty({ description: "Turnovers", example: 3, type: Number })
  turnovers!: number;

  @ApiProperty({
    description: "Rebounds breakdown",
    type: ReboundsDto,
  })
  rebounds!: ReboundsDto;

  @ApiProperty({ description: "Steals", example: 2, type: Number })
  steals!: number;

  @ApiProperty({ description: "Blocks", example: 1, type: Number })
  blocks!: number;

  @ApiProperty({
    description: "Total time on court, in seconds",
    example: 1200,
    type: Number,
  })
  playtimeSeconds!: number;

  @ApiProperty({
    // `playtimeIntervals` keeps its name rather than gaining a `Seconds`
    // suffix like the field above: it is a stored column
    // (`player_match_stats.playtime_intervals`), and renaming only the DTO
    // would put a different name on each side of the same value — the drift
    // `naming.md` exists to prevent. `playtimeSeconds` has no such
    // counterpart; it is computed from these intervals and stored nowhere.
    description:
      "Intervals the player was on court, as [start, end] pairs of seconds from tip-off",
    example: [
      [0, 600],
      [1200, 2400],
    ],
    type: "array",
    items: { type: "array", items: { type: "number" } },
  })
  playtimeIntervals!: number[][];
}

/**
 * Club name reference embedded in stats/event team info.
 */
export class ClubNameRefDto {
  @ApiProperty({ description: "Club ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  name!: string;
}

/**
 * Team reference embedded in player match stats.
 */
export class StatsTeamRefDto {
  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Team number", example: 1, type: Number })
  number!: number;

  @ApiProperty({ description: "Club information", type: ClubNameRefDto })
  club!: ClubNameRefDto;
}

/**
 * Player information with team details.
 */
export class PlayerWithTeamDto extends PlayerSummaryDto {
  @ApiProperty({
    description: "Team information",
    type: StatsTeamRefDto,
  })
  team!: StatsTeamRefDto;
}

/**
 * Player with their statistics.
 */
export class PlayerWithStatsDto {
  @ApiProperty({
    description: "Player information",
    type: PlayerWithTeamDto,
  })
  player!: PlayerWithTeamDto;

  @ApiProperty({
    description: "Player statistics for this match",
    type: PlayerStatsDto,
  })
  stats!: PlayerStatsDto;
}

/**
 * Aggregated team totals for a single match. Made/attempted are pre-formatted
 * "made/attempted" strings and percentages are "NN%" strings (or "N/A" when
 * there were no attempts); counting stats are raw numbers.
 */
export class TeamMatchStatsDto {
  @ApiProperty({
    description: "Field goals made/attempted",
    example: "25/58",
    type: String,
  })
  fieldGoals!: string;

  @ApiProperty({
    description:
      "Field goal percentage out of 100, null when there were no attempts",
    example: 43,
    type: Number,
    nullable: true,
  })
  fieldGoalPercentage!: number | null;

  @ApiProperty({
    description: "Three-pointers made/attempted",
    example: "8/22",
    type: String,
  })
  threePointers!: string;

  @ApiProperty({
    description:
      "Three-point percentage out of 100, null when there were no attempts",
    example: 36,
    type: Number,
    nullable: true,
  })
  threePointPercentage!: number | null;

  @ApiProperty({
    description: "Free throws made/attempted",
    example: "14/18",
    type: String,
  })
  freeThrows!: string;

  @ApiProperty({
    description:
      "Free throw percentage out of 100, null when there were no attempts",
    example: 78,
    type: Number,
    nullable: true,
  })
  freeThrowPercentage!: number | null;

  @ApiProperty({ description: "Total rebounds", example: 38, type: Number })
  reboundsTotal!: number;

  @ApiProperty({
    description: "Offensive rebounds",
    example: 11,
    type: Number,
  })
  reboundsOffensive!: number;

  @ApiProperty({
    description: "Defensive rebounds",
    example: 27,
    type: Number,
  })
  reboundsDefensive!: number;

  @ApiProperty({ description: "Assists", example: 17, type: Number })
  assists!: number;

  @ApiProperty({ description: "Steals", example: 6, type: Number })
  steals!: number;

  @ApiProperty({ description: "Blocks", example: 3, type: Number })
  blocks!: number;

  @ApiProperty({ description: "Turnovers", example: 12, type: Number })
  turnovers!: number;

  @ApiProperty({ description: "Personal fouls", example: 19, type: Number })
  fouls!: number;

  @ApiProperty({
    description: "Points scored in the paint (interior two-pointers x2)",
    example: 30,
    type: Number,
  })
  pointsInPaint!: number;
}

/**
 * Match player statistics response.
 */
export class MatchPlayerStatsResponseDto {
  @ApiProperty({
    description: "Home team ID",
    example: 1,
    type: Number,
  })
  homeTeamId!: number;

  @ApiProperty({
    description: "Away team ID",
    example: 2,
    type: Number,
  })
  awayTeamId!: number;

  @ApiProperty({
    description: "Player statistics for both teams",
    type: [PlayerWithStatsDto],
  })
  stats!: PlayerWithStatsDto[];

  @ApiProperty({
    description: "Aggregated totals for the home team",
    type: TeamMatchStatsDto,
  })
  homeTeamStats!: TeamMatchStatsDto;

  @ApiProperty({
    description: "Aggregated totals for the away team",
    type: TeamMatchStatsDto,
  })
  awayTeamStats!: TeamMatchStatsDto;
}

/**
 * Club name embedded in an event player's team.
 */
export class EventClubNameDto {
  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  name!: string;
}

/**
 * Team reference embedded in an event player.
 */
export class EventPlayerTeamDto {
  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Club information", type: EventClubNameDto })
  club!: EventClubNameDto;
}

/**
 * Player involved in a match event.
 */
export class EventPlayerDto {
  @ApiProperty({ description: "Player ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Player name",
    example: "John Doe",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Player jersey number",
    example: 10,
    type: Number,
  })
  number!: number;

  @ApiProperty({ description: "Team information", type: EventPlayerTeamDto })
  team!: EventPlayerTeamDto;
}

/**
 * Match event player information.
 */
export class MatchEventPlayerDto {
  @ApiProperty({
    description: "Player role in the event",
    example: Role.SHOOTER,
    enum: Role,
  })
  role!: Role;

  @ApiProperty({
    description: "Player information",
    type: EventPlayerDto,
  })
  player!: EventPlayerDto;
}

/**
 * Where a shot was taken from, in half-court metres.
 *
 * The frame: the origin is the baseline corner, `x` runs across the court's
 * 15 m width and `y` from the baseline towards half-court over 14 m.
 * The basket is at `x` 7.5, `y` 1.575. Measured on production, real shots fall
 * in x 0.23–14.98 and y 1.61–8.73.
 *
 * The fields are not `xMeters`/`yMeters`. A unit suffix would state half of
 * what is missing and the less important half — a coordinate is meaningless
 * without its origin, and no suffix can carry that.
 */
export class ShotLocationDto {
  @ApiProperty({ description: "Shot location ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Metres across the court from the baseline corner (0–15)",
    example: 5.5,
    type: Number,
  })
  x!: number;

  @ApiProperty({
    description: "Metres from the baseline towards half-court (0–14)",
    example: 3.2,
    type: Number,
  })
  y!: number;
}

/**
 * One shot on a team's or player's season shot chart: where it was taken and
 * what kind of attempt it was. The chart needs nothing else, so this carries
 * nothing else — not the event's players, clubs or description, which made the
 * full event ~470 bytes against ~55 for this.
 *
 * Coordinates are the same as `ShotLocationDto`'s.
 */
export class ShotDto {
  @ApiProperty({
    description: "Metres across the court from the baseline corner (0–15)",
    example: 5.5,
    type: Number,
  })
  x!: number;

  @ApiProperty({
    description: "Metres from the baseline towards half-court (0–14)",
    example: 3.2,
    type: Number,
  })
  y!: number;

  @ApiProperty({
    description: "Event type of the attempt (made, missed, blocked, and-1)",
    example: EventType.MADE_LAYUP,
    enum: EventType,
  })
  eventType!: EventType;
}

/**
 * Match event response.
 */
export class MatchEventDto {
  @ApiProperty({ description: "Event ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Event type",
    example: EventType.MADE_LAYUP,
    enum: EventType,
  })
  eventType!: EventType;

  @ApiProperty({
    description:
      "Instant the event occurred, as an ISO 8601 UTC timestamp — not an offset from the start of the match. The team and player event endpoints return events from many matches in one response, so there is no single match start to be relative to; compute elapsed time against the match's own `startsAt`.",
    example: "2024-02-05T19:02:00.000Z",
    type: String,
  })
  occurredAt!: Date;

  @ApiProperty({
    description:
      "Period the event belongs to: 1–4 for the quarters, 5 for the first overtime, 6 for the second, and so on. A `quarter_end` event belongs to the period it closes.",
    example: 2,
    type: Number,
  })
  period!: number;

  @ApiProperty({
    description:
      "Game-clock time left in the event's period, in whole seconds, as a scoreboard counts it down: 600 at tip-off, 0 on the buzzer. Quarters last 600 s and overtimes 300 s.",
    example: 412,
    type: Number,
  })
  secondsLeft!: number;

  @ApiProperty({
    description: "Event description",
    example: "3-pointer",
    type: String,
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: "Players involved in the event",
    type: [MatchEventPlayerDto],
  })
  players!: MatchEventPlayerDto[];

  @ApiProperty({
    description: "Shot location (if applicable)",
    type: ShotLocationDto,
    nullable: true,
  })
  shotLocation!: ShotLocationDto | null;
}

/**
 * Detailed match response with events.
 */
export class MatchDetailResponseDto extends MatchResponseDto {
  @ApiProperty({
    description: "Match events",
    type: [MatchEventDto],
  })
  matchEvents!: MatchEventDto[];
}
