import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { projectStatus } from '../enums/project-status.enum';

/**
 * Basic project response without related entities.
 * Use specific endpoints to fetch users and tasks.
 */
export class ProjectResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Project Phoenix' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'AI-powered analytics' })
  @Expose()
  description: string;

  @ApiProperty({ example: '2025-10-15' })
  @Expose()
  startDate: string;

  @ApiProperty({ example: '2026-03-31' })
  @Expose()
  endDate: string;

  @ApiProperty({ example: projectStatus.PLANNED })
  @Expose()
  status: string;

}
