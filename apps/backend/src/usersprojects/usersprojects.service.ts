import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';
import { UserProject } from './entities/usersproject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

/**
 * Service responsible for managing the relationship between Users and Projects.
 * 
 * Handles CRUD operations for the UserProject entity, which represents the association
 * of a user participating in a specific project with a given role.
 */
@Injectable()
export class UsersprojectsService {

  constructor(
      @InjectRepository(UserProject)
      private readonly userProjectRepository: Repository<UserProject>,

      @Inject(forwardRef(()=> ProjectsService))
      private readonly projectsService: ProjectsService,
      private readonly usersService: UsersService
    ) {}

  /**
   * Creates a new user-project relationship.
   * 
   * @param createUsersprojectDto Data Transfer Object containing the userId, projectId, and role.
   * @returns The created UserProject entity.
   * @throws {NotFoundException} If the specified user or project does not exist.
   */
  async create(createUsersprojectDto: CreateUsersprojectDto) {
    const user = await this.usersService.findOne(createUsersprojectDto.userId);
    const project = await this.projectsService.findOne(createUsersprojectDto.projectId);

    const userProject = this.userProjectRepository.create({
      user: user,
      project: project,
      role: createUsersprojectDto.role
    })

    return await this.userProjectRepository.save(userProject);

  }

   /**
   * Retrieves all user-project relationships.
   * 
   * @experimental This method is for testing and debugging purposes.
   * @returns A list of all UserProject entities.
   */
  async findAll() {
    return await this.userProjectRepository.find({
      relations: ['user', 'project' ]
    });
  }

  /**
   * Retrieves all projects associated with a specific user.
   * 
   * @param userId The ID of the user whose projects should be retrieved.
   * @returns A list of UserProject entities linked to the user.
   * @throws {NotFoundException} If the user has no associated projects.
   */
  async findAllProjectsByUser(userId: number) {
    const usersProjects = await this.userProjectRepository.find({
      where:
        {user: {id: userId}},
    });
    if (!usersProjects.length){
      throw new NotFoundException(`Projects with User ID ${userId} not found`)
    }
    return usersProjects;
  }
  
  /**
   * Retrieves all users associated with a specific project.
   * 
   * @param projectId The ID of the project whose users should be retrieved.
   * @returns A list of UserProject entities linked to the project.
   * @throws {NotFoundException} If the project has no associated users.
   */
  async findAllUsersByProject(projectId: number) {
    const usersProjects = await this.userProjectRepository.find({
      where:
        {project: {id: projectId}},
    });
    if (!usersProjects.length){
      throw new NotFoundException(`Users with Project ID ${projectId} not found`)
    }
    return usersProjects;
  }

  /**
   * Retrieves the relationship between a specific user and project.
   * 
   * @param userId The ID of the user.
   * @param projectId The ID of the project.
   * @returns The UserProject entity if found.
   * @throws {NotFoundException} If no relationship exists between the given user and project.
   */
  async findByUserAndProject(userId: number, projectId: number) {
    const userProject = await this.userProjectRepository.findOne({
      where: {
        user: {id: userId}, 
        project: {id: projectId}, 
      }
    });
    if (!userProject){
      throw new NotFoundException(`Not found relation between user and project`)
    }
    return userProject;
  }

  /**
   * Retrieves a UserProject relationship by its ID.
   * 
   * @param id The ID of the UserProject to retrieve.
   * @returns The UserProject entity.
   * @throws {NotFoundException} If the UserProject with the specified ID is not found.
   */
  async findOne(id: number) {
    const userProject = await this.userProjectRepository.findOneBy({id});
    if(!userProject){
      throw new NotFoundException(`User project with ID ${id} not found`);
    }
    return userProject;
  }

  /**
   * Updates an existing UserProject relationship.
   * 
   * @param id The ID of the UserProject to update.
   * @param updateUsersprojectDto Data Transfer Object containing the updated fields.
   * @returns The updated UserProject entity.
   */
  async update(id: number, updateUsersprojectDto: UpdateUsersprojectDto) {
    await this.userProjectRepository.update(id,{
      user: {id: updateUsersprojectDto.userId},
      project: {id: updateUsersprojectDto.projectId},
      role: updateUsersprojectDto.role
    });
    return await this.findOne(id);
  }

  /**
   * Deletes a UserProject relationship by its ID.
   * 
   * @param id The ID of the UserProject to delete.
   * @throws {NotFoundException} If the UserProject with the specified ID does not exist.
   */
  async remove(id: number): Promise<void> {
    const userProject = await this.findOne(id);
    if(!userProject){
      throw new NotFoundException(`User project with ${id} not found`);
    }
    await this.userProjectRepository.remove(userProject);
  }

}
