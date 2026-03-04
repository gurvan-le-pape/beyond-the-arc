// src/backend/modules/players/dto/players.response.dto.ts
import { Category, Gender } from "@common/index";
import { ApiProperty } from "@nestjs/swagger";

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
    description: "Team ID this player belongs to",
    example: 1,
    type: Number,
  })
  teamId!: number;

  @ApiProperty({
    description: "Team information",
    type: Object,
  })
  team!: {
    id: number;
    number: number;
    clubId: number;
    category: Category;
    gender: Gender;
    club: {
      id: number;
      name: string;
      committee: {
        id: number;
        name: string;
        league: {
          id: number;
          name: string;
        };
      };
    };
    pool: {
      id: number;
      name: string;
      championship: {
        id: number;
        name: string;
        level: string;
        division: number;
      };
    } | null;
  };
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
    example: { total: 8, offensive: 3, defensive: 5 },
    type: Object,
  })
  rebounds!: {
    total: number;
    offensive: number;
    defensive: number;
  };

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
    nullable: true,
  })
  playtimeIntervals!: number[][] | null;
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
    type: Object,
  })
  homeTeam!: {
    id: number;
    number: number;
    club: {
      id: number;
      name: string;
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
      name: string;
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
    description: "Player and their statistics for this match",
    type: Object,
  })
  player!: {
    player: {
      id: number;
      name: string;
      number: number;
      teamId: number;
    };
    stats: PlayerMatchStatsDto;
  };
}
