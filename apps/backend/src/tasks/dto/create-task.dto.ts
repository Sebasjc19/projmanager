import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskState } from '../enums/task-state.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
/**
 * DTO for creating a new task.
 * Contains all required fields to initialize a task with dates and description.
 */
export class CreateTaskDto {
  /** Task title */
  @ApiProperty({
    example: 'Task 1',
    description: 'The description of the task.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Brief description of the task */
  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Create login and registration endpoints with JWT authentication',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Current state of the task.
   * Defaults to TODO if not specified.
   */
  @ApiPropertyOptional({
    description: 'Current state of the task',
    enum: TaskState,
    default: TaskState.TODO,
    example: TaskState.TODO,
  })
  @IsEnum(TaskState)
  @IsOptional()
  state?: TaskState;

  /** Task start date in ISO 8601 format (YYYY-MM-DD) */
  @ApiProperty({
    example: '2025-10-15',
    description: 'The start date of the task in ISO 8601 format (YYYY-MM-DD).',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  /** Task end date in ISO 8601 format (YYYY-MM-DD) */
  @ApiProperty({
    example: '2025-12-22',
    description: 'The end date of the task in ISO 8601 format (YYYY-MM-DD).',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  /** List of users assigned to the task */
  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Array of user IDs to assign to this task',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assignedUserIds?: number[];
}
