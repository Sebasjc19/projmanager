import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TasksService } from '../tasks/tasks.service';
import { UserResponseDto } from './dto/user.dto';
import { TaskResponseDto } from '../tasks/dto/task.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { TaskState } from '../tasks/enums/task-state.enum';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
import { UserProjectResponseDto } from '../usersprojects/dto/userproject.dto';
import { UserRole } from '../usersprojects/enums/user-role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let tasksService: jest.Mocked<TasksService>;
  let usersprojectsService: jest.Mocked<UsersprojectsService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockTasksService = {
      findAllByUser: jest.fn(),
    };

    const mockUsersprojectsService = {
      findAllProjectsByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: TasksService, useValue: mockTasksService },
        { provide: UsersprojectsService, useValue: mockUsersprojectsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(OwnerGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ProductionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
    tasksService = module.get(TasksService);
    usersprojectsService = module.get(UsersprojectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult: UserResponseDto = {
        id: 1,
        name: dto.name,
        email: dto.email,
      };

      usersService.create.mockResolvedValue(expectedResult);

      const result = await controller.createUser(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const expectedResult: UserResponseDto[] = [
        { id: 1, name: 'User A', email: 'a@example.com' },
        { id: 2, name: 'User B', email: 'b@example.com' },
      ];

      usersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAllUsers();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      usersService.findAll.mockResolvedValue([]);

      const result = await controller.findAllUsers();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOneUser', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const expectedResult: UserResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      usersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOneUser(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const dto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const expectedResult: UserResponseDto = {
        id: 1,
        name: 'Updated Name',
        email: 'john@example.com',
      };

      usersService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateUser(userId, dto);

      expect(usersService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const userId = '1';

      usersService.remove.mockResolvedValue(undefined);

      await controller.removeUser(userId);

      expect(usersService.remove).toHaveBeenCalledWith(1);
    });
  });

  // ==================== TASK TESTS ====================

  describe('findAllTasksByUser', () => {
    it('should return all tasks assigned to a user', async () => {
      const userId = '1';
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
        {
          id: 2,
          title: 'Task B',
          description: 'Desc B',
          state: TaskState.INPROGRESS,
          startDate: '2025-01-16',
          endDate: '2025-01-31',
          projectId: 2,
          assignedUsers: [1, 2],
        },
      ];

      tasksService.findAllByUser.mockResolvedValue(expectedResult);

      const result = await controller.findAllTasksByUser(userId);

      expect(tasksService.findAllByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no tasks', async () => {
      const userId = '1';

      tasksService.findAllByUser.mockResolvedValue([]);

      const result = await controller.findAllTasksByUser(userId);

      expect(tasksService.findAllByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });
  });

  // ==================== USER-PROJECT TESTS ====================

  describe('getUserProjects', () => {
    it('should return all projects of a user', async () => {
      const userId = '1';
      const expectedResult: UserProjectResponseDto[] = [
        { user: 1, project: 1, role: UserRole.OWNER },
        { user: 1, project: 2, role: UserRole.MEMBER },
      ];

      usersprojectsService.findAllProjectsByUser.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getUserProjects(userId);

      expect(usersprojectsService.findAllProjectsByUser).toHaveBeenCalledWith(
        1,
      );
      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no projects', async () => {
      const userId = '1';

      usersprojectsService.findAllProjectsByUser.mockResolvedValue([]);

      const result = await controller.getUserProjects(userId);

      expect(usersprojectsService.findAllProjectsByUser).toHaveBeenCalledWith(
        1,
      );
      expect(result).toEqual([]);
    });
  });
});
