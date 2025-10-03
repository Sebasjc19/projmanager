import { Injectable } from '@nestjs/common';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';
import { UserProject } from './entities/usersproject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UsersprojectsService {

  constructor(
      @InjectRepository(UserProject)
      private readonly userRepository: Repository<UserProject>,
    ) {}

  //Basic CRUD methods
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

  //Project methods
  findByUserAndProject(userId: number, projectId: number) {
    return `This action returns the userproject of user #${userId} in project #${projectId}`;
  }

  findAllProjectsByUser(userId: number) {
    return `This action returns all projects of user #${userId}`;
  }
  
  findAllUsersByProject(projectId: number) {
    return `This action returns all users of project #${projectId}`;
  }
}
