// src/backend/modules/teams/dto/teams.response.dto.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { PlayerSummaryDto } from "@common/dto";
import {
  HistoryTeamRefDto,
  PlayerCareerStatsDto,
  PlayerMatchStatsDto,
} from "@modules/players/dto";
import { ApiProperty } from "@nestjs/swagger";

/**
 * League reference embedded in a team's club committee.
 */
export class TeamLeagueRefDto {
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
 * Committee reference embedded in a team's club.
 */
export class TeamCommitteeRefDto {
  @ApiProperty({ description: "Committee ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Committee name",
    example: "Comité Départemental de l'Ain",
    type: String,
  })
  name!: string;

  @ApiProperty({ description: "League information", type: TeamLeagueRefDto })
  league!: TeamLeagueRefDto;
}

/**
 * Club reference embedded in a team response.
 */
export class TeamClubRefDto {
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
    type: TeamCommitteeRefDto,
  })
  committee!: TeamCommitteeRefDto;
}

/**
 * Championship reference embedded in a team's pool.
 */
export class TeamChampionshipRefDto {
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
 * Pool reference embedded in a team response.
 */
export class TeamPoolRefDto {
  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Pool name", example: "Poule A", type: String })
  name!: string;

  @ApiProperty({ description: "Pool letter", example: "A", type: String })
  letter!: string;

  @ApiProperty({
    description: "Championship the pool belongs to",
    type: TeamChampionshipRefDto,
  })
  championship!: TeamChampionshipRefDto;
}

/**
 * Relation counts embedded in a team response.
 */
export class TeamCountDto {
  @ApiProperty({ description: "Player count", example: 12, type: Number })
  players!: number;
}

/**
 * Response DTO for a team entity.
 */
export class TeamResponseDto {
  @ApiProperty({
    description: "Unique team identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Team number",
    example: 1,
    type: Number,
  })
  number!: number;

  @ApiProperty({
    description: "Club ID this team belongs to",
    example: 1,
    type: Number,
  })
  clubId!: number;

  @ApiProperty({
    description: "Season this team's entry belongs to",
    example: "2025-2026",
    type: String,
  })
  seasonYear!: string;

  @ApiProperty({
    description: "Age category",
    example: "U18",
    enum: Category,
  })
  category!: Category;

  @ApiProperty({
    description: "Gender category",
    example: Gender.MALE,
    enum: Gender,
  })
  gender!: Gender;

  @ApiProperty({
    description: "Team color",
    example: "Blue",
    type: String,
    nullable: true,
  })
  color!: string | null;

  @ApiProperty({
    description: "Pool ID",
    example: 1,
    type: Number,
    nullable: true,
  })
  poolId!: number | null;

  @ApiProperty({
    description: "Club information",
    type: TeamClubRefDto,
  })
  club!: TeamClubRefDto;

  @ApiProperty({
    description: "Pool information, or null when the team has none",
    type: TeamPoolRefDto,
    nullable: true,
  })
  pool!: TeamPoolRefDto | null;

  @ApiProperty({
    description: "Relation counts",
    type: TeamCountDto,
  })
  _count!: TeamCountDto;
}

/**
 * Available filter values for team queries.
 * Returned by GET /teams/filter-values.
 */
export class FilterValuesTeamsResponseDto {
  @ApiProperty({
    description: "Available team numbers",
    example: [1, 2, 3],
    type: [Number],
  })
  numbers!: number[];

  @ApiProperty({
    description: "Available pool letters",
    example: ["A", "B", "C"],
    type: [String],
  })
  poolLetters!: string[];

  @ApiProperty({
    description: "Available divisions",
    example: [1, 2],
    type: [Number],
  })
  divisions!: number[];
}

/**
 * Match history entry for a team.
 */
export class TeamMatchHistoryDto {
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
}

/**
 * Aggregated season totals for a team: the same counting totals and per-game
 * averages as a player's career, summed over the team's players, plus the
 * number of distinct players who appeared for the team.
 */
export class TeamSeasonStatsDto extends PlayerCareerStatsDto {
  @ApiProperty({
    description: "Number of distinct players who appeared for the team",
    example: 14,
    type: Number,
  })
  players!: number;
}

/**
 * Team match history with aggregated season stats.
 */
export class TeamMatchHistoryResponseDto {
  @ApiProperty({
    description: "Match history entries, ordered by date (most recent first)",
    type: [TeamMatchHistoryDto],
  })
  matches!: TeamMatchHistoryDto[];

  @ApiProperty({
    description: "Aggregated season totals and per-game averages",
    type: TeamSeasonStatsDto,
  })
  seasonStats!: TeamSeasonStatsDto;
}

/**
 * A roster player with their season totals and per-game averages. The season is
 * the player's whole stat history, since a player belongs to one season-specific
 * team.
 */
export class TeamRosterPlayerDto extends PlayerSummaryDto {
  @ApiProperty({
    description: "Season totals and per-game averages",
    type: PlayerCareerStatsDto,
  })
  seasonStats!: PlayerCareerStatsDto;
}

/**
 * Detailed team response with its roster.
 */
export class TeamDetailResponseDto extends TeamResponseDto {
  @ApiProperty({ description: "Team players", type: [TeamRosterPlayerDto] })
  players!: TeamRosterPlayerDto[];
}
