import { Injectable } from '@nestjs/common';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';

@Injectable()
export class UsersprojectsService {
  create(createUsersprojectDto: CreateUsersprojectDto) {
    return 'This action adds a new usersproject';
  }

  findAll() {
    return `This action returns all usersprojects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersproject`;
  }

  update(id: number, updateUsersprojectDto: UpdateUsersprojectDto) {
    return `This action updates a #${id} usersproject`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersproject`;
  }
}
