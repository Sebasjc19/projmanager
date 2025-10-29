import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskResponseDto } from './dto/task.dto';
import { TaskState } from './enums/task-state.enum';
import { ProductionGuard } from '../common/guards/production.guard';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: jest.Mocked<TasksService>;

  beforeEach(async () => {
    const mockTasksService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
      ],
    })
      .overrideGuard(ProductionGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const expectedResult: TaskResponseDto[] = [
        {
          id: 1,
          title: 'Task A',
          description: 'Desc A',
          state: TaskState.TODO,
          startDate: '2025-01-01',
          endDate: '2025-01-15',
          projectId: 1,
          assignedUsers: [1, 2],
        },
        {
          id: 2,
          title: 'Task B',
          description: 'Desc B',
          state: TaskState.DONE,
          startDate: '2025-01-16',
          endDate: '2025-01-31',
          projectId: 1,
          assignedUsers: [3],
        },
      ];

      tasksService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(tasksService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no tasks exist', async () => {
      tasksService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(tasksService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
