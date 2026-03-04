// src/backend/modules/matches/dto/matches.response.dto.ts
import { Role } from "@common/constants/roles";
import { Category, CompetitionLevel, Gender } from "@common/index";
import { ApiProperty } from "@nestjs/swagger";

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
    type: Object,
    nullable: true,
  })
  pool!: {
    id: number;
    name: string | null;
    championship: {
      id: number;
      category: Category;
      gender: Gender;
      level: CompetitionLevel;
      division: number;
    };
  } | null;

  @ApiProperty({
    description: "Home team information",
    type: Object,
  })
  homeTeam!: {
    id: number;
    number: number;
    club: {
      id: number;
      name: string | null;
    };
  };

  @ApiProperty({
    description: "Away team information",
    type: Object,
  })
  awayTeam!: {
    id: number;
    number: number;
    club: {
      id: number;
      name: string | null;
    };
  };

  @ApiProperty({
    description: "Home team score",
    example: 85,
    type: Number,
  })
  homeTeamScore!: number;

  @ApiProperty({
    description: "Away team score",
    example: 72,
    type: Number,
  })
  awayTeamScore!: number;

  @ApiProperty({
    description: "Whether the match was forfeited",
    example: false,
    type: Boolean,
  })
  forfeit!: boolean;
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
    example: { total: 8, offensive: 3, defensive: 5 },
    type: Object,
  })
  rebounds!: {
    total: number;
    offensive: number;
    defensive: number;
  };

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
    isArray: true,
    nullable: true,
  })
  playtimeIntervals!: number[][] | null;
}

/**
 * Player information with team details.
 */
export class PlayerWithTeamDto {
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

  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  teamId!: number;

  @ApiProperty({
    description: "Team information",
    type: Object,
  })
  team!: {
    id: number;
    number: number;
    club: {
      id: number;
      name: string | null;
    };
  };
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
}

/**
 * Match event player information.
 */
export class MatchEventPlayerDto {
  @ApiProperty({
    description: "Player role in the event",
    example: "scorer",
    type: String,
  })
  role!: Role;

  @ApiProperty({
    description: "Player information",
    type: Object,
  })
  player!: {
    id: number;
    name: string;
    number: number | null;
    team: {
      id: number;
      club: {
        name: string | null;
      };
    };
  };
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
    example: "shot_made",
    type: String,
  })
  eventType!: string;

  @ApiProperty({
    description: "Event timestamp in seconds from match start",
    example: 120,
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
