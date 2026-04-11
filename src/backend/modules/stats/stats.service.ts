// src/backend/modules/stats/stats.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { StatsResponseDto } from "./dto/stats.response.dto";

/**
 * Service handling platform-wide statistics.
 * Runs all counts in parallel for efficiency.
 */
@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns platform-wide entity counts.
   * All queries run in parallel via Promise.all.
   *
   * @returns StatsResponseDto with counts for all entities
   */
  async getStats(): Promise<StatsResponseDto> {
    const [clubs, teams, players, matches, leagues, committees] =
      await Promise.all([
        this.prisma.clubs.count(),
        this.prisma.teams.count(),
        this.prisma.players.count(),
        this.prisma.matches.count(),
        this.prisma.leagues.count(),
        this.prisma.committees.count(),
      ]);

    return {
      clubs,
      teams,
      players,
      matches,
      leagues,
      committees,
    } satisfies StatsResponseDto;
  }
}
