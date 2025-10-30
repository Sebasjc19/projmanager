import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';
import { ProjectResponseDto } from './dto/project.dto';
import { TaskResponseDto } from '../tasks/dto/task.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { projectStatus } from './enums/project-status.enum';
import { TaskState } from '../tasks/enums/task-state.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
import { CreateUsersprojectDto } from '../usersprojects/dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from '../usersprojects/dto/update-usersproject.dto';
import { UserProjectResponseDto } from '../usersprojects/dto/userproject.dto';
import { UserRole } from '../usersprojects/enums/user-role.enum';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: jest.Mocked<ProjectsService>;
  let tasksService: jest.Mocked<TasksService>;
  let usersprojectsService: jest.Mocked<UsersprojectsService>;

  beforeEach(async () => {
    const mockProjectsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockTasksService = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAllByProject: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockUsersprojectsService = {
      create: jest.fn(),
      findAllUsersByProject: jest.fn(),
      update: jest.fn(),
      removeByProjectAndUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: TasksService, useValue: mockTasksService },
        { provide: UsersprojectsService, useValue: mockUsersprojectsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ProjectMemberGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ProjectAdminGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ProjectOwnerGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ProductionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get(ProjectsService);
    tasksService = module.get(TasksService);
    usersprojectsService = module.get(UsersprojectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ==================== PROJECT TESTS ====================

  describe('createProject', () => {
    it('should create a project', async () => {
      const dto: CreateProjectDto = {
        title: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      };
      const ownerId = '1';
      const expectedResult: ProjectResponseDto = {
        id: 1,
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: projectStatus.PLANNED,
      };

      projectsService.create.mockResolvedValue(expectedResult);

      const result = await controller.createProject(ownerId, dto);

      expect(projectsService.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllProjects', () => {
    it('should return all projects', async () => {
      const expectedResult: ProjectResponseDto[] = [
        {
          id: 1,
          title: 'Project A',
          description: 'Desc A',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: projectStatus.ACTIVE,
        },
      ];

      projectsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAllProjects();

      expect(projectsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOneProject', () => {
    it('should return a project by ID', async () => {
      const projectId = '1';
      const expectedResult: ProjectResponseDto = {
        id: 1,
        title: 'Project A',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: projectStatus.ACTIVE,
      };

      projectsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOneProject(projectId);

      expect(projectsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateProject', () => {
    it('should update a project', async () => {
      const projectId = '1';
      const dto: UpdateProjectDto = { title: 'Updated Title' };
      const expectedResult: ProjectResponseDto = {
        id: 1,
        title: 'Updated Title',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: projectStatus.ACTIVE,
      };

      projectsService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateProject(projectId, dto);

      expect(projectsService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeProject', () => {
    it('should remove a project', async () => {
      const projectId = '1';

      projectsService.remove.mockResolvedValue(undefined);

      await controller.removeProject(projectId);

      expect(projectsService.remove).toHaveBeenCalledWith(1);
    });
  });

  // ==================== TASK TESTS ====================

  describe('createTask', () => {
    it('should create a task in a project', async () => {
      const projectId = '1';
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        state: TaskState.TODO,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        assignedUserIds: [1, 2],
      };
      const expectedResult: TaskResponseDto = {
        id: 1,
        title: dto.title,
        description: dto.description,
        state: dto.state,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        projectId: 1,
        assignedUsers: [1, 2],
      };

      tasksService.create.mockResolvedValue(expectedResult);

      const result = await controller.createTask(projectId, dto);

      expect(tasksService.create).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOneTask', () => {
    it('should return a task by project and task ID', async () => {
      const projectId = '1';
      const taskId = '5';
      const expectedResult: TaskResponseDto = {
        id: 5,
        title: 'Task A',
        description: 'Description',
        state: TaskState.INPROGRESS,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        projectId: 1,
        assignedUsers: [1],
      };

      tasksService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOneTask(projectId, taskId);

      expect(tasksService.findOne).toHaveBeenCalledWith(1, 5);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProjectTasks', () => {
    it('should return all tasks in a project', async () => {
      const projectId = '1';
      const expectedResult: TaskResponseDto[] = [
        {
          id: 1,
          title: 'Task A',
          description: 'Desc A',
          state: TaskState.TODO,
          startDate: '2025-01-01',
          endDate: '2025-01-15',
          projectId: 1,
          assignedUsers: [1],
        },
      ];

      tasksService.findAllByProject.mockResolvedValue(expectedResult);

      const result = await controller.getProjectTasks(projectId);

      expect(tasksService.findAllByProject).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const projectId = '1';
      const taskId = '5';
      const dto: UpdateTaskDto = { title: 'Updated Task' };
      const expectedResult: TaskResponseDto = {
        id: 5,
        title: 'Updated Task',
        description: 'Description',
        state: TaskState.INPROGRESS,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        projectId: 1,
        assignedUsers: [1],
      };

      tasksService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateTask(projectId, taskId, dto);

      expect(tasksService.update).toHaveBeenCalledWith(1, 5, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeTask', () => {
    it('should remove a task', async () => {
      const projectId = '1';
      const taskId = '5';

      tasksService.remove.mockResolvedValue(undefined);

      await controller.removeTask(projectId, taskId);

      expect(tasksService.remove).toHaveBeenCalledWith(1, 5);
    });
  });

  // ==================== USER-PROJECT TESTS ====================

  describe('addUserToProject', () => {
    it('should add a user to a project', async () => {
      const projectId = '1';
      const dto: CreateUsersprojectDto = {
        userId: 2,
        projectId: 1,
        role: UserRole.MEMBER,
      };
      const expectedResult: UserProjectResponseDto = {
        user: 2,
        project: 1,
        role: UserRole.MEMBER,
      };

      usersprojectsService.create.mockResolvedValue(expectedResult);

      const result = await controller.addUserToProject(projectId, dto);

      expect(usersprojectsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProjectUsers', () => {
    it('should return all users in a project', async () => {
      const projectId = '1';
      const expectedResult: UserProjectResponseDto[] = [
        { user: 1, project: 1, role: UserRole.OWNER },
        { user: 2, project: 1, role: UserRole.MEMBER },
      ];

      usersprojectsService.findAllUsersByProject.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getProjectUsers(projectId);

      expect(usersprojectsService.findAllUsersByProject).toHaveBeenCalledWith(
        1,
      );
      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role in project', async () => {
      const projectId = '1';
      const userId = '2';
      const dto: UpdateUsersprojectDto = { role: UserRole.ADMIN };
      const expectedResult: UserProjectResponseDto = {
        user: 2,
        project: 1,
        role: UserRole.ADMIN,
      };

      usersprojectsService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateUserRole(projectId, userId, dto);

      expect(usersprojectsService.update).toHaveBeenCalledWith(1, 2, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeUserFromProject', () => {
    it('should remove a user from project', async () => {
      const projectId = '1';
      const userId = '2';

      usersprojectsService.removeByProjectAndUser.mockResolvedValue(undefined);

      await controller.removeUserFromProject(projectId, userId);

      expect(usersprojectsService.removeByProjectAndUser).toHaveBeenCalledWith(
        1,
        2,
      );
    });
  });
});
