import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';

@Controller('usersprojects')
export class UsersprojectsController {
  constructor(private readonly usersprojectsService: UsersprojectsService) {}

  @Post()
  create(@Body() createUsersprojectDto: CreateUsersprojectDto) {
    return this.usersprojectsService.create(createUsersprojectDto);
  }

  @Get()
  findAll() {
    return this.usersprojectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersprojectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersprojectDto: UpdateUsersprojectDto) {
    return this.usersprojectsService.update(+id, updateUsersprojectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersprojectsService.remove(+id);
  }
}
