import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { Project } from './entities/project.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new project'
  })
  @ApiBody({ 
    type: CreateProjectDto,
    description: 'Project data to create' 
  })
  @ApiCreatedResponse({
    description: 'Project successfully created.',
    type: Project,
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data.' 
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @GetUser('userid') ownerId: number): Promise<Project> {
    return this.projectsService.create(createProjectDto, ownerId);
  }

  @ApiOperation({
    summary: 'Retrieve all projects (development mode only)',
    description:
      'Available only in non-production environments for testing or seeding.',
  })
  @ApiOkResponse({
    description: 'List of all projects returned successfully.',
    type: [Project],
  })
  @ApiForbiddenResponse({
    description: 'Not allowed in production environment.',
  })
  @UseGuards(ProductionGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a project by ID',
    description:
      'Requires the user to be a project member. Returns detailed project info.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the project to retrieve.',
  })
  @ApiOkResponse({
    description: 'Project found and returned successfully.',
    type: Project,
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a project member.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found with the given ID.',
  })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a project',
    description: 'Requires owner or admin access to modify project data.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the project to update.',
  })
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Fields to update in the project.',
  })
  @ApiOkResponse({
    description: 'Project updated successfully.',
    type: Project,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized — JWT token missing or invalid.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden — user is not owner or admin of the project.',
  })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Patch(':projectId')
  update(@Param('projectId') projectId: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(projectId, updateProjectDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Requires project owner privileges.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the project to delete.',
  })
  @ApiOkResponse({
    description: 'Project successfully deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.',
  })
  @ApiForbiddenResponse({
    description: 'User is not the project owner.',
  })
  @UseGuards(JwtAuthGuard, ProjectOwnerGuard)
  @Delete(':projectId')
  remove(@Param('projectId') id: string) {
    return this.projectsService.remove(+id);
  }
}
