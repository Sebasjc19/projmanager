import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectAdminGuard } from '../projects/guards/project-admin.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonErrors } from '../common/decorators/api-error-response.decorators';
import { ApiStandardResponse } from '../common/decorators/api-response.decorators';
import { UserProjectResponseDto } from './dto/userproject.dto';
/**
 * User-Project relationships management controller.
 * Handles CRUD operations for user roles in projects.
 */
@ApiTags('UserProjects')
@Controller('usersprojects')
export class UsersprojectsController {
  constructor(private readonly usersprojectsService: UsersprojectsService) { }

  @ApiOperation({ summary: 'Retrieve all user-project relationships', description: 'Available only in non-production environments for testing or seeding.' })
  @ApiStandardResponse(UserProjectResponseDto, 'Relationships retrieved successfully')
  @ApiCommonErrors({ forbidden: true })
  @UseGuards(ProductionGuard)
  @Get()
  findAll() {
    return this.usersprojectsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a user-project relationship by ID' })
  @ApiStandardResponse(UserProjectResponseDto, 'Relationship found')
  @ApiCommonErrors({ unauthorized: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProductionGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersprojectsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a specific user-project relationship', description: 'Requires be part of the project.' })
  @ApiStandardResponse(UserProjectResponseDto, 'Relationship found')
  @ApiCommonErrors({ unauthorized: true, forbidden: true, notFound: true })
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  @Get('user/:userId/project/:projectId')
  findByUserAndProject(@Param('userId') userId: string, @Param('projectId') projectId: string) {
    return this.usersprojectsService.findByUserAndProject(+userId, +projectId);
  }

}
