import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersprojectsService } from './usersprojects.service';
import { UserProject } from './entities/usersproject.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { UserRole } from './enums/user-role.enum';

describe('UsersprojectsService', () => {
  let service: UsersprojectsService;
  let userProjectRepository: any;
  let usersService: any;
  let projectsService: any;

  beforeEach(async () => {
    userProjectRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
    };

    projectsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersprojectsService,
        {
          provide: getRepositoryToken(UserProject),
          useValue: userProjectRepository,
        },
        { provide: UsersService, useValue: usersService },
        { provide: ProjectsService, useValue: projectsService },
      ],
    }).compile();

    service = module.get<UsersprojectsService>(UsersprojectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user-project relationship and return DTO', async () => {
      const dto = { userId: 1, projectId: 2, role: UserRole.MEMBER };
      const user = { id: 1, name: 'User A', email: 'user@example.com' };
      const project = { id: 2, title: 'Project A' };
      const savedUserProject = {
        id: 1,
        user: { id: 1 },
        project: { id: 2 },
        role: UserRole.MEMBER,
      };
      const userProjectWithRelations = {
        id: 1,
        user: { id: 1, name: 'User A' },
        project: { id: 2, title: 'Project A' },
        role: UserRole.MEMBER,
      };

      userProjectRepository.create.mockReturnValue(dto);
      userProjectRepository.save.mockResolvedValue(savedUserProject);
      userProjectRepository.findOne.mockResolvedValue(userProjectWithRelations);

      const result = await service.create(dto as any);

      expect(userProjectRepository.create).toHaveBeenCalledWith({
        user: { id: dto.userId },
        project: { id: dto.projectId },
        role: dto.role,
      });
      expect(userProjectRepository.save).toHaveBeenCalled();
      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedUserProject.id },
        relations: ['user', 'project'],
      });
      expect(result).toEqual({
        user: 1,
        project: 2,
        role: UserRole.MEMBER,
      });
    });

    it('should throw NotFoundException if relation not found after creation', async () => {
      const dto = { userId: 1, projectId: 2, role: UserRole.MEMBER };
      const savedUserProject = { id: 1 };

      usersService.findOne.mockResolvedValue({ id: 1 });
      projectsService.findOne.mockResolvedValue({ id: 2 });
      userProjectRepository.create.mockReturnValue(dto);
      userProjectRepository.save.mockResolvedValue(savedUserProject);
      userProjectRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto as any)).rejects.toThrow(
        new NotFoundException(
          'User-Project relation with ID 1 not found after creation',
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return all user-project relationships as DTOs', async () => {
      const userProjects = [
        {
          id: 1,
          user: { id: 1, name: 'User A' },
          project: { id: 2, title: 'Project A' },
          role: UserRole.MEMBER,
        },
        {
          id: 2,
          user: { id: 2, name: 'User B' },
          project: { id: 3, title: 'Project B' },
          role: UserRole.ADMIN,
        },
      ];
      userProjectRepository.find.mockResolvedValue(userProjects);

      const result = await service.findAll();

      expect(userProjectRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'project'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        user: 1,
        project: 2,
        role: UserRole.MEMBER,
      });
    });

    it('should return empty array when no relationships exist', async () => {
      userProjectRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllProjectsByUser', () => {
    it('should return all projects associated with a user', async () => {
      const userId = 1;
      const usersProjects = [
        { user: { id: 1 }, project: { id: 2 }, role: UserRole.MEMBER },
        { user: { id: 1 }, project: { id: 3 }, role: UserRole.ADMIN },
      ];
      userProjectRepository.find.mockResolvedValue(usersProjects);

      const result = await service.findAllProjectsByUser(userId);

      expect(userProjectRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user', 'project'],
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no projects', async () => {
      userProjectRepository.find.mockResolvedValue([]);

      const result = await service.findAllProjectsByUser(1);

      expect(result).toEqual([]);
    });
  });

  describe('findAllUsersByProject', () => {
    it('should return all users associated with a project', async () => {
      const projectId = 1;
      const usersProjects = [
        { user: { id: 1 }, project: { id: 1 }, role: UserRole.OWNER },
        { user: { id: 2 }, project: { id: 1 }, role: UserRole.MEMBER },
      ];
      userProjectRepository.find.mockResolvedValue(usersProjects);

      const result = await service.findAllUsersByProject(projectId);

      expect(userProjectRepository.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        relations: ['user', 'project'],
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when project has no users', async () => {
      userProjectRepository.find.mockResolvedValue([]);

      const result = await service.findAllUsersByProject(1);

      expect(result).toEqual([]);
    });
  });

  describe('findByUserAndProject', () => {
    it('should return the relationship between a user and project', async () => {
      const userId = 1;
      const projectId = 2;
      const userProject = {
        id: 1,
        user: { id: userId },
        project: { id: projectId },
        role: UserRole.MEMBER,
      };
      userProjectRepository.findOne.mockResolvedValue(userProject);

      const result = await service.findByUserAndProject(userId, projectId);

      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, project: { id: projectId } },
        relations: ['user', 'project'],
      });
      expect(result).toEqual({
        user: userId,
        project: projectId,
        role: UserRole.MEMBER,
      });
    });

    it('should throw NotFoundException when relationship does not exist', async () => {
      userProjectRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUserAndProject(1, 2)).rejects.toThrow(
        new NotFoundException(
          'Relation between user 1 and project 2 not found',
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a user-project relationship by ID', async () => {
      const userProject = {
        id: 1,
        user: { id: 1 },
        project: { id: 2 },
        role: UserRole.ADMIN,
      };
      userProjectRepository.findOne.mockResolvedValue(userProject);

      const result = await service.findOne(1);

      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'project'],
      });
      expect(result).toEqual({
        user: 1,
        project: 2,
        role: UserRole.ADMIN,
      });
    });

    it('should throw NotFoundException when relation does not exist', async () => {
      userProjectRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('User-Project relation with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update the role of a user in a project', async () => {
      const projectId = 1;
      const userId = 2;
      const updateDto = { role: UserRole.ADMIN };
      const existingUserProject = {
        id: 1,
        user: { id: userId },
        project: { id: projectId },
        role: UserRole.MEMBER,
      };
      const updatedUserProject = {
        ...existingUserProject,
        role: UserRole.ADMIN,
      };

      userProjectRepository.findOne.mockResolvedValue(existingUserProject);
      userProjectRepository.save.mockResolvedValue(updatedUserProject);

      const result = await service.update(projectId, userId, updateDto as any);

      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: { project: { id: projectId }, user: { id: userId } },
        relations: ['user', 'project'],
      });
      expect(userProjectRepository.save).toHaveBeenCalledWith(
        updatedUserProject,
      );
      expect(result).toEqual({
        user: userId,
        project: projectId,
        role: UserRole.ADMIN,
      });
    });

    it('should throw NotFoundException when relation does not exist', async () => {
      userProjectRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, 2, { role: UserRole.ADMIN } as any),
      ).rejects.toThrow(new NotFoundException('User 2 not found in project 1'));
    });
  });

  describe('remove', () => {
    it('should remove a user-project relationship', async () => {
      const userProject = { id: 1 };
      userProjectRepository.findOne.mockResolvedValue(userProject);
      userProjectRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(userProjectRepository.remove).toHaveBeenCalledWith(userProject);
    });

    it('should throw NotFoundException when relation does not exist', async () => {
      userProjectRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('User-Project relation with ID 999 not found'),
      );
    });
  });

  describe('removeByProjectAndUser', () => {
    it('should remove a user-project relationship by project and user ID', async () => {
      const projectId = 1;
      const userId = 2;
      const userProject = {
        id: 1,
        user: { id: userId },
        project: { id: projectId },
        role: UserRole.MEMBER,
      };

      userProjectRepository.findOne.mockResolvedValue(userProject);
      userProjectRepository.remove.mockResolvedValue(undefined);

      await service.removeByProjectAndUser(projectId, userId);

      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: {
          project: { id: projectId },
          user: { id: userId },
        },
      });
      expect(userProjectRepository.remove).toHaveBeenCalledWith(userProject);
    });

    it('should throw NotFoundException when relationship does not exist', async () => {
      const projectId = 1;
      const userId = 2;

      userProjectRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeByProjectAndUser(projectId, userId),
      ).rejects.toThrow(
        new NotFoundException(
          `User ${userId} not found in project ${projectId}`,
        ),
      );

      expect(userProjectRepository.findOne).toHaveBeenCalledWith({
        where: {
          project: { id: projectId },
          user: { id: userId },
        },
      });
      expect(userProjectRepository.remove).not.toHaveBeenCalled();
    });
  });
});
