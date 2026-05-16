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
    const [
      clubs,
      teams,
      players,
      matches,
      leagues,
      committees,
      nationalChampionships,
      regionalChampionships,
      departmentalChampionships,
    ] = await Promise.all([
      this.prisma.client.clubs.count(),
      this.prisma.client.teams.count(),
      this.prisma.client.players.count(),
      this.prisma.client.matches.count(),
      this.prisma.client.leagues.count(),
      this.prisma.client.committees.count(),
      this.prisma.client.championships.count({
        where: { level: "national" },
      }),
      this.prisma.client.championships.count({
        where: { level: "regional" },
      }),
      this.prisma.client.championships.count({
        where: { level: "departmental" },
      }),
    ]);

    return {
      clubs,
      teams,
      players,
      matches,
      leagues,
      committees,
      championshipsByLevel: {
        national: nationalChampionships,
        regional: regionalChampionships,
        departmental: departmentalChampionships,
      },
    } satisfies StatsResponseDto;
  }
}
