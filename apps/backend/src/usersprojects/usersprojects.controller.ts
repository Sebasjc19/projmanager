import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectAdminGuard } from '../projects/guards/project-admin.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserProject } from './entities/usersproject.entity';

@ApiTags('UserProjects')
@Controller('usersprojects')
export class UsersprojectsController {
  constructor(private readonly usersprojectsService: UsersprojectsService) { }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new user-project relationship'
  })
  @ApiBody({
    type: CreateUsersprojectDto,
    description: 'UserProject data to create'
  })
  @ApiCreatedResponse({
    description: 'UserProject successfully created',
    type: UserProject
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.'
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @ApiForbiddenResponse({
    description: 'User is not allowed to create a relation for this project.'
  })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Post()
  create(@Body() createUsersprojectDto: CreateUsersprojectDto) {
    return this.usersprojectsService.create(createUsersprojectDto);
  }

  @ApiOperation({
    summary: 'Retrieve all user-project relationships (development only)'
  })
  @ApiOkResponse({
    description: 'List of all UserProject relationships returned.',
    type: [UserProject]
  })
  @ApiForbiddenResponse({
    description: 'Not allowed in production environment.'
  })
  @UseGuards(ProductionGuard)
  @Get()
  findAll() {
    return this.usersprojectsService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve a UserProject relationship by ID'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the UserProject to retrieve'
  })
  @ApiOkResponse({
    description: 'UserProject found and returned',
    type: UserProject
  })
  @ApiNotFoundResponse({
    description: 'UserProject not found with the given ID'
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @UseGuards(ProductionGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersprojectsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all projects of a specific user'
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    example: 1,
    description: 'ID of the user'
  })
  @ApiOkResponse({
    description: 'List of projects for the user returned',
    type: [UserProject]
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @ApiForbiddenResponse({
    description: 'User not authorized to view these projects.'
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get('user/:id/projects')
  async findAllProjectsByUser(@Param('id') userId: number) {
    return this.usersprojectsService.findAllProjectsByUser(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all users of a specific project'
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    example: 1,
    description: 'ID of the project'
  })
  @ApiOkResponse({
    description: 'List of users for the project returned',
    type: [UserProject]
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @ApiForbiddenResponse({
    description: 'User not a member of the project.'
  })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get('project/:id/users')
  async findAllUsersByProject(@Param('id', ParseIntPipe) projectId: number) {
    return this.usersprojectsService.findAllUsersByProject(projectId);
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a specific user-project relationship'
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    example: 1,
    description: 'ID of the user'
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    example: 1,
    description: 'ID of the project'
  })
  @ApiOkResponse({
    description: 'UserProject relationship returned',
    type: UserProject
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @ApiForbiddenResponse({
    description: 'User not a member of the project.'
  })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get('user/:userId/project/:projectId')
  async findByUserAndProject(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('projectId', ParseIntPipe) projectId: number
  ) {
    return this.usersprojectsService.findByUserAndProject(userId, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a user-project relationship'
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    example: 1,
    description: 'ID of the UserProject to update'
  })
  @ApiBody({
    type: UpdateUsersprojectDto,
    description: 'Fields to update in the UserProject'
  })
  @ApiOkResponse({
    description: 'UserProject updated successfully',
    type: UserProject
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @ApiForbiddenResponse({
    description: 'User not allowed to update this relationship.'
  })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Patch(':projectId')
  update(@Param('projectId') projectId: number, @Body() updateUsersprojectDto: UpdateUsersprojectDto) {
    return this.usersprojectsService.update(projectId, updateUsersprojectDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user-project relationship'
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    example: 1,
    description: 'ID of the UserProject to delete'
  })
  @ApiOkResponse({
    description: 'UserProject deleted successfully'
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid.'
  })
  @ApiForbiddenResponse({
    description: 'User not allowed to delete this relationship.'
  })
  @UseGuards(JwtAuthGuard, ProjectAdminGuard)
  @Delete(':projectId')
  remove(@Param('projectId') id: string) {
    return this.usersprojectsService.remove(+id);
  }
}
