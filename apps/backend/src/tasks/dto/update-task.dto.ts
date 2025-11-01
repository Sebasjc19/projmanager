import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
/**
 * Data Transfer Object for updating an existing task.
 * All fields from CreateTaskDto are optional.
 * Inherits all properties from CreateTaskDto but makes them optional.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
