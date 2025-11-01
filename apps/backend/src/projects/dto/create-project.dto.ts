import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
/**
 * DTO for creating a new project.
 * Contains all required fields to initialize a project with dates and description.
 */
export class CreateProjectDto {
  /** Project title or name */
  @ApiProperty({
    example: 'Project Phoenix',
    description: 'The title or name of the project.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Brief description of the project purpose and goals */
  @ApiProperty({
    example: 'A new AI-powered analytics dashboard for internal use.',
    description:
      'A short description explaining the purpose or details of the project.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Project start date in ISO 8601 format (YYYY-MM-DD) */
  @ApiProperty({
    example: '2025-10-15',
    description:
      'The start date of the project in ISO 8601 format (YYYY-MM-DD).',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  /** Project end date in ISO 8601 format (YYYY-MM-DD) */
  @ApiProperty({
    example: '2026-03-31',
    description: 'The end date of the project in ISO 8601 format (YYYY-MM-DD).',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
