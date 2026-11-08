// src/backend/modules/organizations/committees/committees.service.ts
import { ffbbCommitteeUrl } from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import {
  CommitteeDetailResponseDto,
  CommitteeResponseDto,
} from "./dto/committees.response.dto";

/**
 * Fields to select from the committees table.
 * Single source of truth for consistent queries.
 */
const COMMITTEE_SELECT = {
  id: true,
  name: true,
  address: true,
  leagueId: true,
  departmentCode: true,
  departmentName: true,
  _count: { select: { clubs: true } },
  // One club is enough: its code carries the committee's FFBB code.
  clubs: {
    select: { code: true },
    where: { code: { not: null } },
    take: 1,
  },
} as const;

/**
 * Type representing the Prisma committee select result.
 * This matches exactly what Prisma returns from the select query.
 */
type CommitteeSelectResult = Prisma.CommitteesGetPayload<{
  select: typeof COMMITTEE_SELECT;
}>;

/**
 * Service handling business logic for committees.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class CommitteesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all departmental committees.
   * Returns all committees regardless of league.
   *
   * @returns Array of committee DTOs
   */
  async findAllCommittees(): Promise<CommitteeResponseDto[]> {
    const committees = await this.prisma.client.committees.findMany({
      select: COMMITTEE_SELECT,
      orderBy: [{ name: "asc" }],
    });

    return committees.map((c) => this.mapToDto(c));
  }

  /**
   * Finds all committees for a given league.
   *
   * @param leagueId - The league ID
   * @returns Array of committee DTOs
   */
  async findCommitteesByLeague(
    leagueId: number,
  ): Promise<CommitteeResponseDto[]> {
    const committees = await this.prisma.client.committees.findMany({
      where: {
        leagueId,
      },
      select: COMMITTEE_SELECT,
      orderBy: [{ name: "asc" }],
    });

    return committees.map((c) => this.mapToDto(c));
  }

  /**
   * Finds a committee by its ID, with every one of its clubs.
   *
   * @param committeeId - The committee ID
   * @returns The committee and its clubs, by name
   * @throws NotFoundException if committee doesn't exist
   */
  async findCommitteeById(
    committeeId: number,
  ): Promise<CommitteeDetailResponseDto> {
    const [committee, clubs] = await Promise.all([
      this.prisma.client.committees.findUnique({
        where: { id: committeeId },
        select: COMMITTEE_SELECT,
      }),
      this.prisma.client.clubs.findMany({
        where: { committeeId },
        select: { id: true, name: true },
        orderBy: [{ name: "asc" }, { id: "asc" }],
      }),
    ]);

    if (!committee) {
      throw new NotFoundException(`Committee with ID ${committeeId} not found`);
    }

    return { ...this.mapToDto(committee), clubs };
  }

  /**
   * Maps a Prisma committee entity to a response DTO.
   * Centralizes the mapping logic and handles null values.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param committee - Prisma committee select result
   * @returns CommitteeResponseDto
   */
  private mapToDto(committee: CommitteeSelectResult): CommitteeResponseDto {
    return {
      id: committee.id,
      name: committee.name,
      address: committee.address,
      leagueId: committee.leagueId,
      department: {
        name: committee.departmentName,
        code: committee.departmentCode,
      },
      clubCount: committee._count.clubs,
      ffbbUrl: ffbbCommitteeUrl(committee.clubs[0]?.code ?? null),
    } satisfies CommitteeResponseDto;
  }
}
