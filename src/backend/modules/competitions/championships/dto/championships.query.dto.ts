// src/backend/modules/competitions/championships/dto/championships.query.dto.ts
import { CompetitionLevel } from "@common/constants";
import { Category, Gender, PaginationQueryDto } from "@common/index";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

export class GetChampionshipsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: CompetitionLevel })
  @IsOptional()
  @IsEnum(CompetitionLevel)
  level?: CompetitionLevel;

  @ApiPropertyOptional({
    type: Number,
    description: "League ID (regional) or Committee ID (departmental)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ enum: Category })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
