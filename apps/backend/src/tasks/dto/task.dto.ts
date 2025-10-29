import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TaskState } from '../enums/task-state.enum';

/**
 * Basic task response without related entities.
 * Use specific endpoints to fetch users and tasks.
 */
export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Implement user authentication' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Create login and registration endpoints with JWT' })
  @Expose()
  description: string;

  @ApiProperty({ example: TaskState.TODO })
  @Expose()
  state: TaskState;

  @ApiProperty({ example: '2025-10-15' })
  @Expose()
  startDate: string;

  @ApiProperty({ example: '2026-03-31' })
  @Expose()
  endDate: string;

  @ApiProperty({ example: 1})
  @Expose()
  projectId: number;

  @ApiProperty({ example: [1,2,3,4] })
  @Expose()
  assignedUsers: number[];
}
