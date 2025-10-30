import { Controller, Get, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiStandardResponse } from '../common/decorators/api-response.decorators';
import { TaskResponseDto } from './dto/task.dto';
import { ApiCommonErrors } from '../common/decorators/api-error-response.decorators';
import { ProductionGuard } from '../common/guards/production.guard';
/**
 * Basic Task management controller.
 * Handles find, update and delete operations.
 */
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all tasks',
    description:
      'Available only in non-production environments for testing or seeding.',
  })
  @ApiStandardResponse(TaskResponseDto, 'Tasks retrieved successfully')
  @ApiCommonErrors({ unauthorized: true })
  @UseGuards(ProductionGuard)
  findAll() {
    return this.tasksService.findAll();
  }
}
