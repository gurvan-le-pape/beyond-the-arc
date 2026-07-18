// src/backend/modules/players/dto/players.response.dto.ts
import { Position } from "@common/constants";
import { ReboundsDto } from "@common/dto";
import {
  Category,
  CompetitionLevel,
  Gender,
  PlayerSummaryDto,
} from "@common/index";
import { ApiProperty } from "@nestjs/swagger";

/**
 * League reference embedded in a player's club committee.
 */
export class PlayerLeagueRefDto {
  @ApiProperty({ description: "League ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "League name",
    example: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
    type: String,
  })
  name!: string;
}

/**
 * Committee reference embedded in a player's club.
 */
export class PlayerCommitteeRefDto {
  @ApiProperty({ description: "Committee ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Committee name",
    example: "Comité Départemental de l'Ain",
    type: String,
  })
  name!: string;

  @ApiProperty({ description: "League information", type: PlayerLeagueRefDto })
  league!: PlayerLeagueRefDto;
}

/**
 * Club reference embedded in a player's team.
 */
export class PlayerClubRefDto {
  @ApiProperty({ description: "Club ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Committee information",
    type: PlayerCommitteeRefDto,
  })
  committee!: PlayerCommitteeRefDto;
}

/**
 * Championship reference embedded in a player's pool.
 */
export class PlayerChampionshipRefDto {
  @ApiProperty({ description: "Championship ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Championship name",
    example: "Championship Régional U18 male",
    type: String,
  })
  name!: string;

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
 * Pool reference embedded in a player's team.
 */
export class PlayerPoolRefDto {
  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Pool name", example: "Poule A", type: String })
  name!: string;

  @ApiProperty({
    description: "Championship the pool belongs to",
    type: PlayerChampionshipRefDto,
  })
  championship!: PlayerChampionshipRefDto;
}

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

  @ApiProperty({ description: "Club information", type: PlayerClubRefDto })
  club!: PlayerClubRefDto;

  @ApiProperty({
    description: "Current pool, or null when the team has none",
    type: PlayerPoolRefDto,
    nullable: true,
  })
  pool!: PlayerPoolRefDto | null;
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
    type: String,
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
    description: "Player birthdate",
    example: "2000-06-15",
    type: String,
  })
  birthdate!: Date;

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
    description: "Play time intervals",
    example: [
      [0, 600],
      [1200, 2400],
    ],
    type: "array",
    isArray: true,
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
    description: "Match date",
    example: "2024-02-05T19:00:00Z",
    type: String,
  })
  date!: Date;

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
    description: "Home team score",
    example: 85,
    type: Number,
  })
  homeTeamScore!: number | null;

  @ApiProperty({
    description: "Away team score",
    example: 72,
    type: Number,
  })
  awayTeamScore!: number | null;

  @ApiProperty({
    description: "Player and their statistics for this match",
    type: PlayerMatchEntryDto,
  })
  player!: PlayerMatchEntryDto;
}
