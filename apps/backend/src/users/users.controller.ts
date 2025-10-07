import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ProductionGuard } from '../common/guards/production.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  /**
   * HTTP POST /users
   * Create a new user.
   * 
   * @body createUserDTO Data Transfer Object containing the user details.
   * @returns 201 Created with the new user.
   * @returns 409 Conflict if the email is alredy taken.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * HTTP GET /users
   * Get all users.
   * 
   * Dev mode only.
   * 
   * @returns 200 Success with all users.
   * @returns 405 Method Not Allowed if is production.
   */
  @UseGuards(ProductionGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  /**
   * HTTP GET /users/:id
   * Retrieves a single user by ID.
   * 
   * Only the owner of the user can perform this action.
   * 
   * @param id The id of the user to retrieve
   * @returns 200 Succed with the user
   * @returns 404 Not found if doesn't exist
   */
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * HTTP PATCH /users/:id
   * Update an existing user.
   * 
   * Only the owner of the user can perform this action.
   * 
   * @param id The id of the user to update.
   * @param updateUserDto Data Transfer Object containing the fields to update.
   * @returns 200 OK with the updated user.
   * @returns 401 Unauthorized if the user is not authenticated.
   * @returns 403 Forbidden if the user authenticated is not the owner.
   */
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * HTTP DELETE /users/:id
   * Delete an existing user.
   * 
   * Only the owner of the user can perform this action.
   * 
   * @param id The id of the user to delete.
   * @returns 200 OK with a success message.
   * @returns 401 Unauthorized if the user is not authenticated.
   * @returns 403 Forbidden if the user authenticated is not the owner.
   */
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

}
