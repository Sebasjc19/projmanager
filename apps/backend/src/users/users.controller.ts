import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { ApiOperation, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiUnauthorizedResponse, ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @ApiOperation({
    summary: 'Create a new user'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User details to create'
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: User
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data'
  })
  @ApiConflictResponse({
    description: 'Data already exist'
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Retrieve all users (development mode only)',
    description: 'Available only in non-production environments for testing or seeding.',
  })
  @ApiOkResponse({
    description: 'List of all users returned successfully',
    type: [User]
  })
  @ApiForbiddenResponse({
    description: 'Not allowed in production environment'
  })
  @UseGuards(ProductionGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a user by ID',
    description: 'Only the owner of the user can access this endpoint.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID of the user to retrieve'
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: User
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid'
  })
  @ApiForbiddenResponse({
    description: 'User is not the owner'
  })
  @ApiNotFoundResponse({
    description: 'User not found with the given ID'
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an existing user',
    description: 'Only the owner of the user can update their data',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID of the user to update'
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update for the user'
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: User
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data'
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid'
  })
  @ApiForbiddenResponse({
    description: 'User is not the owner'
  })
  @ApiNotFoundResponse({
    description: 'User not found with the given ID'
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User>  {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an existing user',
    description: 'Only the owner of the user can delete their account',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID of the user to delete'
  })
  @ApiOkResponse({
    description: 'User deleted successfully'
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid'
  })
  @ApiForbiddenResponse({
    description: 'User is not the owner'
  })
  @ApiNotFoundResponse({
    description: 'User not found with the given ID'
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }

}
