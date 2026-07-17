// src/backend/modules/organizations/committees/committees.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import { CommitteeResponseDto } from "./dto/committees.response.dto";

/**
 * Fields to select from the committees table.
 * Single source of truth for consistent queries.
 */
const COMMITTEE_SELECT = {
  id: true,
  name: true,
  phone: true,
  email: true,
  address: true,
  leagueId: true,
  president: {
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,
      code: true,
    },
  },
  department: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  _count: { select: { clubs: true } },
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

    if (committees.length === 0) {
      throw new NotFoundException(
        `No committees found for league ID ${leagueId}`,
      );
    }

    return committees.map((c) => this.mapToDto(c));
  }

  /**
   * Finds a committee by its ID.
   *
   * @param committeeId - The committee ID
   * @returns Committee DTO
   * @throws NotFoundException if committee doesn't exist
   */
  async findCommitteeById(committeeId: number): Promise<CommitteeResponseDto> {
    const committee = await this.prisma.client.committees.findUnique({
      where: { id: committeeId },
      select: COMMITTEE_SELECT,
    });

    if (!committee) {
      throw new NotFoundException(`Committee with ID ${committeeId} not found`);
    }

    return this.mapToDto(committee);
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
      phone: committee.phone,
      email: committee.email,
      address: committee.address,
      president: committee.president,
      leagueId: committee.leagueId,
      department: {
        id: committee.department.id,
        name: committee.department.name,
        code: committee.department.code,
      },
      clubCount: committee._count.clubs,
    } satisfies CommitteeResponseDto;
  }
}
