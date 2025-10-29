import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';
import { UserProject } from './entities/usersproject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { UserProjectResponseDto } from './dto/userproject.dto';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
/**
 * Service for managing user-project relationships.
 * Handles CRUD operations for user roles in projects.
 */
@Injectable()
export class UsersprojectsService {

  constructor(
    @InjectRepository(UserProject)
    private readonly userProjectRepository: Repository<UserProject>,

    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService
  ) { }

  /**
  * Creates a new user-project relationship.
  * 
  * @param createUsersprojectDto Relationship data including userId, projectId, and role
  */
  async create(createUsersprojectDto: CreateUsersprojectDto): Promise<UserProjectResponseDto> {
    const user = await this.usersService.findOne(createUsersprojectDto.userId);
    const project = await this.projectsService.findOne(createUsersprojectDto.projectId);

    const userProject = this.userProjectRepository.create({
      user: { id: createUsersprojectDto.userId } as User,
      project: { id: createUsersprojectDto.projectId } as Project,
      role: createUsersprojectDto.role
    })

    const savedUserProject = await this.userProjectRepository.save(userProject);
    const userProjectWithRelations = await this.userProjectRepository.findOne({
      where: { id: savedUserProject.id },
      relations: ['user', 'project']
    });
    if (!userProjectWithRelations) {
      throw new NotFoundException(`User-Project relation with ID ${savedUserProject.id} not found after creation`);
    }
    return this.toResponseDto(userProjectWithRelations);

  }

  /**
  * Retrieves all user-project relationships.
  */
  async findAll(): Promise<UserProjectResponseDto[]> {
    const userProject = await this.userProjectRepository.find({
      relations: ['user', 'project']
    });
    return userProject.map(userProject => this.toResponseDto(userProject))
  }

  /**
   * Retrieves all projects associated with a user.
   * 
   * @param userId User ID
   */
  async findAllProjectsByUser(userId: number): Promise<UserProjectResponseDto[]> {
    const usersProjects = await this.userProjectRepository.find({
      where:
        { user: { id: userId } },
      relations: ['user', 'project']
    });
    if (!usersProjects.length) {
      return [];
    }
    return usersProjects.map(userProject => this.toResponseDto(userProject));
  }

  /**
   * Retrieves all users associated with a project.
   * 
   * @param projectId Project ID
   */
  async findAllUsersByProject(projectId: number): Promise<UserProjectResponseDto[]> {
    const usersProjects = await this.userProjectRepository.find({
      where:
        { project: { id: projectId } },
      relations: ['user', 'project']
    });
    if (!usersProjects.length) {
      return [];
    }
    return usersProjects.map(userProject => this.toResponseDto(userProject));
  }

  /**
   * Retrieves the relationship between a user and project.
   * 
   * @param userId User ID
   * @param projectId Project ID
   */
  async findByUserAndProject(userId: number, projectId: number): Promise<UserProjectResponseDto> {
    const userProject = await this.userProjectRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
      relations: ['user', 'project']
    });
    if (!userProject) {
      throw new NotFoundException(`Relation between user ${userId} and project ${projectId} not found`);
    }
    return this.toResponseDto(userProject);
  }

  /**
   * Retrieves a user-project relationship by ID.
   * 
   * @param id Relation ID
   */
  async findOne(id: number): Promise<UserProjectResponseDto> {
    const userProject = await this.userProjectRepository.findOne({
      where: { id },
      relations: ['user', 'project']
    });
    if (!userProject) {
      throw new NotFoundException(`User-Project relation with ID ${id} not found`);
    }
    return this.toResponseDto(userProject);
  }

  /**
   * Updates the role of a user in a project.
   * 
   * @param projectId Project ID
   * @param userId User ID
   * @param updateUsersprojectDto Update data
   */
  async update(projectId: number, userId: number, updateUsersprojectDto: UpdateUsersprojectDto): Promise<UserProjectResponseDto> {
    const userProject = await this.userProjectRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: userId }
      },
      relations: ['user', 'project']
    });

    if (!userProject) {
      throw new NotFoundException(
        `User ${userId} not found in project ${projectId}`
      );
    }

    userProject.role = updateUsersprojectDto.role;
    const savedUserProject = await this.userProjectRepository.save(userProject);
    return this.toResponseDto(savedUserProject);
  }

  /**
   * Removes a user-project relationship by ID.
   * 
   * @param id Relation ID
   */
  async remove(id: number): Promise<void> {
    const userProject = await this.userProjectRepository.findOne({ where: { id } });
    if (!userProject) {
      throw new NotFoundException(`User-Project relation with ID ${id} not found`);
    }
    await this.userProjectRepository.remove(userProject);
  }

  /**
   * Maps a UserProject entity to a UserProjectResponseDto.
   */
  private toResponseDto(userProject: UserProject): UserProjectResponseDto {
    if (!userProject.user || !userProject.project) {
      throw new Error('UserProject must have user and project relations loaded');
    }
    return {
      user: userProject.user.id,
      project: userProject.project.id,
      role: userProject.role
    };
  }
}
