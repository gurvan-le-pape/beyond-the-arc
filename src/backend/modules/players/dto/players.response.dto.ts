// src/backend/modules/players/dto/players.response.dto.ts
import { Category, Gender, MatchStatus, Position } from "@common/constants";
import {
  ClubRefDto,
  PlayerSummaryDto,
  PoolRefDto,
  ReboundsDto,
} from "@common/dto";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Team information embedded in a player response.
 */
export class PlayerTeamDto {
  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Team number", example: 1, type: Number })
  number!: number;

  @ApiProperty({ description: "Club ID", example: 1, type: Number })
  clubId!: number;

  @ApiProperty({ description: "Age category", example: "U18", enum: Category })
  category!: Category;

  @ApiProperty({ description: "Gender", example: Gender.MALE, enum: Gender })
  gender!: Gender;

  @ApiProperty({ description: "Club information", type: ClubRefDto })
  club!: ClubRefDto;

  @ApiProperty({
    description: "Current pool",
    type: PoolRefDto,
  })
  pool!: PoolRefDto;
}

/**
 * Response DTO for a player entity.
 */
export class PlayerResponseDto {
  @ApiProperty({
    description: "Unique player identifier",
    example: 1,
    type: Number,
  })
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

  @ApiProperty({
    description: "Player position",
    example: "PG",
    enum: Position,
  })
  position!: Position;

  @ApiProperty({
    description: "Player height in centimeters",
    example: 185,
    type: Number,
  })
  heightCm!: number;

  @ApiProperty({
    description: "Player weight in kilograms",
    example: 80,
    type: Number,
  })
  weightKg!: number;

  @ApiProperty({
    description: "Player birthdate, as a calendar date with no time",
    example: "2000-06-15",
    type: String,
    format: "date",
  })
  birthdate!: string;

  @ApiProperty({
    description: "Team ID this player belongs to",
    example: 1,
    type: Number,
  })
  teamId!: number;

  @ApiProperty({
    description: "Team information",
    type: PlayerTeamDto,
  })
  team!: PlayerTeamDto;
}

/**
 * Available filter values for player queries.
 * Returned by GET /players/filter-values.
 */
export class FilterValuesPlayersResponseDto {
  @ApiProperty({ type: [Number] })
  numbers!: number[];

  @ApiProperty({ type: [Number] })
  teamNumbers!: number[];
}

/**
 * Player statistics for a match.
 * All stat fields are non-nullable: PlayerMatchStats uses Int @default(0).
 */
export class PlayerMatchStatsDto {
  @ApiProperty({
    description: "Points scored",
    example: 15,
    type: Number,
  })
  points!: number;

  @ApiProperty({
    description: "Personal fouls",
    example: 2,
    type: Number,
  })
  fouls!: number;

  @ApiProperty({
    description: "Three-pointers made",
    example: 2,
    type: Number,
  })
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

  @ApiProperty({
    description: "Free throws made",
    example: 4,
    type: Number,
  })
  freeThrowsMade!: number;

  @ApiProperty({
    description: "Free throws attempted",
    example: 5,
    type: Number,
  })
  freeThrowsAttempted!: number;

  @ApiProperty({
    description: "Assists",
    example: 7,
    type: Number,
  })
  assists!: number;

  @ApiProperty({
    description: "Turnovers",
    example: 3,
    type: Number,
  })
  turnovers!: number;

  @ApiProperty({
    description: "Rebounds breakdown",
    type: ReboundsDto,
  })
  rebounds!: ReboundsDto;

  @ApiProperty({
    description: "Steals",
    example: 2,
    type: Number,
  })
  steals!: number;

  @ApiProperty({
    description: "Blocks",
    example: 1,
    type: Number,
  })
  blocks!: number;

  @ApiProperty({
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
 * Club reference embedded in a match-history team.
 */
export class HistoryClubRefDto {
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
 * Team reference embedded in a match-history entry.
 */
export class HistoryTeamRefDto {
  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Team number", example: 1, type: Number })
  number!: number;

  @ApiProperty({ description: "Club information", type: HistoryClubRefDto })
  club!: HistoryClubRefDto;
}

/**
 * Player identity and stats pair within a match-history entry.
 */
export class PlayerMatchEntryDto {
  @ApiProperty({ description: "Player information", type: PlayerSummaryDto })
  player!: PlayerSummaryDto;

  @ApiProperty({
    description: "Player statistics for this match",
    type: PlayerMatchStatsDto,
  })
  stats!: PlayerMatchStatsDto;
}

/**
 * Match history entry for a player.
 */
export class MatchHistoryDto {
  @ApiProperty({
    description: "Match ID",
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
    description: "Home team information",
    type: HistoryTeamRefDto,
  })
  homeTeam!: HistoryTeamRefDto;

  @ApiProperty({
    description: "Away team information",
    type: HistoryTeamRefDto,
  })
  awayTeam!: HistoryTeamRefDto;

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
    description: "Player and their statistics for this match",
    type: PlayerMatchEntryDto,
  })
  player!: PlayerMatchEntryDto;
}

/**
 * Aggregated career totals and per-game averages for a player, summed over
 * their match history. Per-game values are rounded to one decimal.
 */
export class PlayerCareerStatsDto {
  @ApiProperty({ description: "Games played", example: 24, type: Number })
  gamesPlayed!: number;

  @ApiProperty({ description: "Total points", example: 372, type: Number })
  points!: number;

  @ApiProperty({
    description: "Total rebounds (offensive + defensive)",
    example: 168,
    type: Number,
  })
  rebounds!: number;

  @ApiProperty({ description: "Total assists", example: 96, type: Number })
  assists!: number;

  @ApiProperty({ description: "Total steals", example: 41, type: Number })
  steals!: number;

  @ApiProperty({ description: "Total blocks", example: 18, type: Number })
  blocks!: number;

  @ApiProperty({ description: "Total turnovers", example: 55, type: Number })
  turnovers!: number;

  @ApiProperty({
    description: "Total personal fouls",
    example: 62,
    type: Number,
  })
  fouls!: number;

  @ApiProperty({ description: "Points per game", example: 15.5, type: Number })
  pointsPerGame!: number;

  @ApiProperty({ description: "Rebounds per game", example: 7, type: Number })
  reboundsPerGame!: number;

  @ApiProperty({ description: "Assists per game", example: 4, type: Number })
  assistsPerGame!: number;

  @ApiProperty({ description: "Steals per game", example: 1.7, type: Number })
  stealsPerGame!: number;

  @ApiProperty({ description: "Blocks per game", example: 0.8, type: Number })
  blocksPerGame!: number;

  @ApiProperty({
    description: "Turnovers per game",
    example: 2.3,
    type: Number,
  })
  turnoversPerGame!: number;

  @ApiProperty({ description: "Fouls per game", example: 2.6, type: Number })
  foulsPerGame!: number;
}

/**
 * Player match history with aggregated career stats.
 */
export class PlayerMatchHistoryResponseDto {
  @ApiProperty({
    description: "Match history entries, ordered by date (most recent first)",
    type: [MatchHistoryDto],
  })
  matches!: MatchHistoryDto[];

  @ApiProperty({
    description: "Aggregated career totals and per-game averages",
    type: PlayerCareerStatsDto,
  })
  career!: PlayerCareerStatsDto;
}
