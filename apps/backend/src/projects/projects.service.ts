import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
import { UserRole } from '../usersprojects/enums/user-role.enum';
import { ProjectResponseDto } from './dto/project.dto';

/**
 * Service responsible for managing projects.
 * Handles CRUD operations and returns standardized DTOs.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @Inject(forwardRef(() => UsersprojectsService))
    private readonly usersProjectsService: UsersprojectsService,
  ) { }

  /**
   * Creates a new project and assigns an owner.
   *
   * @param createProjectDto Project data including title, description, and dates
   * @param ownerId ID of the user who will own the project
   */
  async create(createProjectDto: CreateProjectDto, ownerId: number,): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.create(createProjectDto);
    const savedProject = await this.projectRepository.save(project)
    await this.usersProjectsService.create({
      userId: ownerId,
      projectId: savedProject.id,
      role: UserRole.OWNER,
    });
    return this.toResponseDto(savedProject);
  }

  /**
   * Retrieves all projects.
   */
  async findAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository.find();

    return projects.map(project => this.toResponseDto(project));
  }

  /**
   * Retrieves a single project by ID.
   * 
   * @param projectId Project ID
   */
  async findOne(projectId: number): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['tasks']
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return this.toResponseDto(project);
  }

  /**
   * Updates an existing project.
   * 
   * @param projectId Project ID to update
   * @param updateProjectDto Updated project data
   */
  async update(projectId: number, updateProjectDto: UpdateProjectDto,): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['tasks']
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    Object.assign(project, updateProjectDto);
    const updatedProject = await this.projectRepository.save(project);
    return this.toResponseDto(updatedProject);
  }

  /**
   * Deletes a project by ID.
   * 
   * @param id Project ID to delete
   */
  async remove(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }
    await this.projectRepository.remove(project);
  }

  /**
   * Maps a Project entity to a ProjectResponseDto.
   */
  private toResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      startDate: project.startDate?.toISOString().split('T')[0],
      endDate: project.endDate?.toISOString().split('T')[0],
      status: project.status
    };
  }
}
