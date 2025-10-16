import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
import { UserRole } from '../usersprojects/enums/user-role.enum';

/**
 * Service responsible for managing application projects.
 * 
 * Provides methods to create, retrieve, update, and delete project entities.
 * 
 * This service interacts directly with the database through the Project repository
 * and ensures proper exception handling for common scenarios such as missing records.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @Inject(forwardRef(() => UsersprojectsService))
    private readonly usersProjectsService: UsersprojectsService,
  ) {}

  /**
   * Creates a new project and assigns the owner.
   *
   * @param createProjectDto - Data Transfer Object containing project details.
   * @param ownerId - The ID of the user who will be set as the project owner.
   * @returns The created Project entity.
   */
  async create(createProjectDto: CreateProjectDto, ownerId: number,): Promise<Project> {
    const project = await this.projectRepository.save({
      title: createProjectDto.title,
      description: createProjectDto.description,
      startDate: createProjectDto.startDate,
      endDate: createProjectDto.endDate,
    });
    await this.usersProjectsService.create({
      userId: ownerId,
      projectId: project.id,
      role: UserRole.OWNER,
    });
    return project;
  }
  
  /**
   * Retrieves all projects with their associated user projects and tasks.
   * 
   * @returns An array of all Project entities, including their associated user projects and tasks.
   */
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['tasks'],
    });
  }
  
  /**
   * Retrieves a single project by its ID, including its associated user projects and tasks.
   * 
   * @param id - The ID of the project to retrieve.
   * @returns The Project entity with the specified ID, including its associated user projects and tasks.
   * @throws Error if the project with the specified ID is not found.
   */
  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['tasks',]
     });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  /**
   * Updates an existing project with new details.
   * 
   * @param id - The ID of the project to update. 
   * @param updateProjectDto - Data Transfer Object containing updated project details.
   * @returns - The updated Project entity.
   * @throws Error if the project with the specified ID is not found.
   */
  async update(id: number, updateProjectDto: UpdateProjectDto,): Promise<Project> {
    await this.projectRepository.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  /**
   * Removes a project by its ID.
   * 
   * @param id - The ID of the project to remove.
   */
  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    if(!project){
      throw new NotFoundException(`Project with ${id} not found`);
    }
    await this.projectRepository.remove(project);
  }
}
