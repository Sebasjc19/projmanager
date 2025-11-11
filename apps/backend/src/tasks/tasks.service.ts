import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { Project } from 'src/projects/entities/project.entity';
import { TaskResponseDto } from './dto/task.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user.dto';

/**
 * Service for managing tasks.
 * Handles creation, retrieval, updating, and deletion of tasks.
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new task in a project.
   *
   * @param projectId Project ID.
   * @param createTaskDto Task creation data.
   */
  async create(
    projectId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const project = await this.projectsService.findOne(projectId);
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      state: createTaskDto.state,
      startDate: createTaskDto.startDate,
      endDate: createTaskDto.endDate,
      project: { id: project.id } as Project,
    });
    if (createTaskDto.assignedUserIds?.length) {
      const users = await this.usersService.findByIds(
        createTaskDto.assignedUserIds,
      );
      task.assignedUsers = users;
    }
    const savedTask = await this.taskRepository.save(task);
    const taskWithRelations = await this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['project', 'assignedUsers'],
    });
    if (!taskWithRelations) {
      throw new NotFoundException(
        `Task with ID ${savedTask.id} not found after creation`,
      );
    }
    return this.toResponseDto(taskWithRelations);
  }

  /**
   * Returns all tasks.
   */
  async findAll(): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.find({
      relations: ['project', 'assignedUsers'],
    });
    return tasks.map((task) => this.toResponseDto(task));
  }

  /**
   * Returns all tasks in a project.
   *
   * @param projectId Project ID.
   */
  async findAllByProject(projectId: number): Promise<TaskResponseDto[]> {
    await this.projectsService.findOne(projectId);
    const tasks = await this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['assignedUsers', 'project'],
    });
    return tasks.map((task) => this.toResponseDto(task));
  }

  /**
   * Returns all tasks assigned to a user.
   *
   * @param userId User ID.
   */
  async findAllByUser(userId: number): Promise<TaskResponseDto[]> {
    await this.usersService.findOne(userId);
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.assignedUsers', 'user')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUser')
      .where('user.id = :userId', { userId })
      .getMany();
    return tasks.map((task) => this.toResponseDto(task));
  }

  /**
   * Returns a task by project and task ID.
   *
   * @param projectId Project ID.
   * @param taskId Task ID.
   */
  async findOne(projectId: number, taskId: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, project: { id: projectId } },
      relations: ['assignedUsers', 'project'],
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found in project ${projectId}`,
      );
    }
    return this.toResponseDto(task);
  }

  /**
   * Updates a task by project and task ID.
   *
   * @param projectId Project ID.
   * @param taskId Task ID.
   * @param updateTaskDto Update data.
   */
  async update(
    projectId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, project: { id: projectId } },
      relations: ['assignedUsers', 'project'],
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found in project ${projectId}`,
      );
    }
    if (updateTaskDto.assignedUserIds) {
      const users = await this.usersService.findByIds(
        updateTaskDto.assignedUserIds,
      );
      task.assignedUsers = users;
    }
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);
    return this.toResponseDto(updatedTask);
  }

  /**
   * Removes a task by project and task ID.
   *
   * @param projectId Project ID.
   * @param taskId Task ID.
   */
  async remove(projectId: number, taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, project: { id: projectId } },
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found in project ${projectId}`,
      );
    }
    await this.taskRepository.remove(task);
  }

  /**
   * Maps a Task entity to a TaskResponseDto.
   */
  private toResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      state: task.state,
      startDate: new Date(task.startDate).toISOString(),
      endDate: new Date(task.endDate).toISOString(),
      projectId: task.project.id,
      assignedUsers: task.assignedUsers ? plainToInstance(UserResponseDto, task.assignedUsers): []
    };
  }
}
