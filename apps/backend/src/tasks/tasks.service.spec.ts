import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { TaskState } from './enums/task-state.enum';

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: any;
  let usersService: any;
  let projectsService: any;

  beforeEach(async () => {
    tasksRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
      findByIds: jest.fn(),
    };

    projectsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: tasksRepository },
        { provide: UsersService, useValue: usersService },
        { provide: ProjectsService, useValue: projectsService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task with assigned users', async () => {
      const projectId = 1;
      const dto = {
        title: 'New Task',
        description: 'Task description',
        state: TaskState.TODO,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        assignedUserIds: [1, 2],
      };
      const project = { id: 1, title: 'Project A' };
      const users = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];
      const savedTask = {
        id: 1,
        ...dto,
        project: { id: projectId },
        assignedUsers: users,
      };
      const taskWithRelations = {
        ...savedTask,
        project: { id: projectId },
        assignedUsers: users,
      };

      projectsService.findOne.mockResolvedValue(project);
      tasksRepository.create.mockReturnValue(dto);
      tasksRepository.save.mockResolvedValue(savedTask);
      usersService.findByIds.mockResolvedValue(users);
      tasksRepository.findOne.mockResolvedValue(taskWithRelations);

      const result = await service.create(projectId, dto as any);

      expect(projectsService.findOne).toHaveBeenCalledWith(projectId);
      expect(tasksRepository.create).toHaveBeenCalled();
      expect(usersService.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(tasksRepository.save).toHaveBeenCalled();
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedTask.id },
        relations: ['project', 'assignedUsers'],
      });
      expect(result).toEqual({
        id: 1,
        title: dto.title,
        description: dto.description,
        state: dto.state,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        projectId: projectId,
        assignedUsers: [1, 2],
      });
    });

    it('should create a task without assigned users', async () => {
      const projectId = 1;
      const dto = {
        title: 'New Task',
        description: 'Task description',
        state: TaskState.TODO,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      };
      const project = { id: 1, title: 'Project A' };
      const savedTask = {
        id: 1,
        ...dto,
        project: { id: projectId },
        assignedUsers: [],
      };

      projectsService.findOne.mockResolvedValue(project);
      tasksRepository.create.mockReturnValue(dto);
      tasksRepository.save.mockResolvedValue(savedTask);
      tasksRepository.findOne.mockResolvedValue(savedTask);

      const result = await service.create(projectId, dto as any);

      expect(usersService.findByIds).not.toHaveBeenCalled();
      expect(result.assignedUsers).toEqual([]);
    });

    it('should throw NotFoundException if task not found after creation', async () => {
      const projectId = 1;
      const dto = {
        title: 'New Task',
        description: 'Task description',
        state: TaskState.TODO,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      };
      const project = { id: 1, title: 'Project A' };
      const savedTask = { id: 1, ...dto };

      projectsService.findOne.mockResolvedValue(project);
      tasksRepository.create.mockReturnValue(dto);
      tasksRepository.save.mockResolvedValue(savedTask);
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(service.create(projectId, dto as any)).rejects.toThrow(
        new NotFoundException('Task with ID 1 not found after creation'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks as DTOs', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Task A',
          description: 'Desc A',
          state: TaskState.TODO,
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-15'),
          project: { id: 1 },
          assignedUsers: [{ id: 1 }, { id: 2 }],
        },
        {
          id: 2,
          title: 'Task B',
          description: 'Desc B',
          state: TaskState.DONE,
          startDate: new Date('2025-01-16'),
          endDate: new Date('2025-01-31'),
          project: { id: 1 },
          assignedUsers: [],
        },
      ];

      tasksRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(tasksRepository.find).toHaveBeenCalledWith({
        relations: ['project', 'assignedUsers'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        title: 'Task A',
        description: 'Desc A',
        state: TaskState.TODO,
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        projectId: 1,
        assignedUsers: [1, 2],
      });
    });

    it('should return empty array when no tasks exist', async () => {
      tasksRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllByProject', () => {
    it('should return all tasks in a project', async () => {
      const projectId = 1;
      const project = { id: 1, title: 'Project A' };
      const tasks = [
        {
          id: 1,
          title: 'Task A',
          description: 'Desc A',
          state: TaskState.TODO,
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-15'),
          project: { id: projectId },
          assignedUsers: [{ id: 1 }],
        },
      ];

      projectsService.findOne.mockResolvedValue(project);
      tasksRepository.find.mockResolvedValue(tasks);

      const result = await service.findAllByProject(projectId);

      expect(projectsService.findOne).toHaveBeenCalledWith(projectId);
      expect(tasksRepository.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        relations: ['assignedUsers', 'project'],
      });
      expect(result).toHaveLength(1);
      expect(result[0].projectId).toBe(projectId);
    });
  });

  describe('findAllByUser', () => {
    it('should return all tasks assigned to a user', async () => {
      const userId = 1;
      const user = { id: 1, name: 'User A' };
      const tasks = [
        {
          id: 1,
          title: 'Task A',
          description: 'Desc A',
          state: TaskState.TODO,
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-15'),
          project: { id: 1 },
          assignedUsers: [{ id: 1 }],
        },
      ];

      const queryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(tasks),
      };

      usersService.findOne.mockResolvedValue(user);
      tasksRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAllByUser(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(tasksRepository.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(queryBuilder.innerJoin).toHaveBeenCalledWith(
        'task.assignedUsers',
        'user',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'task.project',
        'project',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'task.assignedUsers',
        'assignedUser',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith('user.id = :userId', {
        userId,
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a task by project and task ID', async () => {
      const projectId = 1;
      const taskId = 5;
      const task = {
        id: taskId,
        title: 'Task A',
        description: 'Description',
        state: TaskState.INPROGRESS,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        project: { id: projectId },
        assignedUsers: [{ id: 1 }],
      };

      tasksRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne(projectId, taskId);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, project: { id: projectId } },
        relations: ['assignedUsers', 'project'],
      });
      expect(result).toEqual({
        id: taskId,
        title: 'Task A',
        description: 'Description',
        state: TaskState.INPROGRESS,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        projectId: projectId,
        assignedUsers: [1],
      });
    });

    it('should throw NotFoundException when task does not exist', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found in project 1'),
      );
    });
  });

  describe('update', () => {
    it('should update a task and return DTO', async () => {
      const projectId = 1;
      const taskId = 5;
      const updateDto = { title: 'Updated Task', assignedUserIds: [2, 3] };
      const existingTask = {
        id: taskId,
        title: 'Old Title',
        description: 'Description',
        state: TaskState.TODO,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        project: { id: projectId },
        assignedUsers: [{ id: 1 }],
      };
      const users = [{ id: 2 }, { id: 3 }];
      const updatedTask = {
        ...existingTask,
        ...updateDto,
        assignedUsers: users,
      };

      tasksRepository.findOne.mockResolvedValue(existingTask);
      usersService.findByIds.mockResolvedValue(users);
      tasksRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(projectId, taskId, updateDto as any);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, project: { id: projectId } },
        relations: ['assignedUsers', 'project'],
      });
      expect(usersService.findByIds).toHaveBeenCalledWith([2, 3]);
      expect(tasksRepository.save).toHaveBeenCalledWith(updatedTask);
      expect(result.title).toBe('Updated Task');
      expect(result.assignedUsers).toEqual([2, 3]);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, 999, {} as any)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found in project 1'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const projectId = 1;
      const taskId = 5;
      const task = { id: taskId, title: 'Task A' };

      tasksRepository.findOne.mockResolvedValue(task);
      tasksRepository.remove.mockResolvedValue(undefined);

      await service.remove(projectId, taskId);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, project: { id: projectId } },
      });
      expect(tasksRepository.remove).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found in project 1'),
      );
    });
  });
});
