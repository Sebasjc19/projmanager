import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class ProjectsService {

  constructor(
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
      private readonly usersProjectsService: UsersprojectsService
    ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = await this.projectRepository.save({
      title: createProjectDto.title,
      description: createProjectDto.description,
      startDate: createProjectDto.startDate,
      endDate: createProjectDto.endDate
    });
    await this.usersProjectsService.create({userId: createProjectDto.ownerId, projectId: project.id, role: UserRole.OWNER});
    return project;
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({relations: ['userProjects', 'tasks']});
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({where: {id}, relations: ['userProjects', 'tasks']});
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
    
  }
}
