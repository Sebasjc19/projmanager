import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { ApiStandardResponse } from '../common/decorators/api-response.decorators';
import { ProjectResponseDto } from './dto/project.dto';
import { ApiCommonErrors } from '../common/decorators/api-error-response.decorators';
import { TaskResponseDto } from '../tasks/dto/task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { CreateUsersprojectDto } from '../usersprojects/dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from '../usersprojects/dto/update-usersproject.dto';
import { UserProjectResponseDto } from '../usersprojects/dto/userproject.dto';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
/**
 * Projects management controller.
 * Handles CRUD operations and task management associated with projects.
 */
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
    private readonly usersProjectsService: UsersprojectsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiStandardResponse(
    ProjectResponseDto,
    'Project created successfully',
    HttpStatus.CREATED,
  )
  @ApiCommonErrors({ badRequest: true, unauthorized: true })
  @UseGuards(JwtAuthGuard)
  createProject(
    @GetUser('userid') ownerId: string,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto, +ownerId);
  }

  @ApiOperation({
    summary: 'Retrieve all projects',
    description:
      'Available only in non-production environments for testing or seeding.',
  })
  @ApiStandardResponse(ProjectResponseDto, 'Projects retrieved successfully')
  @ApiCommonErrors({ unauthorized: true })
  @UseGuards(ProductionGuard)
  @Get()
  findAllProjects(): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a project by ID',
    description: 'Requires be part of the project.',
  })
  @ApiStandardResponse(ProjectResponseDto, 'Project found')
  @ApiCommonErrors({ unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get(':projectId')
  findOneProject(
    @Param('projectId') projectId: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(+projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a project',
    description: 'Requires owner or admin access to modify project data.',
  })
  @ApiStandardResponse(ProjectResponseDto, 'Project updated successfully')
  @ApiCommonErrors({ badRequest: true, unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Patch(':projectId')
  updateProject(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(+projectId, updateProjectDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Requires project owner privileges.',
  })
  @ApiStandardResponse(ProjectResponseDto, 'Project deleted successfully')
  @ApiCommonErrors({ unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectOwnerGuard)
  @Delete(':projectId')
  removeProject(@Param('projectId') projectId: string) {
    return this.projectsService.remove(+projectId);
  }
  //----------------------Task Relation----------------------
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new project task',
    description: 'Requires project admin privileges.',
  })
  @ApiStandardResponse(
    TaskResponseDto,
    'Task created successfully',
    HttpStatus.CREATED,
  )
  @ApiCommonErrors({ badRequest: true, unauthorized: true })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Post(':projectId/tasks')
  async createTask(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(+projectId, createTaskDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a task by ID',
    description: 'Requires be part of the project.',
  })
  @ApiStandardResponse(TaskResponseDto, 'Task found')
  @ApiCommonErrors({ unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get(':projectId/tasks/:taskId')
  findOneTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findOne(+projectId, +taskId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all project task ',
    description: 'Requires be part of the project.',
  })
  @ApiStandardResponse(TaskResponseDto, 'Tasks found')
  @ApiCommonErrors({ unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get(':projectId/tasks')
  async getProjectTasks(
    @Param('projectId') projectId: string,
  ): Promise<TaskResponseDto[]> {
    return this.tasksService.findAllByProject(+projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a task',
    description: 'Requires owner or admin access to modify task data.',
  })
  @ApiStandardResponse(TaskResponseDto, 'Task updated successfully')
  @ApiCommonErrors({ badRequest: true, unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Patch(':projectId/tasks/:taskId')
  updateTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(+projectId, +taskId, updateTaskDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Requires project admin privileges.',
  })
  @ApiStandardResponse(TaskResponseDto, 'Task deleted successfully')
  @ApiCommonErrors({ unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Delete(':projectId/tasks/:taskId')
  removeTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ): Promise<void> {
    return this.tasksService.remove(+projectId, +taskId);
  }
  //----------------------User-Project Relation----------------------
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add user to project',
    description: 'Requires project admin privileges.',
  })
  @ApiStandardResponse(
    UserProjectResponseDto,
    'User added successfully',
    HttpStatus.CREATED,
  )
  @ApiCommonErrors({ badRequest: true, unauthorized: true, forbidden: true })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Post(':projectId/users')
  addUserToProject(
    @Param('projectId') projectId: string,
    @Body() createUsersprojectDto: CreateUsersprojectDto,
  ) {
    return this.usersProjectsService.create(createUsersprojectDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users in project',
    description: 'Requires be part of the project.',
  })
  @ApiStandardResponse(UserProjectResponseDto, 'Users retrieved successfully')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get(':projectId/users')
  getProjectUsers(@Param('projectId') projectId: string) {
    return this.usersProjectsService.findAllUsersByProject(+projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user role in project',
    description: 'Requires project admin privileges.',
  })
  @ApiStandardResponse(UserProjectResponseDto, 'Role updated successfully')
  @ApiCommonErrors({
    badRequest: true,
    unauthorized: true,
    forbidden: true,
    notFound: true,
  })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Patch(':projectId/users/:userId')
  updateUserRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() updateUsersprojectDto: UpdateUsersprojectDto,
  ) {
    return this.usersProjectsService.update(
      +projectId,
      +userId,
      updateUsersprojectDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove user from project',
    description: 'Requires project admin privileges.',
  })
  @ApiStandardResponse(UserProjectResponseDto, 'User removed successfully')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Delete(':projectId/users/:userId')
  removeUserFromProject(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.usersProjectsService.removeByProjectAndUser(
      +projectId,
      +userId,
    );
  }
}
