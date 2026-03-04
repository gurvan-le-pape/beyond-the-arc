// src/backend/modules/organizations/clubs/dto/clubs.response.dto.ts
import { Category, CompetitionLevel, Gender } from "@common/index";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Basic club information DTO.
 */
export class ClubBasicResponseDto {
  @ApiProperty({ description: "Club ID", example: 1 })
  id!: number;

  @ApiProperty({ description: "Club name", example: "AS Monaco Basket" })
  name!: string;

  @ApiPropertyOptional({
    description: "City",
    example: "Monaco",
    nullable: true,
  })
  city!: string | null;

  @ApiPropertyOptional({
    description: "ZIP code",
    example: "98000",
    nullable: true,
  })
  zipCode!: string | null;

  @ApiPropertyOptional({
    description: "Latitude",
    example: 43.7384,
    nullable: true,
  })
  latitude!: number | null;

  @ApiPropertyOptional({
    description: "Longitude",
    example: 7.4246,
    nullable: true,
  })
  longitude!: number | null;

  @ApiPropertyOptional({
    description: "Email",
    example: "contact@club.com",
    nullable: true,
  })
  email!: string | null;

  @ApiPropertyOptional({
    description: "Phone",
    example: "0123456789",
    nullable: true,
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: "Website",
    example: "https://club.com",
    nullable: true,
  })
  website!: string | null;

  @ApiPropertyOptional({
    description: "Committee ID",
    example: 1,
    nullable: true,
  })
  committeeId!: number;

  @ApiPropertyOptional({
    description: "League ID",
    example: 1,
  })
  leagueId!: number;
}

/**
 * Leaderboard information for a team.
 */
export class TeamLeaderboardDto {
  @ApiProperty({ description: "Points earned", example: 12, type: Number })
  points!: number;

  @ApiProperty({ description: "Games played", example: 8, type: Number })
  gamesPlayed!: number;

  @ApiProperty({ description: "Games won", example: 6, type: Number })
  gamesWon!: number;

  @ApiProperty({ description: "Games lost", example: 2, type: Number })
  gamesLost!: number;

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
    description: "Championship name",
    example: "Regional U18",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Competition level",
    example: "regional",
    type: String,
  })
  level!: CompetitionLevel;

  @ApiProperty({
    description: "Division",
    example: 1,
    type: Number,
  })
  division!: number;

  @ApiProperty({
    description: "Committee ID",
    example: 1,
    type: Number,
    nullable: true,
  })
  committeeId!: number | null;

  @ApiProperty({
    description: "League regionale ID",
    example: 1,
    type: Number,
    nullable: true,
  })
  leagueId!: number | null;
}

/**
 * Pool information with championship and leaderboard.
 */
export class PoolInfoDto {
  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Pool name",
    example: "Pool A",
    type: String,
    nullable: true,
  })
  name!: string;

  @ApiProperty({
    description: "Championship details",
    type: ChampionshipInfoDto,
  })
  championship!: ChampionshipInfoDto;

  @ApiProperty({
    description: "Top teams in pool (leaderboard)",
    type: [Object],
    example: [{ teamId: 1, points: 15 }],
  })
  leaderboards!: Array<{ teamId: number; points: number }>;
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
    type: String,
    nullable: true,
  })
  category!: Category;

  @ApiProperty({
    description: "Gender",
    example: "male",
    type: String,
  })
  gender!: Gender;

  @ApiProperty({
    description: "Pool information",
    type: PoolInfoDto,
    nullable: true,
  })
  pool!: PoolInfoDto | null;

  @ApiProperty({
    description: "Team leaderboard stats",
    type: [TeamLeaderboardDto],
  })
  leaderboards!: TeamLeaderboardDto[];
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
    description: "Contact phone",
    example: "0123456789",
    type: String,
    nullable: true,
  })
  phone!: string | null;

  @ApiProperty({
    description: "Contact email",
    example: "contact@club.com",
    type: String,
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    description: "Website URL",
    example: "https://club.com",
    type: String,
    nullable: true,
  })
  website!: string | null;

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
    description: "Region code",
    example: "84",
    type: String,
    nullable: true,
  })
  code!: string | null;

  @ApiProperty({
    description: "League name",
    example: "League Auvergne-Rhône-Alpes",
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
  @ApiProperty({ description: "Department ID", example: 1, type: Number })
  id!: number;

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
  department!: {
    id: number;
    name: string;
    code: string;
  };

  @ApiPropertyOptional({
    description: "League regionale ID",
    example: 1,
    nullable: true,
  })
  leagueId!: number;

  @ApiPropertyOptional({
    description:
      "Region information (only returned from /departments endpoint)",
    type: () => RegionInfoDto,
    nullable: true,
  })
  region?: { id: number };

  @ApiProperty({
    description: "Number of clubs in this department",
    example: 15,
  })
  clubCount!: number;
}

export class RegionInfoDto {
  @ApiProperty({ example: 1 })
  id!: number;
}
