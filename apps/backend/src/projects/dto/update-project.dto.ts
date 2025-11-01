import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
/**
 * DTO for updating an existing project.
 * All fields are optional - only provided fields will be updated.
 */
export class UpdateProjectDto {
  /** Updated project title */
  @ApiPropertyOptional({
    example: 'Updated Project Title',
    description: 'The new title of the project. Optional field.',
  })
  @IsOptional()
  @IsString()
  title?: string;

  /** Updated project description */
  @ApiPropertyOptional({
    example:
      'An updated description with more context about the project goals.',
    description:
      'A new or updated description for the project. Optional field.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /** Updated start date in ISO 8601 format (YYYY-MM-DD) */
  @ApiPropertyOptional({
    example: '2025-11-01',
    description:
      'New start date of the project in ISO 8601 format. Optional field.',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /** Updated end date in ISO 8601 format (YYYY-MM-DD) */
  @ApiPropertyOptional({
    example: '2026-06-30',
    description:
      'New end date of the project in ISO 8601 format. Optional field.',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
