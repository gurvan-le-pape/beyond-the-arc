// src/backend/modules/competitions/leaderboards/dto/leaderboards.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for a leaderboard entry.
 * Provides a stable API contract independent of database schema.
 */
export class LeaderboardResponseDto {
  @ApiProperty({
    description: "Unique leaderboard entry identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Team ID",
    example: 5,
    type: Number,
  })
  teamId!: number;

  @ApiProperty({
    description: "Team number within the club",
    example: 1,
    type: Number,
  })
  teamNumber!: number;

  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  clubName!: string;

  @ApiProperty({
    description: "Total points earned",
    example: 12,
    type: Number,
  })
  points!: number;

  @ApiProperty({
    description: "Number of games played",
    example: 8,
    type: Number,
  })
  gamesPlayed!: number;

  @ApiProperty({
    description: "Number of games won",
    example: 6,
    type: Number,
  })
  gamesWon!: number;

  @ApiProperty({
    description: "Number of games lost",
    example: 2,
    type: Number,
  })
  gamesLost!: number;

  @ApiProperty({
    description: "Number of games forfeited",
    example: 0,
    type: Number,
  })
  gamesForfeited!: number;

  @ApiProperty({
    description: "Total goals scored",
    example: 645,
    type: Number,
  })
  pointsFor!: number;

  @ApiProperty({
    description: "Total goals conceded",
    example: 580,
    type: Number,
  })
  pointsAgainst!: number;

  @ApiProperty({
    description: "Goal difference (pointsFor - pointsAgainst)",
    example: 65,
    type: Number,
  })
  pointDifference!: number;
}
