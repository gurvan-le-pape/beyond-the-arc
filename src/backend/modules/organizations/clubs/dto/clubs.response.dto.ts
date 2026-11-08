// src/backend/modules/organizations/clubs/dto/clubs.response.dto.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Basic club information DTO — the shape of every list response.
 *
 * No contact details: a club's phone and email are mostly a volunteer's own,
 * and FFBB publishes them on the page the detail endpoint's `ffbbUrl` links to.
 */
export class ClubBasicResponseDto {
  @ApiProperty({ description: "Club ID", example: 1 })
  id!: number;

  @ApiProperty({ description: "Club name", example: "AS Monaco Basket" })
  name!: string;

  @ApiProperty({
    description: "City",
    example: "Monaco",
    type: String,
    nullable: true,
  })
  city!: string | null;

  @ApiProperty({
    description: "ZIP code",
    example: "98000",
    type: String,
    nullable: true,
  })
  zipCode!: string | null;

  @ApiProperty({
    description: "Latitude",
    example: 43.7384,
    type: Number,
    nullable: true,
  })
  latitude!: number | null;

  @ApiProperty({
    description: "Longitude",
    example: 7.4246,
    type: Number,
    nullable: true,
  })
  longitude!: number | null;

  @ApiProperty({
    description: "Committee ID",
    example: 1,
  })
  committeeId!: number;

  @ApiProperty({
    description: "League ID",
    example: 1,
  })
  leagueId!: number;
}

/**
 * Leaderboard information for a team.
 */
export class TeamLeaderboardDto {
  @ApiProperty({
    description: "Position in pool standings",
    example: 1,
    type: Number,
    nullable: true,
  })
  rank!: number | null;

  @ApiProperty({
    description: "Total number of teams in the pool",
    example: 8,
    type: Number,
    nullable: true,
  })
  poolSize!: number | null;

  @ApiProperty({ description: "Points earned", example: 12, type: Number })
  points!: number;

  @ApiProperty({ description: "Games played", example: 8, type: Number })
  gamesPlayed!: number;

  @ApiProperty({ description: "Games won", example: 6, type: Number })
  gamesWon!: number;

  @ApiProperty({ description: "Games lost", example: 2, type: Number })
  gamesLost!: number;

  @ApiProperty({
    description: "Games forfeited: lost by not playing, for no points",
    example: 0,
    type: Number,
  })
  gamesForfeited!: number;

  @ApiProperty({ description: "Goal difference", example: 45, type: Number })
  pointDifference!: number;

  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  poolId!: number;
}

/**
 * Championship information.
 */
export class ChampionshipInfoDto {
  @ApiProperty({ description: "Championship ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Competition level",
    example: CompetitionLevel.REGIONAL,
    enum: CompetitionLevel,
  })
  level!: CompetitionLevel;

  @ApiProperty({
    description: "Division",
    example: 1,
    type: Number,
  })
  division!: number;
}

/**
 * Pool information with championship and leaderboard.
 */
export class PoolInfoDto {
  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Pool letter", example: "A", type: String })
  letter!: string;

  @ApiProperty({
    description: "Championship details",
    type: ChampionshipInfoDto,
  })
  championship!: ChampionshipInfoDto;
}

/**
 * Team information for club details.
 */
export class TeamInfoDto {
  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Team number within club",
    example: 1,
    type: Number,
  })
  number!: number;

  @ApiProperty({
    description: "Category",
    example: "U18",
    enum: Category,
  })
  category!: Category;

  @ApiProperty({
    description: "Gender",
    example: Gender.MALE,
    enum: Gender,
  })
  gender!: Gender;

  @ApiProperty({
    description: "Pool information",
    type: PoolInfoDto,
  })
  pool!: PoolInfoDto;

  @ApiProperty({
    description: "Team leaderboard stats",
    type: TeamLeaderboardDto,
  })
  leaderboard!: TeamLeaderboardDto;
}

/**
 * Detailed club information including teams.
 */
export class ClubDetailedResponseDto {
  @ApiProperty({
    description: "Unique club identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "City",
    example: "Monaco",
    type: String,
    nullable: true,
  })
  city!: string | null;

  @ApiProperty({
    description: "Postal code",
    example: "98000",
    type: String,
    nullable: true,
  })
  zipCode!: string | null;

  @ApiProperty({
    description: "Street address",
    example: "1 Avenue des Papalins",
    type: String,
    nullable: true,
  })
  address!: string | null;

  @ApiProperty({
    description:
      "The club's page on the FFBB competitions site, where its contact details are kept up to date",
    example:
      "https://competitions.ffbb.com/ligues/sud/comites/0013/clubs/sud0013011",
    type: String,
    nullable: true,
  })
  ffbbUrl!: string | null;

  @ApiProperty({
    description: "Teams belonging to this club",
    type: [TeamInfoDto],
  })
  teams!: TeamInfoDto[];
}

/**
 * Region-level club statistics.
 */
export class ClubStatsByRegionDto {
  @ApiProperty({ description: "League regionale ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description:
      "Region code — the FFBB's alphabetic league code, not the INSEE numeric region code",
    example: "ARA",
    type: String,
  })
  code!: string;

  @ApiProperty({
    description: "League name",
    example: "AUVERGNE-RHÔNE-ALPES",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Number of clubs in this region",
    example: 42,
    type: Number,
  })
  clubCount!: number;
}

/**
 * Department information.
 */
export class DepartmentInfoDto {
  @ApiProperty({
    description: "Department name",
    example: "Ain",
    type: String,
  })
  name!: string;

  @ApiProperty({ description: "Department code", example: "01", type: String })
  code!: string;
}

/**
 * Department-level club statistics.
 */
export class ClubStatsByDepartmentDto {
  @ApiProperty({
    description: "Committee ID",
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: "Committee name",
    example: "Comité de l'Ain",
  })
  name!: string;

  @ApiProperty({
    description: "Department information",
    type: () => DepartmentInfoDto,
  })
  department!: DepartmentInfoDto;

  @ApiProperty({
    description: "League regionale ID",
    example: 1,
  })
  leagueId!: number;

  @ApiProperty({
    description: "Number of clubs in this department",
    example: 15,
  })
  clubCount!: number;
}
