// src/backend/modules/teams/dto/teams.response.dto.ts
import { Category, CompetitionLevel, Gender } from "@common/index";
import { PlayerMatchStatsDto } from "@modules/players/dto/players.response.dto";
import { ApiProperty } from "@nestjs/swagger";

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
    description: "Age category",
    example: "U18",
    type: String,
    nullable: true,
  })
  category!: Category;

  @ApiProperty({
    description: "Gender category",
    example: "M",
    type: String,
    nullable: true,
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
    type: Object,
  })
  club!: {
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

  @ApiProperty({
    description: "Pool information",
    type: Object,
    nullable: true,
  })
  pool!: {
    id: number;
    name: string;
    letter: string;
    championship: {
      id: number;
      name: string;
      level: CompetitionLevel;
      division: number;
    };
  } | null;

  @ApiProperty({
    description: "Player count",
    type: Object,
  })
  _count!: {
    players: number;
  };
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
 * Player with their statistics for a match.
 */
export class MatchPlayerDto {
  @ApiProperty({
    description: "Player information",
    type: Object,
  })
  player!: {
    id: number;
    name: string;
    number: number;
    teamId: number;
  };

  @ApiProperty({
    description: "Player statistics for this match",
    type: PlayerMatchStatsDto,
  })
  stats!: PlayerMatchStatsDto;
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
    description: "Players and their statistics for this match",
    type: [MatchPlayerDto],
  })
  players!: MatchPlayerDto[];
}

/**
 * Detailed team response with players and recent matches.
 */
export class TeamDetailResponseDto extends TeamResponseDto {
  @ApiProperty({ description: "Team players", type: Array })
  players!: Array<{
    id: number;
    name: string;
    number: number;
    teamId: number;
  }>;

  @ApiProperty({ description: "Recent home matches (up to 5)", type: Array })
  homeMatches!: Array<{
    id: number;
    date: Date;
    homeTeamScore: number;
    awayTeamScore: number;
    awayTeam: {
      id: number;
      number: number;
      club: { id: number; name: string };
    };
    pool: {
      id: number;
      name: string;
      championship: { id: number; name: string };
    } | null;
  }>;

  @ApiProperty({ description: "Recent away matches (up to 5)", type: Array })
  awayMatches!: Array<{
    id: number;
    date: Date;
    homeTeamScore: number;
    awayTeamScore: number;
    homeTeam: {
      id: number;
      number: number;
      club: { id: number; name: string };
    };
    pool: {
      id: number;
      name: string;
      championship: { id: number; name: string };
    } | null;
  }>;
}
