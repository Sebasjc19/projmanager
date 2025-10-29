import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from '../tasks/tasks.service';
import { UserResponseDto } from './dto/user.dto';
import { TaskResponseDto } from '../tasks/dto/task.dto';
import { ApiCommonErrors } from '../common/decorators/api-error-response.decorators';
import { ApiStandardResponse } from '../common/decorators/api-response.decorators';
import { UserProjectResponseDto } from '../usersprojects/dto/userproject.dto';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
/**
 * Users management controller.
 * Handles CRUD operations and task retrieval associated with users.
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
    private readonly usersProjectsService: UsersprojectsService
  ) { }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiStandardResponse(UserResponseDto, 'User created successfully', HttpStatus.CREATED)
  @ApiCommonErrors({ badRequest: true, conflict: true })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Retrieve all users', description: 'Available only in non-production environments for testing or seeding.' })
  @ApiStandardResponse(UserResponseDto, 'Users retrieved successfully')
  @ApiCommonErrors({ forbidden: true })
  @UseGuards(ProductionGuard)
  @Get()
  findAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a user by ID', description: 'Requires owner privileges.' })
  @ApiStandardResponse(UserResponseDto, 'User found')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id')
  findOneUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user', description: 'Requires owner privileges to modify user data.' })
  @ApiStandardResponse(UserResponseDto, 'User updated successfully')
  @ApiCommonErrors({ badRequest: true, unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto>  {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user', description: 'Requires owner privileges.' })
  @ApiStandardResponse(UserResponseDto, 'User deleted successfully')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
  //----------------------Task Relation----------------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all tasks assigned to a user', description: 'Requires owner privileges.' })
  @ApiStandardResponse(TaskResponseDto, 'Tasks found')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':userId/tasks')
  async findAllTasksByUser(@Param('userId') userId: string): Promise<TaskResponseDto[]> {
    return this.tasksService.findAllByUser(+userId);
  }
  //----------------------User-Project Relation----------------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects of a user', description: 'Requires owner privileges.' })
  @ApiStandardResponse(UserProjectResponseDto, 'Projects retrieved successfully')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':userId/projects')
  getUserProjects(@Param('userId') userId: string) {
    return this.usersProjectsService.findAllProjectsByUser(+userId);
  }
}
