import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsController } from './usersprojects.controller';
import { UsersprojectsService } from './usersprojects.service';
import { UserProjectResponseDto } from './dto/userproject.dto';
import { CreateUsersprojectDto } from './dto/create-usersproject.dto';
import { UpdateUsersprojectDto } from './dto/update-usersproject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectAdminGuard } from '../projects/guards/project-admin.guard';
import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ProductionGuard } from '../common/guards/production.guard';
import { UserRole } from './enums/user-role.enum';

describe('UsersprojectsController', () => {
  let controller: UsersprojectsController;
  let usersprojectsService: jest.Mocked<UsersprojectsService>;

  beforeEach(async () => {
    const mockUsersprojectsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByUserAndProject: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersprojectsController],
      providers: [
        { provide: UsersprojectsService, useValue: mockUsersprojectsService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(ProjectAdminGuard).useValue({ canActivate: () => true })
      .overrideGuard(ProjectMemberGuard).useValue({ canActivate: () => true })
      .overrideGuard(ProductionGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersprojectsController>(UsersprojectsController);
    usersprojectsService = module.get(UsersprojectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('findAll', () => {
    it('should return all user-project relationships', async () => {
      const expectedResult: UserProjectResponseDto[] = [
        { user: 1, project: 1, role: UserRole.OWNER },
        { user: 2, project: 1, role: UserRole.MEMBER },
      ];

      usersprojectsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(usersprojectsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no relationships exist', async () => {
      usersprojectsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(usersprojectsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user-project relationship by ID', async () => {
      const id = '1';
      const expectedResult: UserProjectResponseDto = {
        user: 1,
        project: 2,
        role: UserRole.ADMIN,
      };

      usersprojectsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(usersprojectsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByUserAndProject', () => {
    it('should return a specific user-project relationship', async () => {
      const userId = '1';
      const projectId = '2';
      const expectedResult: UserProjectResponseDto = {
        user: 1,
        project: 2,
        role: UserRole.MEMBER,
      };

      usersprojectsService.findByUserAndProject.mockResolvedValue(expectedResult);

      const result = await controller.findByUserAndProject(userId, projectId);

      expect(usersprojectsService.findByUserAndProject).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(expectedResult);
    });
  });
});
