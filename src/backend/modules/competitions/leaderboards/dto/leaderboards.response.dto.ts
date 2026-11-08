// src/backend/modules/competitions/leaderboards/dto/leaderboards.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

import { FORM_LENGTH, FormResult } from "../recent-form";

/** One game of a team's recent form. */
export class FormGameDto {
  @ApiProperty({ description: "The match", example: 4021, type: Number })
  matchId!: number;

  @ApiProperty({
    description:
      "How it went for the team: W for a win, L for a loss, F for a forfeit",
    enum: Object.values(FormResult),
    example: "W",
  })
  result!: FormResult;
}

/**
 * Response DTO for a team's row in its pool's standings.
 */
export class LeaderboardResponseDto {
  @ApiProperty({
    description: "Team ID",
    example: 5,
    type: Number,
  })
  teamId!: number;

  @ApiProperty({
    description: "Position in the pool standings",
    example: 1,
    type: Number,
  })
  rank!: number;

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

  @ApiProperty({
    description: `The team's last ${FORM_LENGTH} games in the pool, oldest first. Shorter early in the season, empty before the team's first game.`,
    type: [FormGameDto],
  })
  form!: FormGameDto[];
}
