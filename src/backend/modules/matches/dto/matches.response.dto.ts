// src/backend/modules/matches/dto/matches.response.dto.ts
import { MatchEventRole, MatchEventType } from "@common/constants";
import { ReboundsDto } from "@common/dto";
import {
  Category,
  CompetitionLevel,
  Gender,
  PlayerSummaryDto,
} from "@common/index";
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
    description: "Match date",
    example: "2024-02-05T19:00:00Z",
    type: String,
  })
  date!: Date;

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
    description: "Total playtime in seconds",
    example: 1200,
    type: Number,
  })
  playtime!: number;

  @ApiProperty({
    description: "Playtime intervals [start, end] in seconds",
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
    description: 'Field goal percentage, or "N/A" when no attempts',
    example: "43%",
    type: String,
  })
  fieldGoalPercentage!: string;

  @ApiProperty({
    description: "Three-pointers made/attempted",
    example: "8/22",
    type: String,
  })
  threePointers!: string;

  @ApiProperty({
    description: 'Three-point percentage, or "N/A" when no attempts',
    example: "36%",
    type: String,
  })
  threePointPercentage!: string;

  @ApiProperty({
    description: "Free throws made/attempted",
    example: "14/18",
    type: String,
  })
  freeThrows!: string;

  @ApiProperty({
    description: 'Free throw percentage, or "N/A" when no attempts',
    example: "78%",
    type: String,
  })
  freeThrowPercentage!: string;

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
    example: MatchEventRole.SHOOTER,
    enum: MatchEventRole,
  })
  role!: MatchEventRole;

  @ApiProperty({
    description: "Player information",
    type: EventPlayerDto,
  })
  player!: EventPlayerDto;
}

/**
 * Shot location information.
 */
export class ShotLocationDto {
  @ApiProperty({ description: "Shot location ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "X coordinate", example: 5.5, type: Number })
  x!: number;

  @ApiProperty({ description: "Y coordinate", example: 3.2, type: Number })
  y!: number;
}

/**
 * Match event response.
 */
export class MatchEventDto {
  @ApiProperty({ description: "Event ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Match ID (present on shot event queries)",
    example: 1,
    type: Number,
    required: false,
  })
  matchId?: number;

  @ApiProperty({
    description: "Event type",
    example: MatchEventType.MADE_LAYUP,
    enum: MatchEventType,
  })
  eventType!: MatchEventType;

  @ApiProperty({
    description:
      "Instant the event occurred, as an ISO 8601 UTC timestamp — not an offset from the start of the match. The team and player event endpoints return events from many matches in one response, so there is no single match start to be relative to; compute elapsed time against the match's own `date`.",
    example: "2024-02-05T19:02:00.000Z",
    type: String,
  })
  timestamp!: Date;

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
